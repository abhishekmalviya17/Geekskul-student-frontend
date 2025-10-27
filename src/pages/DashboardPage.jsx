import React, { useEffect, useMemo } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import { selectCurrentUser } from "../features/auth/authSlice.js";
import {
  fetchStudentDashboard,
  selectDashboardState,
} from "../features/student/studentSlice.js";

function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { data: dashboard, status, error } = useAppSelector(selectDashboardState);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStudentDashboard());
    }
  }, [dispatch, status]);

  const derived = useMemo(() => {
    if (!dashboard) {
      return {
        greeting: user?.name ? `Hi, ${user.name}` : "Hi there",
        message:
          "We’re getting your cohort data ready. Hang tight for personalised insights.",
        courses: [],
        batches: [],
        upcomingLectures: [],
        timeline: [],
        completion: 0,
        moduleSparkline: [],
        quickStats: [
          {
            label: "Enrolled courses",
            value: "—",
            detail: "Pending data",
            accent: "sky",
          },
          {
            label: "Upcoming lectures",
            value: "—",
            detail: "Pending data",
            accent: "emerald",
          },
          {
            label: "Open modules",
            value: "—",
            detail: "Pending data",
            accent: "amber",
          },
        ],
        recentQueries: [],
      };
    }

    const courses = dashboard.courses || [];
    const batches = dashboard.batches || [];
    const upcomingLectures = dashboard.upcomingLectures || [];
    const recentQueries = dashboard.recentQueries || [];
    const modules = batches.flatMap((batch) => batch.modules || []);
    const lectures = modules.flatMap((module) => module.lectures || []);
    const now = new Date();
    const completedLectures = lectures.filter((lecture) => {
      if (!lecture?.endTime) return false;
      return new Date(lecture.endTime) < now;
    }).length;
    const totalLectures = lectures.length;
    const completion = totalLectures
      ? Math.min(100, Math.round((completedLectures / totalLectures) * 100))
      : 0;

    const openModules = modules.filter(
      (module) => module?.isOpen || module?.accessible
    ).length;

    const moduleSparkline = modules.slice(0, 4).map((module) => {
      const moduleLectures = module.lectures || [];
      const moduleCompleted = moduleLectures.filter((lecture) => {
        if (!lecture?.endTime) return false;
        return new Date(lecture.endTime) < now;
      }).length;
      const moduleCompletion = moduleLectures.length
        ? Math.round((moduleCompleted / moduleLectures.length) * 100)
        : 0;
      return {
        id: module._id || module.id || module.title,
        title: module.title,
        completion: moduleCompletion,
      };
    });

    const timeline = upcomingLectures.slice(0, 3).map((lecture) => {
      const startTime = lecture.startTime ? new Date(lecture.startTime) : null;
      const formattedTime = startTime
        ? startTime.toLocaleString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : "Schedule pending";
      return {
        id: lecture._id || lecture.id,
        title: lecture.topic || lecture.title,
        meta: `${lecture.mentor?.name || lecture.mentor || "Mentor"} · ${formattedTime}`,
        link: lecture.meetingLink || "#",
      };
    });

    const quickStats = [
      {
        label: "Enrolled courses",
        value: courses.length,
        detail:
          courses.length === 1
            ? "You’re part of 1 active journey"
            : `You’re part of ${courses.length} active journeys`,
        accent: "sky",
      },
      {
        label: "Upcoming lectures",
        value: upcomingLectures.length,
        detail:
          upcomingLectures.length > 0
            ? "Next 7 days schedule"
            : "No sessions scheduled",
        accent: "emerald",
      },
      {
        label: "Open modules",
        value: openModules,
        detail:
          openModules > 0
            ? "Ready for deep dives"
            : "Modules unlock soon",
        accent: "amber",
      },
    ];

    const primaryBatch = batches[0];
    const primaryCourse = courses[0];
    const primaryBatchName =
      primaryBatch?.name || primaryCourse?.batchName || "Your cohort";
    const mentorName =
      primaryBatch?.mentor?.name ||
      primaryCourse?.mentorName ||
      primaryCourse?.mentor ||
      null;
    const fallbackGreeting = user?.name
      ? `${user.name.split(" ")[0]}, your learning runway is clear.`
      : "Your learning runway is clear.";
    const fallbackMessage = completion
      ? `You’re ${completion}% through the program. Keep the momentum for mentor masterclasses.`
      : "Jump into your first module to unlock personalised guidance.";

    return {
      greeting: dashboard.greeting || fallbackGreeting,
      message: dashboard.message || fallbackMessage,
      courses,
      batches,
      upcomingLectures,
      recentQueries,
      timeline,
      completion,
      moduleSparkline,
      quickStats,
      primaryBatchName,
      mentorName,
    };
  }, [dashboard, user?.name]);

  const handleRetry = () => {
    dispatch(fetchStudentDashboard());
  };

  if (status === "failed" && !dashboard) {
    return (
      <div className="dashboard-frame">
        <Card className="dashboard-card" tone="soft">
          <h2>We couldn’t load your dashboard</h2>
          <p style={{ color: "var(--text-tertiary)" }}>
            {error ||
              "Please check your connection and try again. If the problem persists, contact support."}
          </p>
          <Button onClick={handleRetry}>Retry</Button>
        </Card>
      </div>
    );
  }

  const loading = status === "loading" && !dashboard;
  const nextLecture = derived.upcomingLectures[0];
  const nextLectureTime = nextLecture?.startTime
    ? new Date(nextLecture.startTime).toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="dashboard-frame">
      <Card tone="soft" className="dashboard-hero">
        <div className="dashboard-hero__glow" aria-hidden>
          <span className="dashboard-hero__orb dashboard-hero__orb--primary" />
          <span className="dashboard-hero__orb dashboard-hero__orb--secondary" />
        </div>
        <div className="dashboard-hero__content">
          <StatusPill tone="info">{derived.primaryBatchName}</StatusPill>
          <h1>{derived.greeting}</h1>
          <p>{derived.message}</p>
          <div className="dashboard-hero__cta">
            <Button size="lg" disabled={loading}>
              {loading ? "Loading…" : "Resume learning"}
            </Button>
            <Button size="lg" variant="secondary" disabled={loading}>
              View assignments
            </Button>
          </div>
        </div>
        <div className="dashboard-hero__meter">
          <div className="dashboard-hero__meter-ring" aria-hidden>
            <span>{derived.completion}%</span>
          </div>
          <div className="dashboard-hero__meter-copy">
            <strong>Overall completion</strong>
            <span>
              {derived.mentorName
                ? `Mentored by ${derived.mentorName}`
                : "Mentor assignment coming soon"}
            </span>
          </div>
        </div>
      </Card>

      <section className="dashboard-stats">
        {derived.quickStats.map((stat) => (
          <article key={stat.label} className={`dashboard-stat dashboard-stat--${stat.accent}`}>
            <span className="dashboard-stat__label">{stat.label}</span>
            <strong className="dashboard-stat__value">{stat.value}</strong>
            <span className="dashboard-stat__detail">{stat.detail}</span>
            <span className="dashboard-stat__pulse" aria-hidden />
          </article>
        ))}
      </section>

      <section className="dashboard-panels">
        {nextLecture && (
          <Card className="dashboard-card dashboard-card--accent">
            <div className="dashboard-card__header">
              <StatusPill tone="warning">Next live session</StatusPill>
              <span className="dashboard-card__time">{nextLectureTime || "TBD"}</span>
            </div>
            <h3>{nextLecture.topic || nextLecture.title}</h3>
            <p>{nextLecture.mentor?.name || nextLecture.mentor || "Mentor"}</p>
            <div className="dashboard-card__actions">
              <Button
                size="sm"
                as={nextLecture.meetingLink ? "a" : "button"}
                href={nextLecture.meetingLink || undefined}
                target={nextLecture.meetingLink ? "_blank" : undefined}
                rel={nextLecture.meetingLink ? "noreferrer" : undefined}
                aria-disabled={!nextLecture.meetingLink}
              >
                Join session
              </Button>
              <Button size="sm" variant="secondary">
                Session brief
              </Button>
            </div>
            <ul className="dashboard-card__tags">
              {(nextLecture.tags || []).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </Card>
        )}

        {derived.timeline.length > 0 && (
          <Card className="dashboard-card">
            <span className="dashboard-card__eyebrow">Upcoming timeline</span>
            <ul className="timeline">
              {derived.timeline.map((item, index) => (
                <li key={item.id} className="timeline__item">
                  <div className="timeline__dot" aria-hidden />
                  <div className="timeline__content">
                    <h4>{item.title}</h4>
                    <span>{item.meta}</span>
                    <a
                      href={item.link}
                      target={item.link && item.link !== "#" ? "_blank" : undefined}
                      rel={item.link && item.link !== "#" ? "noreferrer" : undefined}
                    >
                      Join link
                    </a>
                  </div>
                  <span className={`timeline__halo timeline__halo--${index % 2 === 0 ? "primary" : "secondary"}`} aria-hidden />
                </li>
              ))}
            </ul>
          </Card>
        )}

        {derived.moduleSparkline.length > 0 && (
          <Card className="dashboard-card">
            <div className="dashboard-card__header">
              <StatusPill tone="success">In progress</StatusPill>
              <span className="dashboard-card__time">{derived.completion}% overall</span>
            </div>
            <h3>Module momentum</h3>
            <p>Stay on rhythm with the modules currently open for your cohort.</p>
            <div className="progress-bar">
              <div className="progress-bar__fill" style={{ width: `${derived.completion}%` }} />
            </div>
            <div className="sparkline">
              {derived.moduleSparkline.map((module) => (
                <div key={module.id} className="sparkline__item">
                  <span>{module.title}</span>
                  <div className="sparkline__bar" style={{ width: `${module.completion}%` }}>
                    <span>{module.completion}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      <section className="dashboard-bottom">
        <Card className="dashboard-card dashboard-card--achievements">
          <div className="dashboard-card__header">
            <StatusPill tone="neutral">Recent queries</StatusPill>
            <span className="dashboard-card__time">{derived.recentQueries.length} logged</span>
          </div>
          <ul className="achievement-list">
            {derived.recentQueries.length === 0 && (
              <li className="achievement">
                <span className="achievement__icon" aria-hidden>
                  💬
                </span>
                <div className="achievement__content">
                  <strong>No queries yet</strong>
                  <span>Reach out to mentors whenever you need a nudge.</span>
                </div>
                <span className="achievement__date">—</span>
              </li>
            )}
            {derived.recentQueries.map((query) => (
              <li key={query._id || query.id} className="achievement">
                <span className="achievement__icon" aria-hidden>
                  💬
                </span>
                <div className="achievement__content">
                  <strong>{query.subject || query.topic || "Query"}</strong>
                  <span>
                    {query.status ? `Status · ${query.status}` : "Awaiting mentor response"}
                  </span>
                </div>
                <span className="achievement__date">
                  {query.createdAt
                    ? new Date(query.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="dashboard-card dashboard-card--support">
          <div className="dashboard-card__header">
            <StatusPill tone="info">Need a boost?</StatusPill>
          </div>
          <div className="support-tile">
            <p>Book a 15 minute mentor sync or request personalised feedback on assignments.</p>
            <Button variant="secondary">Schedule mentor sync</Button>
            <Button variant="ghost">Drop a message</Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default DashboardPage;
