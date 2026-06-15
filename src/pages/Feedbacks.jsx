import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Feedbacks.css';

export default function Feedbacks() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    date_range: 'All Time',
    agent_id: '',
    session_id: '',
    like_status: 'All',
    user_id: '',
    mode: 'All Modes'
  });

  useEffect(() => {
    api
      .get('/feedbacks/agents')
      .then((r) => setAgents(r.data));

    load();
  }, [page]);

  function load() {
    const params = new URLSearchParams({
      page,
      limit: 20
    });

    if (filters.date_range !== 'All Time')
      params.append(
        'date_range',
        filters.date_range
      );

    if (filters.agent_id)
      params.append(
        'agent_id',
        filters.agent_id
      );

    if (filters.session_id)
      params.append(
        'session_id',
        filters.session_id
      );

    if (filters.like_status !== 'All')
      params.append(
        'like_status',
        filters.like_status
      );

    if (filters.user_id)
      params.append(
        'user_id',
        filters.user_id
      );

    if (filters.mode !== 'All Modes')
      params.append(
        'mode',
        filters.mode
      );

    api
      .get(`/feedbacks/?${params}`)
      .then((r) => {
        setItems(r.data.items);
        setTotal(r.data.total);
      });
  }

  function reset() {
    setFilters({
      date_range: 'All Time',
      agent_id: '',
      session_id: '',
      like_status: 'All',
      user_id: '',
      mode: 'All Modes'
    });

    setPage(1);
  }

  return (
    <div className="feedbacks-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Feedbacks & Comments
          </h1>
          <p className="page-subtitle">
            Manage and review user feedback for AI agents
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="filters-card">
        <div style={{ marginBottom: '16px' }} className="filter-row">
          <label className="filter-label">
            Date Range:
          </label>
          <select
            value={filters.date_range}
            onChange={(e) =>
              setFilters({
                ...filters,
                date_range: e.target.value
              })
            }
            className="filter-input"
          >
            <option>All Time</option>
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>

        <div className="filter-row">
          <select
            value={filters.agent_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                agent_id: e.target.value
              })
            }
            className="filter-input"
          >
            <option value="">All Agents</option>
            {agents.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <input
            placeholder="Session ID"
            value={filters.session_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                session_id: e.target.value
              })
            }
            className="filter-input"
          />

          <select
            value={filters.like_status}
            onChange={(e) =>
              setFilters({
                ...filters,
                like_status: e.target.value
              })
            }
            className="filter-input"
          >
            <option>All</option>
            <option value="like">Like</option>
            <option value="dislike">Dislike</option>
          </select>

          <input
            placeholder="User ID"
            value={filters.user_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                user_id: e.target.value
              })
            }
            className="filter-input"
          />

          <select
            value={filters.mode}
            onChange={(e) =>
              setFilters({
                ...filters,
                mode: e.target.value
              })
            }
            className="filter-input"
          >
            <option>All Modes</option>
            <option>Agent</option>
            <option>Guide</option>
          </select>

          <button onClick={load} className="primary-btn">
            Apply Filters
          </button>

          <button onClick={reset} className="secondary-btn">
            Reset All
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="feedbacks-table">
            <thead>
              <tr>
                {['USER', 'TYPE', 'MODE', 'COMMENT', 'AGENT ID', 'DATE'].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ fontWeight: 600 }}>Unknown User</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      No Email
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${item.type === 'like' ? 'success' : 'danger'}`}>
                      {item.type === 'like' ? '♥ Like' : '✕ Dislike'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.mode === 'Guide' ? 'info' : 'warning'}`}>
                      ● {item.mode}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: '350px' }}>
                    {item.comment || 'No comment'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {item.agent_id}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Total Records: {total}
          </span>
          <div className="pagination-controls">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="pagination-btn"
            >
              Previous
            </button>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              Page {page}
            </span>
            <button
              disabled={page * 20 >= total}
              onClick={() => setPage((p) => p + 1)}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

