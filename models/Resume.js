import mongoose from 'mongoose';
const ResumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    email: String,
    phone: String,
    city: String,
    country: String,
    summary: String,
    experience: Array,
    education: Array,
    skills: Array,
    additional: String,
});
const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;