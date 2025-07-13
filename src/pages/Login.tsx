import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/builder');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="main-page-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    {error && <div className="form-error">{error}</div>}
                    <button type="submit">Login</button>
                </form>
                <button className="link-btn" onClick={() => navigate('/register')}>Don't have an account? Register</button>
            </div>
        </div>
    );
};

export default Login; 