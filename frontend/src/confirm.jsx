// src/confirm.jsx
import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

export default function ConfirmEmailForm() {
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await Auth.confirmSignUp(username, code);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500); // Redirect to login after 1.5s
    } catch (err) {
      console.error(err);
      setError(err.message || 'Confirmation failed.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Confirm Your Email</h2>
        <form onSubmit={handleConfirm} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.input}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          {success && (
            <p style={{ color: 'green', textAlign: 'center' }}>
              ✅ Confirmed! Redirecting to login...
            </p>
          )}
          <button type="submit" style={styles.button}>
            Confirm
          </button>
        </form>
        <p style={styles.link}>
          Didn't receive the code?{' '}
          <span onClick={() => navigate('/signup')} style={styles.anchor}>
            Sign up again
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', backgroundColor: '#f9f9f9'
  },
  formBox: {
    padding: '2rem', borderRadius: '10px', background: '#fff', boxShadow: '0 0 10px #ddd',
    width: '100%', maxWidth: '400px'
  },
  heading: {
    textAlign: 'center', fontSize: '24px', marginBottom: '1rem'
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: '1rem'
  },
  input: {
    padding: '0.75rem', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc'
  },
  button: {
    padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none',
    borderRadius: '5px', fontSize: '16px', cursor: 'pointer'
  },
  error: {
    color: 'red', textAlign: 'center'
  },
  link: {
    textAlign: 'center', marginTop: '1rem', fontSize: '14px'
  },
  anchor: {
    color: '#4f46e5', cursor: 'pointer', textDecoration: 'underline'
  }
};
