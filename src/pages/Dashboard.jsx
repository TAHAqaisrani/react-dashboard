// APIs used:
// GET /dashboard/stats          → { total_messages, sessions, active_users, likes, dislikes, total_errors, recent_errors_30d, avg_response_time_s }
// GET /dashboard/error-types    → [{ error_type, count, percentage }]
// GET /dashboard/agent-feedback-overview → [{ agent_name, total_comments, likes, dislikes, satisfaction_rate }]
// GET /dashboard/user-activity?start=&end=&granularity=Daily → [{ date, active_users }]

import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats]       = useState(null);
  const [errors, setErrors]     = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [activity, setActivity] = useState([]);
  const [start, setStart]       = useState('');
  const [end, setEnd]           = useState('');
  const [gran, setGran]         = useState('Daily');

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data));
    api.get('/dashboard/error-types').then(r => setErrors(r.data));
    api.get('/dashboard/agent-feedback-overview').then(r => setFeedback(r.data));
    loadActivity();
  }, []);

  function loadActivity() {
    const params = new URLSearchParams({ granularity: gran });
    if (start) params.append('start', start);
    if (end)   params.append('end', end);
    api.get(`/dashboard/user-activity?${params}`).then(r => setActivity(r.data));
  }

  function handleReset() {
    setStart('');
    setEnd('');
    setGran('Daily');
    const params = new URLSearchParams({ granularity: 'Daily' });
    api.get(`/dashboard/user-activity?${params}`).then(r => setActivity(r.data));
  }

  if (!stats) return (
    <div className="db-loading">
      <div className="db-spinner" />
      <span>Loading dashboard…</span>
    </div>
  );

  const statCards = [
    { label: 'Total messages',      value: stats.total_messages.toLocaleString(),     icon: 'message',        variant: 'blue'   },
    { label: 'Sessions',            value: stats.sessions.toLocaleString(),            icon: 'activity',       variant: 'purple' },
    { label: 'Active users',        value: stats.active_users.toLocaleString(),        icon: 'users',          variant: 'teal'   },
    { label: 'Avg response time',   value: `${stats.avg_response_time_s}s`,            icon: 'clock',          variant: 'amber'  },
    { label: 'Likes',               value: stats.likes.toLocaleString(),               icon: 'thumb-up',       variant: 'green'  },
    { label: 'Dislikes',            value: stats.dislikes.toLocaleString(),            icon: 'thumb-down',     variant: 'coral'  },
    { label: 'Total errors',        value: stats.total_errors.toLocaleString(),        icon: 'alert-circle',   variant: 'red'    },
    { label: 'Recent errors (30d)', value: stats.recent_errors_30d.toLocaleString(),  icon: 'alert-triangle', variant: 'orange' },
  ];

  const maxActivity = Math.max(...activity.map(a => a.active_users), 1);

  return (
    <div className="db-root">

      {/* Header */}
      <header className="db-header">
        <div>
          <h1 className="db-title">Dashboard</h1>
          <p className="db-subtitle">Monitor performance and user engagement</p>
        </div>
      </header>

      {/* Stat cards */}
      <section className="db-stats-grid">
        {statCards.map(({ label, value, icon, variant }) => (
          <div key={label} className={`db-stat-card db-stat-card--${variant}`}>
            <div className="db-stat-icon">
              <i className={`ti ti-${icon}`} aria-hidden="true" />
            </div>
            <div className="db-stat-body">
              <span className="db-stat-label">{label}</span>
              <span className="db-stat-value">{value}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Two-column row */}
      <div className="db-row">

        {/* Error types */}
        <section className="db-card db-card--errors">
          <div className="db-card-header">
            <h2 className="db-card-title">
              <i className="ti ti-chart-donut" aria-hidden="true" />
              Error distribution
            </h2>
          </div>
          <div className="db-error-list">
            {errors.map((e, idx) => (
              <div key={e.error_type} className="db-error-row">
                <div className="db-error-meta">
                  <span className="db-error-index">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="db-error-type">{e.error_type}</span>
                  <span className="db-error-count">{e.count}</span>
                  <span className="db-error-pct">{e.percentage}%</span>
                </div>
                <div className="db-bar-track">
                  <div
                    className="db-bar-fill db-bar-fill--error"
                    style={{ width: `${e.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agent feedback */}
        <section className="db-card db-card--feedback">
          <div className="db-card-header">
            <h2 className="db-card-title">
              <i className="ti ti-star" aria-hidden="true" />
              Agent feedback
            </h2>
          </div>
          <div className="db-feedback-list">
            {feedback.map(f => (
              <div key={f.agent_name} className="db-feedback-row">
                <div className="db-feedback-top">
                  <span className="db-agent-name">{f.agent_name}</span>
                  <div className="db-feedback-counts">
                    <span className="db-like-count">
                      <i className="ti ti-thumb-up" aria-hidden="true" />{f.likes}
                    </span>
                    <span className="db-dislike-count">
                      <i className="ti ti-thumb-down" aria-hidden="true" />{f.dislikes}
                    </span>
                    <span className="db-sat-badge">{f.satisfaction_rate}%</span>
                  </div>
                </div>
                <div className="db-bar-track">
                  <div
                    className="db-bar-fill db-bar-fill--success"
                    style={{ width: `${f.satisfaction_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* User activity */}
      <section className="db-card db-card--activity">
        <div className="db-card-header db-card-header--between">
          <h2 className="db-card-title">
            <i className="ti ti-chart-line" aria-hidden="true" />
            User activity
          </h2>
          <div className="db-filters">
            <input
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
              className="db-input"
              aria-label="Start date"
            />
            <span className="db-filter-sep">–</span>
            <input
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
              className="db-input"
              aria-label="End date"
            />
            <select
              value={gran}
              onChange={e => setGran(e.target.value)}
              className="db-input db-select"
              aria-label="Granularity"
            >
              <option>Daily</option>
              <option>Monthly</option>
            </select>
            <button onClick={loadActivity} className="db-btn db-btn--primary">Apply</button>
            <button onClick={handleReset} className="db-btn db-btn--ghost">Reset</button>
          </div>
        </div>

        {activity.length === 0 ? (
          <p className="db-empty">No activity data for this period.</p>
        ) : (
          <div className="db-activity-list">
            {activity.map(a => (
              <div key={a.date} className="db-activity-row">
                <span className="db-activity-date">{a.date}</span>
                <div className="db-bar-track db-bar-track--activity">
                  <div
                    className="db-bar-fill db-bar-fill--blue"
                    style={{ width: `${(a.active_users / maxActivity) * 100}%` }}
                  />
                </div>
                <span className="db-activity-count">{a.active_users.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
