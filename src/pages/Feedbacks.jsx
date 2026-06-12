import { useEffect, useState } from 'react';
import api from '../api/axios';

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
    <div
      style={{
        minHeight: '100vh',
        background: '#111827',
        color: '#fff',
        padding: '30px'
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: 25
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '34px',
            fontWeight: 700
          }}
        >
          Feedbacks & Comments
        </h1>

        <p
          style={{
            color: '#9ca3af',
            marginTop: 8
          }}
        >
          Manage and review user
          feedback for AI agents
        </p>
      </div>

      {/* Filters Card */}
      <div
        style={{
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: 18,
          padding: 20,
          marginBottom: 25,
          boxShadow:
            '0 10px 25px rgba(0,0,0,.25)'
        }}
      >
        <div
          style={{
            marginBottom: 15
          }}
        >
          <label
            style={{
              marginRight: 10,
              fontWeight: 600
            }}
          >
            Date Range:
          </label>

          <select
            value={filters.date_range}
            onChange={(e) =>
              setFilters({
                ...filters,
                date_range:
                  e.target.value
              })
            }
            style={inputStyle}
          >
            <option>
              All Time
            </option>
            <option>Today</option>
            <option>
              Last 7 Days
            </option>
            <option>
              Last 30 Days
            </option>
            <option>
              Last 90 Days
            </option>
          </select>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          <select
            value={filters.agent_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                agent_id:
                  e.target.value
              })
            }
            style={inputStyle}
          >
            <option value="">
              All Agents
            </option>

            {agents.map((a) => (
              <option key={a}>
                {a}
              </option>
            ))}
          </select>

          <input
            placeholder="Session ID"
            value={filters.session_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                session_id:
                  e.target.value
              })
            }
            style={inputStyle}
          />

          <select
            value={
              filters.like_status
            }
            onChange={(e) =>
              setFilters({
                ...filters,
                like_status:
                  e.target.value
              })
            }
            style={inputStyle}
          >
            <option>All</option>
            <option value="like">
              Like
            </option>
            <option value="dislike">
              Dislike
            </option>
          </select>

          <input
            placeholder="User ID"
            value={filters.user_id}
            onChange={(e) =>
              setFilters({
                ...filters,
                user_id:
                  e.target.value
              })
            }
            style={inputStyle}
          />

          <select
            value={filters.mode}
            onChange={(e) =>
              setFilters({
                ...filters,
                mode:
                  e.target.value
              })
            }
            style={inputStyle}
          >
            <option>
              All Modes
            </option>
            <option>
              Agent
            </option>
            <option>
              Guide
            </option>
          </select>

          <button
            onClick={load}
            style={{
              ...primaryBtn
            }}
          >
            Apply Filters
          </button>

          <button
            onClick={reset}
            style={{
              ...secondaryBtn
            }}
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div
        style={{
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow:
            '0 10px 25px rgba(0,0,0,.25)'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse:
              'collapse'
          }}
        >
          <thead
            style={{
              background:
                '#111827'
            }}
          >
            <tr>
              {[
                'USER',
                'TYPE',
                'MODE',
                'COMMENT',
                'AGENT ID',
                'DATE'
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding:
                      '16px',
                    textAlign:
                      'left',
                    fontSize:
                      '12px',
                    color:
                      '#9ca3af',
                    letterSpacing:
                      '.5px'
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.map(
              (item, index) => (
                <tr
                  key={index}
                  style={{
                    borderTop:
                      '1px solid #374151'
                  }}
                >
                  <td
                    style={
                      tdStyle
                    }
                  >
                    <div
                      style={{
                        fontWeight: 600
                      }}
                    >
                      Unknown User
                    </div>

                    <div
                      style={{
                        color:
                          '#9ca3af',
                        fontSize:
                          12
                      }}
                    >
                      No Email
                    </div>
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    <span
                      style={{
                        background:
                          item.type ===
                          'like'
                            ? '#064e3b'
                            : '#7f1d1d',

                        color:
                          item.type ===
                          'like'
                            ? '#34d399'
                            : '#f87171',

                        padding:
                          '5px 12px',

                        borderRadius:
                          999,

                        fontSize:
                          13,

                        fontWeight: 600
                      }}
                    >
                      {item.type ===
                      'like'
                        ? '♥ Like'
                        : '✕ Dislike'}
                    </span>
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    <span
                      style={{
                        background:
                          item.mode ===
                          'Guide'
                            ? '#172554'
                            : '#3b0764',

                        color:
                          item.mode ===
                          'Guide'
                            ? '#60a5fa'
                            : '#c084fc',

                        padding:
                          '5px 12px',

                        borderRadius:
                          999,

                        fontSize:
                          13
                      }}
                    >
                      ● {item.mode}
                    </span>
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      color:
                        '#d1d5db',
                      maxWidth:
                        350
                    }}
                  >
                    {item.comment ||
                      'No comment'}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      color:
                        '#9ca3af'
                    }}
                  >
                    {item.agent_id}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      color:
                        '#9ca3af',
                      fontSize:
                        13
                    }}
                  >
                    {new Date(
                      item.timestamp
                    ).toLocaleString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{
            padding: 18,
            borderTop:
              '1px solid #374151',

            display: 'flex',
            justifyContent:
              'space-between',

            alignItems: 'center'
          }}
        >
          <span
            style={{
              color: '#9ca3af'
            }}
          >
            Total Records: {total}
          </span>

          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems:
                'center'
            }}
          >
            <button
              disabled={
                page === 1
              }
              onClick={() =>
                setPage(
                  (p) => p - 1
                )
              }
              style={
                paginationBtn
              }
            >
              Previous
            </button>

            <span>
              Page {page}
            </span>

            <button
              disabled={
                page * 20 >=
                total
              }
              onClick={() =>
                setPage(
                  (p) => p + 1
                )
              }
              style={
                paginationBtn
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const tdStyle = {
  padding: '16px'
};

const inputStyle = {
  padding: '10px 14px',
  background: '#111827',
  border: '1px solid #374151',
  borderRadius: 10,
  color: '#fff',
  minWidth: 160
};

const primaryBtn = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '10px 18px',
  cursor: 'pointer',
  fontWeight: 600
};

const secondaryBtn = {
  background: '#374151',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '10px 18px',
  cursor: 'pointer',
  fontWeight: 600
};

const paginationBtn = {
  background: '#111827',
  color: '#fff',
  border: '1px solid #374151',
  borderRadius: 8,
  padding: '8px 14px',
  cursor: 'pointer'
};
