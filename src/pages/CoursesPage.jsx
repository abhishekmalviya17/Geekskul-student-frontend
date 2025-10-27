import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import {
  fetchStudentCourses,
  selectCoursesState,
  selectStudentCourses,
} from "../features/student/studentSlice.js";

function CoursesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const coursesState = useAppSelector(selectCoursesState);
  const courses = useAppSelector(selectStudentCourses);

  useEffect(() => {
    if (coursesState.status === "idle") {
      dispatch(fetchStudentCourses());
    }
  }, [coursesState.status, dispatch]);

  const handleRetry = () => {
    dispatch(fetchStudentCourses());
  };

  return (
    <div className="stack fade-in" style={{ gap: "var(--space-6)" }}>
      <header className="stack" style={{ gap: "var(--space-2)" }}>
        <StatusPill tone="info">Your courses</StatusPill>
        <h1 style={{ fontSize: "var(--text-4xl)", margin: 0 }}>Enrolled Courses</h1>
        <p style={{ color: "var(--text-tertiary)", margin: 0 }}>
          Access your learning cohorts and unlock modules as mentors release them.
        </p>
      </header>

      {coursesState.status === "loading" && !courses.length && (
        <Card tone="soft" className="slide-up">
          <div className="stack" style={{ gap: "var(--space-3)" }}>
            <StatusPill tone="info">Loading your courses</StatusPill>
            <p style={{ margin: 0, color: "var(--text-tertiary)" }}>
              We're fetching your enrollments and checking module availability.
            </p>
          </div>
        </Card>
      )}

      {coursesState.status === "failed" && !courses.length && (
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
            <StatusPill tone="error">Could not load courses</StatusPill>
            <p style={{ margin: 0, color: "var(--text-primary)" }}>
              {coursesState.error || "Please try again."}
            </p>
            <Button variant="secondary" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {coursesState.status === "succeeded" && courses.length === 0 && (
        <EmptyState
          title="No courses yet"
          description="You don't have any active enrollments. Check with your admin or mentor."
          className="slide-up"
        />
      )}

      {coursesState.status === "succeeded" && courses.length > 0 && (
        <section className="stack" style={{ gap: "var(--space-4)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {courses.map((course) => {
              const modulesLocked = !course.hasOpenModules;

              return (
                <Card
                  key={course._id}
                  className="slide-up"
                  style={{
                    opacity: modulesLocked ? 0.82 : 1,
                    filter: modulesLocked ? "grayscale(0.12)" : "none",
                    transition: "opacity 0.2s, filter 0.2s",
                  }}
                >
                  <div className="stack" style={{ gap: "var(--space-4)" }}>
                    {/* Header with Status */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "var(--space-3)",
                      }}
                    >
                      <div className="stack" style={{ gap: "var(--space-2)", flex: 1 }}>
                        <h2 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>
                          {course.title || "Untitled Course"}
                        </h2>
                        {course.courseSubheading && (
                          <p style={{ margin: 0, color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                            {course.courseSubheading}
                          </p>
                        )}
                      </div>
                      <StatusPill tone={modulesLocked ? "warning" : "success"}>
                        {modulesLocked ? "Modules locked" : "Modules unlocked"}
                      </StatusPill>
                    </div>

                    {/* Course Details */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "var(--space-3)",
                        color: "var(--text-tertiary)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {course.batchName && (
                        <span>
                          <strong>Cohort:</strong> {course.batchName}
                        </span>
                      )}
                      {course.batchStartDate && (
                        <span>
                          <strong>Starts:</strong>{" "}
                          {new Date(course.batchStartDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {course.batchEndDate && (
                        <span>
                          <strong>Ends:</strong>{" "}
                          {new Date(course.batchEndDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Helper Text for Locked Modules */}
                    {modulesLocked && (
                      <Card tone="soft" style={{ background: "var(--surface-subtle)" }}>
                        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--text-tertiary)" }}>
                          ⏳ Modules unlock soon. Watch for updates from your mentor.
                        </p>
                      </Card>
                    )}

                    {/* Call-to-Action Button */}
                    <div style={{ display: "flex", gap: "var(--space-3)" }}>
                      <Button
                        as={Link}
                        to={`/courses/${course._id}/modules`}
                        disabled={modulesLocked}
                        style={{ flex: 1 }}
                      >
                        View modules
                      </Button>
                      <Button
                        variant="secondary"
                        as={Link}
                        to={`/courses/${course._id}`}
                        style={{ flex: 1 }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default CoursesPage;
