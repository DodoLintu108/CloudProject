import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess(false);
  try {
    await Auth.signUp({
      username,
      password,
      attributes: { email }
    });
    setSuccess(true);
    navigate("/confirm"); // ✅ Redirect only once, after success
  } catch (err) {
    console.error(err);
    setError(err.message || 'Signup failed.');
  }
};
  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Create a new account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={{ color: 'green', textAlign: 'center' }}>Account created! Check your email.</p>}
          <button type="submit" style={styles.button}>Sign up</button>
        </form>
        <p style={styles.link}>
          Already have an account?{' '}
          <span onClick={() => navigate('/')} style={styles.anchor}>Sign in</span>
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

