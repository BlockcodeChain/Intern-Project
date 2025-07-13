import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './auth.js';
import resumeRoutes from './resume.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/resume-builder', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 