import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      const res = await fetch('http://localhost:3001/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const createTask = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      const res = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, details })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      await res.json();
      setTitle('');
      setDetails('');
      loadTasks();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={loadTasks}>Refresh Tasks</button>
        <button
          onClick={() => {
            setTitle('My new task');
            setDetails('Do something awesome');
            createTask();
          }}
          style={{ marginLeft: '1rem' }}
        >
          Create Sample Task
        </button>
      </div>
      <h2>Your Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {tasks.map(t => (
          <li key={t.id.S}>
            <strong>{t.title.S}</strong>: {t.details.S}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          placeholder="Details"
          value={details}
          onChange={e => setDetails(e.target.value)}
        />
        <button onClick={createTask}>Create Task</button>
      </div>
    </div>
  );
}
