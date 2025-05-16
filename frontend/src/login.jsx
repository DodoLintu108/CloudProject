import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

export default function SignInForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await Auth.signIn(username, password);
      console.log('Signed in:', user);
      alert('Signed in successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Sign in to your account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
        <p style={styles.link}>
          Not a member?{' '}
          <span onClick={() => navigate('/signup')} style={styles.anchor}>Create an account</span>
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
