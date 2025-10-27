import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import {
  fetchStudentCourses,
  fetchStudentCourseOutline,
  selectCoursesState,
  selectCourseOutlineState,
  selectStudentCourses,
} from "../features/student/studentSlice.js";

function CourseModulesPage() {
  const { courseId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const coursesState = useAppSelector(selectCoursesState);
  const courses = useAppSelector(selectStudentCourses);
  const outlineState = useAppSelector((state) => selectCourseOutlineState(state, courseId));
  const outlineStatus = outlineState?.status ?? "idle";
  const course = courses.find((item) => item._id === courseId);
  const hasCourseAccess = Boolean(course);

  useEffect(() => {
    if (coursesState.status === "idle") {
      dispatch(fetchStudentCourses());
    }
  }, [coursesState.status, dispatch]);

  useEffect(() => {
    if (!course && coursesState.status === "succeeded") {
      navigate("/courses", { replace: true });
    }
  }, [course, coursesState.status, navigate]);

  useEffect(() => {
    if (!courseId || !hasCourseAccess) {
      return;
    }

    if (outlineStatus === "idle") {
      dispatch(fetchStudentCourseOutline(courseId));
    }
  }, [courseId, hasCourseAccess, outlineStatus, dispatch]);

  const batches = outlineState?.data?.batches ?? [];
  const modulesLocked = course && !course.hasOpenModules;

  const handleRetry = () => {
    if (courseId) {
      dispatch(fetchStudentCourseOutline(courseId));
    }
  };

  return (
    <div className="stack fade-in" style={{ gap: "var(--space-6)" }}>
      <Button variant="ghost" onClick={() => navigate(-1)} style={{ width: "fit-content" }}>
        Back
      </Button>

      <header className="stack" style={{ gap: "var(--space-2)" }}>
        <StatusPill tone="info">Course modules</StatusPill>
        <h1 style={{ fontSize: "var(--text-4xl)", margin: 0 }}>{course?.title ?? "Course"}</h1>
        {course?.courseSubheading && (
          <p style={{ color: "var(--text-tertiary)", margin: 0 }}>{course.courseSubheading}</p>
        )}
        {course && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", color: "var(--text-tertiary)" }}>
            {course.batchName && (
              <span>
                <strong>Cohort:</strong> {course.batchName}
              </span>
            )}
            {course.batchStartDate && (
              <span>
                <strong>Starts:</strong> {new Date(course.batchStartDate).toLocaleDateString("en-IN")}
              </span>
            )}
            {course.batchEndDate && (
              <span>
                <strong>Ends:</strong> {new Date(course.batchEndDate).toLocaleDateString("en-IN")}
              </span>
            )}
          </div>
        )}
      </header>

      {modulesLocked && outlineState?.status === "succeeded" && (
        <Card
          tone="soft"
          className="slide-up"
          style={{
            background: "linear-gradient(135deg, rgba(217,119,6,0.2), rgba(180,83,9,0.1))",
            border: "1px solid rgba(217,119,6,0.35)",
            boxShadow: "0 28px 60px rgba(217, 119, 6, 0.15)",
          }}
        >
          <div className="stack" style={{ gap: "var(--space-3)", alignItems: "flex-start" }}>
            <StatusPill tone="warning">All modules are locked</StatusPill>
            <p style={{ margin: 0, color: "var(--text-primary)" }}>
              ⏳ Your mentor hasn't unlocked any modules yet. Check back soon for updates!
            </p>
          </div>
        </Card>
      )}

      {(!outlineState || outlineState.status === "loading") && (
        <Card tone="soft" className="slide-up">
          <div className="stack" style={{ gap: "var(--space-3)" }}>
            <StatusPill tone="info">Preparing modules</StatusPill>
            <p style={{ margin: 0, color: "var(--text-tertiary)" }}>
              Fetching your module roadmap with lecture counts and release status.
            </p>
          </div>
        </Card>
      )}

      {outlineState && outlineState.status === "failed" && (
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
            <StatusPill tone="error">Could not load modules</StatusPill>
            <p style={{ margin: 0, color: "var(--text-primary)" }}>{outlineState.error ?? "Please try again."}</p>
            <Button variant="secondary" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {outlineState && outlineState.status === "succeeded" && batches.every((batch) => batch.modules.length === 0) && (
        <EmptyState
          title="Modules are on the way"
          description="We will surface modules here as soon as your mentor unlocks them."
          className="slide-up"
        />
      )}

      {outlineState && outlineState.status === "succeeded" && batches.some((batch) => batch.modules.length > 0) && (
        <section className="stack" style={{ gap: "var(--space-4)" }}>
          {batches.map((batch) => (
            <Card key={batch._id} className="slide-up">
              <div className="stack" style={{ gap: "var(--space-4)" }}>
                <header className="stack" style={{ gap: "var(--space-2)" }}>
                  <h2 style={{ margin: 0, fontSize: "var(--text-2xl)" }}>{batch.batchName}</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", color: "var(--text-tertiary)" }}>
                    <span>
                      <strong>Batch status:</strong> {batch.status ?? "Active"}
                    </span>
                    {batch.startDate && (
                      <span>
                        <strong>Starts:</strong> {new Date(batch.startDate).toLocaleDateString("en-IN")}
                      </span>
                    )}
                    {batch.endDate && (
                      <span>
                        <strong>Ends:</strong> {new Date(batch.endDate).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </header>

                {batch.modules.length === 0 && (
                  <EmptyState
                    title="No modules unlocked"
                    description="Your mentor will unlock modules here once the cohort is ready."
                  />
                )}

                {batch.modules.length > 0 && (
                  <div className="stack" style={{ gap: "var(--space-3)" }}>
                    {batch.modules.map((module) => (
                      <div
                        key={module._id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-3)",
                          padding: "var(--space-4)",
                          borderRadius: "var(--radius-lg)",
                          background: "var(--surface-subtle)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "var(--space-3)",
                          }}
                        >
                          <div className="stack" style={{ gap: "var(--space-2)" }}>
                            <h3 style={{ margin: 0, fontSize: "var(--text-xl)" }}>{module.title}</h3>
                            {module.description && (
                              <p style={{ margin: 0, color: "var(--text-tertiary)" }}>{module.description}</p>
                            )}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", color: "var(--text-tertiary)" }}>
                              <span>
                                <strong>Lectures:</strong> {module.lectures?.length ?? 0}
                              </span>
                              <span>
                                <strong>Completed:</strong> {module.completedCount ?? 0}
                              </span>
                              <span>
                                <strong>Upcoming:</strong> {module.upcomingCount ?? 0}
                              </span>
                            </div>
                          </div>
                          <StatusPill tone={module.accessible ? "success" : "warning"}>
                            {module.accessible ? "Open" : "Locked"}
                          </StatusPill>
                        </div>

                        <div style={{ display: "flex", gap: "var(--space-3)" }}>
                          {module.accessible ? (
                            <Button as={Link} to={`/lectures?module=${module._id}`}>
                              Go to lectures
                            </Button>
                          ) : (
                            <Button variant="secondary" disabled>
                              Waiting for release
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}

export default CourseModulesPage;
