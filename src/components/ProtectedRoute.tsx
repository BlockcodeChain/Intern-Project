import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    // TODO: Replace with real authentication check
    return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute; 