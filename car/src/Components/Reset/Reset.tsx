import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reset = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    const email = localStorage.getItem('username');
    if (!email) {
      setError('Missing email information. Please restart the process.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Code verified');
        navigate('/reset-password');
      } else {
        setError(result.error || 'Invalid verification code.');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Server error. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError('');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Enter Verification Code
        </h2>

        <label htmlFor="code" className="block text-gray-700 font-medium mb-2">
          6-Digit Code
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={handleChange}
          maxLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="123456"
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 mt-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Verify Code
        </button>
      </form>
    </div>
  );
};

export default Reset;
