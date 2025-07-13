import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import Login from './pages/Login';
import Register from './pages/Register';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumePreview from './pages/ResumePreview';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <Router>
            <ThreeBackground />
            <Navbar />
            <Routes>
                <Route path="/" element={<ResumeBuilder />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
                <Route path="/preview" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App; 