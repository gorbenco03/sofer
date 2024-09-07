import React, { useState } from 'react';

const users = {
  sofer: 'sofer123',
  tudor: 'lavial3355',
};

const LoginPage: React.FC<{ onLogin: (role: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if ((username in users) && users[username as keyof typeof users] === password) {
      onLogin(username);
    } else {
      alert('Username sau parola incorecte!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Autentificare</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;