import React, { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import {
  fetchUpcomingLectures,
  fetchModuleLectures,
  selectUpcomingLecturesState,
  selectUpcomingLecturesData,
  selectModuleLecturesState,
} from "../features/student/studentSlice.js";

function LecturesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("module");

  const upcomingLecturesState = useAppSelector(selectUpcomingLecturesState);
  const upcomingLectures = useAppSelector(selectUpcomingLecturesData);
  
  const moduleLecturesState = useAppSelector((state) => 
    moduleId ? selectModuleLecturesState(state, moduleId) : null
  );
  const moduleLectures = moduleLecturesState?.data || [];

  // Determine which lectures to display
  const displayLectures = moduleId ? moduleLectures : upcomingLectures;
  const displayState = moduleId ? moduleLecturesState : upcomingLecturesState;

  useEffect(() => {
    if (moduleId) {
      // Fetch lectures for specific module
      if (moduleLecturesState?.status === "idle") {
        dispatch(fetchModuleLectures(moduleId));
      }
    } else {
      // Fetch all upcoming lectures
      if (upcomingLecturesState.status === "idle") {
        dispatch(fetchUpcomingLectures(7));
      }
    }
  }, [moduleId, upcomingLecturesState.status, moduleLecturesState?.status, dispatch]);

  // Separate upcoming and past lectures
  const now = new Date();
  const derived = useMemo(() => {
    if (!displayLectures || displayLectures.length === 0) {
      return {
        upcoming: [],
        completed: [],
      };
    }

    const upcoming = displayLectures.filter((lecture) => {
      const startTime = lecture.startTime ? new Date(lecture.startTime) : null;
      return startTime && startTime > now;
    });

    const completed = displayLectures.filter((lecture) => {
      const startTime = lecture.startTime ? new Date(lecture.startTime) : null;
      return startTime && startTime <= now;
    });

    return {
      upcoming: upcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
      completed: completed.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)),
    };
  }, [displayLectures]);

  const handleRetry = () => {
    if (moduleId) {
      dispatch(fetchModuleLectures(moduleId));
    } else {
      dispatch(fetchUpcomingLectures(7));
    }
  };

  return (
    <div className="stack fade-in" style={{ gap: "var(--space-6)" }}>
      <div className="stack" style={{ gap: "var(--space-2)" }}>
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          style={{ width: "fit-content" }}
        >
          Back
        </Button>
        <h2 style={{ fontSize: "var(--text-3xl)", margin: 0 }}>Live lectures</h2>
        {moduleId && (
          <p style={{ color: "var(--text-tertiary)", margin: 0 }}>
            Lectures for this module
          </p>
        )}
        {!moduleId && (
          <p style={{ color: "var(--text-tertiary)", margin: 0 }}>
            Join upcoming live sessions or catch up using detailed walkthroughs and recordings.
          </p>
        )}
      </div>

      {displayState?.status === "loading" && !displayLectures.length && (
        <Card tone="soft" className="slide-up">
          <div className="stack" style={{ gap: "var(--space-3)" }}>
            <StatusPill tone="info">Loading lectures</StatusPill>
            <p style={{ margin: 0, color: "var(--text-tertiary)" }}>
              We're fetching your upcoming sessions and past recordings.
            </p>
          </div>
        </Card>
      )}

      {displayState?.status === "failed" && !displayLectures.length && (
        <Card
          tone="soft"
          className="slide-up"
          style={{
            background: "linear-gradient(135deg, rgba(248,113,113,0.2), rgba(220,38,38,0.1))",
            border: "1px solid rgba(248,113,113,0.35)",
            boxShadow: "0 28px 60px rgba(248, 113, 113, 0.2)",
          }}
        >
          <div className="stack" style={{ gap: "var(--space-3)", alignItems: "flex-start" }}>
            <StatusPill tone="error">Could not load lectures</StatusPill>
            <p style={{ margin: 0, color: "var(--text-primary)" }}>
              {displayState?.error || "Please try again."}
            </p>
            <Button variant="secondary" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {displayState?.status === "succeeded" && (
        <>
          <section className="stack" style={{ gap: "var(--space-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "var(--text-xl)" }}>Upcoming</h3>
              <Button size="sm" variant="subtle">
                Sync calendar
              </Button>
            </div>
            {derived.upcoming.length === 0 ? (
              <EmptyState
                title="No scheduled lectures"
                description="We will publish the next batch of live sessions soon. Keep an eye on your inbox."
                actionLabel="Review modules"
                onAction={() => navigate("/courses")}
                className="slide-up"
              />
            ) : (
              <div className="stack" style={{ gap: "var(--space-4)" }}>
                {derived.upcoming.map((lecture) => {
                  const startTime = new Date(lecture.startTime);
                  const formattedDate = startTime.toLocaleString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  });

                  const mentorName = lecture.teacher?.user
                    ? `${lecture.teacher.user.firstName} ${lecture.teacher.user.lastName}`
                    : lecture.mentor || "Mentor";

                  return (
                    <Card key={lecture._id} className="slide-up">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "var(--space-4)",
                        }}
                      >
                        <div className="stack" style={{ gap: "var(--space-3)", flex: 1 }}>
                          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
                            <StatusPill tone="warning">Live session</StatusPill>
                            {lecture.sessionId && (
                              <span style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                backgroundColor: "#e0e7ff",
                                color: "#4f46e5",
                                fontSize: "var(--text-sm)",
                                fontWeight: 600,
                              }}>
                                🎥 Fermion Session
                              </span>
                            )}
                          </div>
                          <h4 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>
                            {lecture.topic || lecture.title || "Lecture"}
                          </h4>
                          <p style={{ margin: 0, color: "var(--text-tertiary)" }}>
                            {mentorName}
                          </p>
                          {lecture.module?.title && (
                            <p style={{ margin: 0, color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                              <strong>Module:</strong> {lecture.module.title}
                            </p>
                          )}
                          {lecture.tags && lecture.tags.length > 0 && (
                            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                              {lecture.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="badge-pill"
                                  style={{ fontWeight: 500 }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <div style={{ fontSize: "var(--text-lg)", fontWeight: 700 }}>
                            {formattedDate}
                          </div>
                          <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                            IST
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-5)", flexWrap: "wrap" }}>
                        {lecture.sessionId ? (
                          <>
                            <Button
                              as={Link}
                              to={`/lectures/${lecture._id}`}
                              style={{ backgroundColor: "#6366f1" }}
                            >
                              🎥 Join Fermion Session
                            </Button>
                            {lecture.meetingLink && (
                              <Button
                                as="a"
                                href={lecture.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                variant="secondary"
                              >
                                📞 Meeting Link
                              </Button>
                            )}
                          </>
                        ) : lecture.meetingLink ? (
                          <>
                            <Button
                              as="a"
                              href={lecture.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Join live
                            </Button>
                            <Button
                              as={Link}
                              size="sm"
                              variant="secondary"
                              to={`/lectures/${lecture._id}`}
                            >
                              View brief
                            </Button>
                          </>
                        ) : (
                          <Button disabled>
                            Join link not available
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {derived.completed.length > 0 && (
            <section className="stack" style={{ gap: "var(--space-4)" }}>
              <h3 style={{ margin: 0, fontSize: "var(--text-xl)" }}>Past lectures</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "var(--space-4)",
                }}
              >
                {derived.completed.map((lecture) => {
                  const mentorName = lecture.teacher?.user
                    ? `${lecture.teacher.user.firstName} ${lecture.teacher.user.lastName}`
                    : lecture.mentor || "Mentor";

                  return (
                    <Card key={lecture._id} className="slide-up">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                        <div>
                          <StatusPill tone="info">Recording available</StatusPill>
                        </div>
                        {lecture.sessionId && (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            backgroundColor: "#e0e7ff",
                            color: "#4f46e5",
                            fontSize: "var(--text-sm)",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}>
                            🎥 Fermion
                          </span>
                        )}
                      </div>
                      <h4 style={{ margin: "var(--space-3) 0", fontSize: "var(--text-xl)" }}>
                        {lecture.topic || lecture.title || "Lecture"}
                      </h4>
                      <p style={{ margin: 0, color: "var(--text-tertiary)" }}>
                        {mentorName}
                      </p>
                      {lecture.module?.title && (
                        <p style={{ margin: "var(--space-2) 0 0 0", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                          <strong>Module:</strong> {lecture.module.title}
                        </p>
                      )}
                      <div className="stack" style={{ gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
                        {lecture.sessionId && (
                          <Button
                            as={Link}
                            to={`/lectures/${lecture._id}`}
                            size="sm"
                            style={{ width: "100%", backgroundColor: "#6366f1" }}
                          >
                            🎥 Watch on Fermion
                          </Button>
                        )}
                        {lecture.recordingLink ? (
                          <Button
                            as="a"
                            href={lecture.recordingLink}
                            target="_blank"
                            rel="noreferrer"
                            size="sm"
                            variant="secondary"
                            style={{ width: "100%" }}
                          >
                            Watch recording
                          </Button>
                        ) : (
                          <Button
                            as={Link}
                            to={`/lectures/${lecture._id}`}
                            size="sm"
                            variant="secondary"
                            style={{ width: "100%" }}
                          >
                            View details
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default LecturesPage;
