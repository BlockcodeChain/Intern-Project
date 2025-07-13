import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const Preview: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/auth/register', { email, password });
            setSuccess('Registration successful! Redirecting to preview...');
            setTimeout(() => navigate('/preview'), 1200);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="main-page-container">
            <div className="auth-card">
                <h2>Preview</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                    {error && <div className="form-error">{error}</div>}
                    {success && <div className="form-success">{success}</div>}
                    <button type="submit" className="auth-btn">Preview</button>
                </form>
                <button className="link-btn" onClick={() => navigate('/login')}>Already have an account? Login</button>
                <button className="link-btn" onClick={() => navigate('/preview')}>Go to Resume Preview</button>
            </div>
        </div>
    );
};

export default Preview; 