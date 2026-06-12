import { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

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
      <div style={{ padding: 30, color: '#fff', background: '#111827', minHeight: '100vh' }}>
        Loading analytics...
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
    <div style={{
      minHeight: '100vh',
      background: '#111827',
      color: '#fff',
      padding: '30px'
    }}>

      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700 }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: '#9ca3af', marginTop: 8 }}>
          Real-time insights into system performance and user behavior
        </p>
      </div>

      {/* Top Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 16,
        marginBottom: 30
      }}>
        {topStats.map(stat => (
          <div key={stat.label} style={statCard}>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Likes / Dislikes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 25
      }}>
        <div style={{ ...statCard, borderLeft: '4px solid #22c55e' }}>
          <div style={{ color: '#9ca3af' }}>Likes</div>
          <div style={{ fontSize: 28, color: '#22c55e', fontWeight: 700 }}>
            {summary.likes}
          </div>
        </div>

        <div style={{ ...statCard, borderLeft: '4px solid #ef4444' }}>
          <div style={{ color: '#9ca3af' }}>Dislikes</div>
          <div style={{ fontSize: 28, color: '#ef4444', fontWeight: 700 }}>
            {summary.dislikes}
          </div>
        </div>
      </div>

      {/* Engagement */}
      <div style={card}>
        <h3>User Engagement by Source</h3>
        {engagement.map(e => (
          <div key={e.source} style={row}>
            <span>{e.source || 'Unknown'}</span>
            <span style={{ fontWeight: 600 }}>{e.count}</span>
          </div>
        ))}
      </div>

      {/* Satisfaction */}
      <div style={card}>
        <h3>Satisfaction by Mode</h3>
        {satMode.map(s => (
          <div key={s.mode} style={{ marginBottom: 18 }}>
            <div style={row}>
              <span>{s.mode}</span>
              <span>{s.satisfaction_rate}%</span>
            </div>

            <div style={progressBg}>
              <div style={{
                width: `${s.satisfaction_rate}%`,
                height: '100%',
                background: '#22c55e',
                borderRadius: 8
              }} />
            </div>

            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
              ♥ {s.likes} | ✕ {s.dislikes}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 20
      }}>

        {/* Messages Over Time */}
        <div style={card}>
          <h3>Messages Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={msgTime}>
              <XAxis dataKey="_id" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" />
              <Line type="monotone" dataKey="guide" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active Users */}
        <div style={card}>
          <h3>Active Users Per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activeDay}>
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="count" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20
        }}>

          <div style={card}>
            <h3>Error Trends</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={errTrend}>
                <XAxis dataKey="_id" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={card}>
            <h3>Mode Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={modeDist}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={80}
                  label
                >
                  {modeDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const card = {
  background: '#1f2937',
  border: '1px solid #374151',
  borderRadius: 16,
  padding: 20,
  boxShadow: '0 10px 25px rgba(0,0,0,.25)'
};

const statCard = {
  background: '#1f2937',
  border: '1px solid #374151',
  borderRadius: 14,
  padding: 16
};

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: '1px solid #374151',
  color: '#d1d5db'
};

const progressBg = {
  height: 10,
  background: '#111827',
  borderRadius: 8,
  marginTop: 8,
  overflow: 'hidden'
};