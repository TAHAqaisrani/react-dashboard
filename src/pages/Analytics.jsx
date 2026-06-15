import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './Analytics.css';

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [msgTime, setMsgTime] = useState([]);
  const [activeDay, setActiveDay] = useState([]);
  const [errTrend, setErrTrend] = useState([]);
  const [modeDist, setModeDist] = useState([]);
  const [satMode, setSatMode] = useState([]);
  const [engagement, setEngagement] = useState([]);

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data));
    api.get('/analytics/messages-over-time').then(r => setMsgTime(r.data));
    api.get('/analytics/active-users-per-day').then(r => setActiveDay(r.data));
    api.get('/analytics/error-trends').then(r => setErrTrend(r.data));
    api.get('/analytics/mode-distribution').then(r => setModeDist(r.data));
    api.get('/analytics/satisfaction-by-mode').then(r => setSatMode(r.data));
    api.get('/analytics/user-engagement-by-source').then(r => setEngagement(r.data));
  }, []);

  if (!summary) {
    return (
      <div className="analytics-page">
        <div style={{ color: 'var(--text-secondary)' }}>
          Loading analytics...
        </div>
      </div>
    );
  }

  const topStats = [
    { label: 'Total Messages', value: summary.total_messages },
    { label: 'Active Users', value: summary.active_users },
    { label: 'Total Sessions', value: summary.total_sessions },
    { label: 'Avg Response Time', value: `${summary.avg_response_time_s}s` },
    { label: 'Satisfaction Rate', value: `${summary.satisfaction_rate}%` }
  ];

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Analytics Dashboard
          </h1>
          <p className="page-subtitle">
            Real-time insights into system performance and user behavior
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="analytics-top-stats">
        {topStats.map(stat => (
          <div key={stat.label} className="analytics-stat-card">
            <div className="analytics-stat-label">{stat.label}</div>
            <div className="analytics-stat-value">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Likes / Dislikes */}
      <div className="analytics-likes-grid">
        <div className="analytics-like-card likes">
          <div className="analytics-stat-label">Likes</div>
          <div className="analytics-stat-value" style={{ color: 'var(--success)' }}>
            {summary.likes}
          </div>
        </div>

        <div className="analytics-like-card dislikes">
          <div className="analytics-stat-label">Dislikes</div>
          <div className="analytics-stat-value" style={{ color: 'var(--danger)' }}>
            {summary.dislikes}
          </div>
        </div>
      </div>

      {/* Engagement */}
      <div className="analytics-card">
        <h3>User Engagement by Source</h3>
        {engagement.map(e => (
          <div key={e.source} className="analytics-row">
            <span>{e.source || 'Unknown'}</span>
            <span className="analytics-row-value">{e.count}</span>
          </div>
        ))}
      </div>

      {/* Satisfaction */}
      <div className="analytics-card">
        <h3>Satisfaction by Mode</h3>
        {satMode.map(s => (
          <div key={s.mode} style={{ marginBottom: '18px' }}>
            <div className="analytics-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <span>{s.mode}</span>
              <span className="analytics-row-value">{s.satisfaction_rate}%</span>
            </div>

            <div className="analytics-progress-bg">
              <div style={{
                width: `${s.satisfaction_rate}%`,
                height: '100%',
                background: 'var(--success)',
                borderRadius: '8px'
              }} />
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              ♥ {s.likes} | ✕ {s.dislikes}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">

        {/* Messages Over Time */}
        <div className="analytics-card">
          <h3>Messages Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={msgTime}>
              <XAxis dataKey="_id" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" />
              <Line type="monotone" dataKey="guide" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active Users */}
        <div className="analytics-card">
          <h3>Active Users Per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activeDay}>
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
                cursor={{ fill: 'var(--bg-main)' }}
              />
              <Bar dataKey="count" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Charts */}
        <div className="analytics-charts-subgrid">

          <div className="analytics-card">
            <h3>Error Trends</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={errTrend}>
                <XAxis dataKey="_id" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="count" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-card">
            <h3>Mode Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={modeDist}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={80}
                  label={{ fill: 'var(--text-primary)' }}
                >
                  {modeDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}