import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import FermionPlayer from "../components/ui/FermionPlayer.jsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import {
  fetchLectureDetail,
  selectLectureDetailState,
} from "../features/student/studentSlice.js";
import { selectProfileUser } from "../features/profile/profileSlice.js";
import { selectCurrentUser } from "../features/auth/authSlice.js";

function AttendLecturePage() {
  const { lectureId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const lectureState = useAppSelector(selectLectureDetailState);
  const lecture = lectureState?.data;
  const profileUser = useAppSelector(selectProfileUser);
  const authUser = useAppSelector(selectCurrentUser);
  const user = profileUser || authUser;
  const userId = user?._id || user?.id || null;
  const [fermionError, setFermionError] = useState(null);
  const [showFermionPlayer, setShowFermionPlayer] = useState(false);

  useEffect(() => {
    if (lectureId && lectureState.status === "idle") {
      dispatch(fetchLectureDetail(lectureId));
    }
  }, [lectureId, lectureState.status, dispatch]);

  if (lectureState.status === "loading") {
    return (
      <Card tone="soft" className="slide-up">
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <StatusPill tone="info">Loading lecture</StatusPill>
          <p style={{ margin: 0, color: "var(--text-tertiary)" }}>
            We're fetching the lecture details for you.
          </p>
        </div>
      </Card>
    );
  }

  if (lectureState.status === "failed" || !lecture) {
    return (
      <EmptyState
        title="Lecture not found"
        description="This lecture might have been archived or assigned to another cohort."
        actionLabel="Back to lectures"
        onAction={() => navigate("/lectures")}
        className="rise-in"
      />
    );
  }

  const isUpcoming = lecture.startTime && new Date(lecture.startTime) > new Date();
  const mentorName = lecture.teacher?.user
    ? `${lecture.teacher.user.firstName} ${lecture.teacher.user.lastName}`
    : lecture.mentor || "Mentor";

  const moduleLabel = lecture.module?.title || "N/A";

  return (
    <div className="stack fade-in" style={{ gap: "var(--space-5)", maxWidth: 860 }}>
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        style={{ width: "fit-content" }}
      >
        ← Back
      </Button>

      <Card className="rise-in">
        <div className="stack" style={{ gap: "var(--space-4)" }}>
          <div>
            <StatusPill tone={isUpcoming ? "warning" : "info"}>
              {isUpcoming ? "Upcoming session" : "Recording"}
            </StatusPill>
            <h2 style={{ fontSize: "var(--text-3xl)", margin: "var(--space-3) 0" }}>
              {lecture.topic || lecture.title || "Lecture"}
            </h2>
            <p style={{ color: "var(--text-tertiary)", margin: 0 }}>
              Led by {mentorName}
            </p>
            {lecture.description && (
              <p style={{ color: "var(--text-secondary)", margin: "var(--space-3) 0 0 0" }}>
                {lecture.description}
              </p>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: "var(--space-4)",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div className="glass-card" style={{ padding: "var(--space-4)" }}>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>
                Schedule
              </div>
              <div style={{ fontWeight: 700, marginTop: "var(--space-2)" }}>
                {new Date(lecture.startTime).toLocaleString("en-IN", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div style={{ color: "var(--text-tertiary)", marginTop: "var(--space-2)" }}>
                Duration • {lecture.duration || "90"} minutes
              </div>
            </div>

            <div className="glass-card" style={{ padding: "var(--space-4)" }}>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>
                Focus areas & Module
              </div>
              <div style={{ marginTop: "var(--space-3)" }}>
                {lecture.tags && lecture.tags.length > 0 && (
                  <>
                    {lecture.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge-pill"
                        style={{ marginRight: "var(--space-2)", marginBottom: "var(--space-2)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </>
                )}
              </div>
              <div style={{ marginTop: "var(--space-3)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                Module • {moduleLabel}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", flexDirection: "column" }}>
            {isUpcoming ? (
              <>
                {lecture.sessionId ? (
                  <div style={{ width: "100%" }}>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)", margin: "0 0 var(--space-2) 0" }}>
                      ✨ This lecture has a live Fermion session. Join below:
                    </p>
                    <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                      <Button 
                        type="button"
                        onClick={() => {
                          setShowFermionPlayer(prev => !prev);
                        }}
                      >
                        🎥 Join Fermion Session
                      </Button>
                      {lecture.meetingLink && (
                        <Button as="a" href={lecture.meetingLink} target="_blank" rel="noreferrer" variant="secondary">
                          📱 Join via Meeting Link
                        </Button>
                      )}
                    </div>
                    {showFermionPlayer && userId && (
                      <Card className="rise-in" style={{ marginTop: "var(--space-4)" }}>
                        <FermionPlayer
                          sessionId={lecture.sessionId}
                          userId={userId}
                          lectureTitle={lecture.topic || lecture.title || "Live Session"}
                          onError={setFermionError}
                        />
                      </Card>
                    )}
                  </div>
                ) : lecture.meetingLink ? (
                  <Button as="a" href={lecture.meetingLink} target="_blank" rel="noreferrer">
                    Join the live session
                  </Button>
                ) : (
                  <Button disabled>
                    Join link not available yet
                  </Button>
                )}
              </>
            ) : (
              <>
                {lecture.sessionId && (
                  <div style={{ width: "100%" }}>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-tertiary)", margin: "0 0 var(--space-2) 0" }}>
                      🎥 Watch this lecture's Fermion recording:
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowFermionPlayer(prev => !prev);
                      }}
                    >
                      🎥 View Fermion Recording
                    </Button>
                    {showFermionPlayer && userId && (
                      <Card className="rise-in" style={{ marginTop: "var(--space-4)" }}>
                        <FermionPlayer
                          sessionId={lecture.sessionId}
                          userId={userId}
                          lectureTitle={lecture.topic || lecture.title || "Live Session"}
                          onError={setFermionError}
                        />
                      </Card>
                    )}
                  </div>
                )}
                {lecture.recordingLink ? (
                  <Button as="a" href={lecture.recordingLink} target="_blank" rel="noreferrer">
                    Watch the recording
                  </Button>
                ) : (
                  <Button disabled>
                    Recording not available yet
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      {fermionError && (
        <Card tone="error" className="rise-in">
          <p style={{ margin: 0, color: "var(--text-error)" }}>
            ⚠️ Fermion Player Error: {fermionError}
          </p>
          {lecture.meetingLink && (
            <p style={{ margin: "var(--space-2) 0 0 0", color: "var(--text-secondary)" }}>
              Try joining via: <Button as="a" href={lecture.meetingLink} target="_blank" rel="noreferrer">Meeting Link</Button>
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

export default AttendLecturePage;
