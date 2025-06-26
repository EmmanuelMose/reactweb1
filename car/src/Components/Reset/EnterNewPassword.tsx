import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    const email = localStorage.getItem('username');
    if (!email) {
      setError('Missing email. Please restart the process.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Password reset successfully. You can now log in.');
        navigate('/login');
      } else {
        setError(result.error || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setError('Server error. Try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>

        <label className="block mb-2">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-md"
          required
        />

        <label className="block mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-md"
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default EnterNewPassword;
