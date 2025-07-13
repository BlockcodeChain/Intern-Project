import React, { useState } from 'react';
import './ResumeBuilder.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DEGREE_OPTIONS = [
  '', 'High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'
];
const ROLE_OPTIONS = [
  '', 'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Designer', 'Manager', 'Intern', 'Other'
];

export type ResumeData = {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  summary: string;
  experience: { company: string; role: string; location: string; start: string; end: string; description: string }[];
  education: { school: string; degree: string; location: string; start: string; end: string; details: string }[];
  skills: string[];
  additional: string;
};

const defaultResume: ResumeData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  summary: '',
  experience: [{ company: '', role: '', location: '', start: '', end: '', description: '' }],
  education: [{ school: '', degree: '', location: '', start: '', end: '', details: '' }],
  skills: [''],
  additional: '',
};

const ResumeBuilder: React.FC = () => {
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handlers for each section
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleExperienceChange = (idx: number, field: string, value: string) => {
    const updated = resume.experience.map((exp, i) =>
      i === idx ? { ...exp, [field]: value } : exp
    );
    setResume({ ...resume, experience: updated });
  };

  const handleEducationChange = (idx: number, field: string, value: string) => {
    const updated = resume.education.map((edu, i) =>
      i === idx ? { ...edu, [field]: value } : edu
    );
    setResume({ ...resume, education: updated });
  };

  const handleSkillChange = (idx: number, value: string) => {
    const updated = resume.skills.map((skill, i) => (i === idx ? value : skill));
    setResume({ ...resume, skills: updated });
  };

  // Add/Remove
  const addExperience = () => setResume({ ...resume, experience: [...resume.experience, { company: '', role: '', location: '', start: '', end: '', description: '' }] });
  const removeExperience = (idx: number) => setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== idx) });
  const addEducation = () => setResume({ ...resume, education: [...resume.education, { school: '', degree: '', location: '', start: '', end: '', details: '' }] });
  const removeEducation = (idx: number) => setResume({ ...resume, education: resume.education.filter((_, i) => i !== idx) });
  const addSkill = () => setResume({ ...resume, skills: [...resume.skills, ''] });
  const removeSkill = (idx: number) => setResume({ ...resume, skills: resume.skills.filter((_, i) => i !== idx) });

  // Save to localStorage for preview
  const handlePreview = () => {
    localStorage.setItem('resumeData', JSON.stringify(resume));
    navigate('/preview');
  };

  // Save to backend
  const handleSave = async () => {
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to save your resume. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/resume', resume, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Resume saved successfully!');
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.data?.message === 'Invalid token') {
        setMessage('Session expired or invalid token. Redirecting to login...');
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setMessage(err.response?.data?.message || 'Failed to save resume');
      }
    }
  };

  return (
    <div className="resume-builder-container">
      <div className="resume-builder-card">
        <h2>Build Your ATS-Friendly Resume</h2>
        <form className="resume-form" onSubmit={e => { e.preventDefault(); handlePreview(); }}>
          <section>
            <h3>Personal Information</h3>
            <div className="form-row three-cols">
              <input type="text" name="name" value={resume.name} onChange={handleChange} placeholder="Full Name" required />
              <input type="email" name="email" value={resume.email} onChange={handleChange} placeholder="Email" required />
              <input type="text" name="phone" value={resume.phone} onChange={handleChange} placeholder="Phone" required />
            </div>
            <div className="form-row two-cols">
              <input type="text" name="city" value={resume.city} onChange={handleChange} placeholder="City" required />
              <input type="text" name="country" value={resume.country} onChange={handleChange} placeholder="Country" required />
            </div>
            <textarea name="summary" value={resume.summary} onChange={handleChange} placeholder="Professional Summary" rows={2} />
          </section>

          <section>
            <h3>Additional Information</h3>
            <textarea name="additional" value={resume.additional} onChange={handleChange} placeholder="Languages, Certifications, Awards, etc." rows={2} />
          </section>

          <section>
            <h3>Work Experience <button type="button" className="add-btn" onClick={addExperience}>+ Add</button></h3>
            {resume.experience.map((exp, idx) => (
              <div className="exp-block" key={idx}>
                <div className="form-row five-cols">
                  <input type="text" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} placeholder="Company" required />
                  <select value={exp.role} onChange={e => handleExperienceChange(idx, 'role', e.target.value)} required>
                    {ROLE_OPTIONS.map(option => <option key={option} value={option}>{option || 'Role'}</option>)}
                  </select>
                  <input type="text" value={exp.location} onChange={e => handleExperienceChange(idx, 'location', e.target.value)} placeholder="Location" required />
                  <input type="text" value={exp.start} onChange={e => handleExperienceChange(idx, 'start', e.target.value)} placeholder="Start" required />
                  <input type="text" value={exp.end} onChange={e => handleExperienceChange(idx, 'end', e.target.value)} placeholder="End" required />
                  <button type="button" className="remove-btn" onClick={() => removeExperience(idx)}>Delete</button>
                </div>
                <textarea value={exp.description} onChange={e => handleExperienceChange(idx, 'description', e.target.value)} placeholder="Description (use ; or new lines for bullets)" rows={2} />
              </div>
            ))}
          </section>

          <section>
            <h3>Education <button type="button" className="add-btn" onClick={addEducation}>+ Add</button></h3>
            {resume.education.map((edu, idx) => (
              <div className="edu-block" key={idx}>
                <div className="form-row five-cols">
                  <input type="text" value={edu.school} onChange={e => handleEducationChange(idx, 'school', e.target.value)} placeholder="School" required />
                  <select value={edu.degree} onChange={e => handleEducationChange(idx, 'degree', e.target.value)} required>
                    {DEGREE_OPTIONS.map(option => <option key={option} value={option}>{option || 'Degree'}</option>)}
                  </select>
                  <input type="text" value={edu.location} onChange={e => handleEducationChange(idx, 'location', e.target.value)} placeholder="Location" required />
                  <input type="text" value={edu.start} onChange={e => handleEducationChange(idx, 'start', e.target.value)} placeholder="Start" required />
                  <input type="text" value={edu.end} onChange={e => handleEducationChange(idx, 'end', e.target.value)} placeholder="End" required />
                  <button type="button" className="remove-btn" onClick={() => removeEducation(idx)}>Delete</button>
                </div>
                <textarea value={edu.details} onChange={e => handleEducationChange(idx, 'details', e.target.value)} placeholder="Details (GPA, awards, etc.)" rows={2} />
              </div>
            ))}
          </section>

          <section>
            <h3>Skills <button type="button" className="add-btn" onClick={addSkill}>+ Add</button></h3>
            <div className="form-row skills-row">
              {resume.skills.map((skill, idx) => (
                <div className="skill-block" key={idx}>
                  <input type="text" value={skill} onChange={e => handleSkillChange(idx, e.target.value)} placeholder="Skill" required />
                  <button type="button" className="remove-btn" onClick={() => removeSkill(idx)}>Delete</button>
                </div>
              ))}
            </div>
          </section>

          <div className="form-actions">
            <button type="submit" className="preview-btn">Preview Resume</button>
            <button type="button" className="preview-btn" style={{ marginLeft: 12 }} onClick={handleSave}>Save Resume</button>
          </div>
          {message && <div className="form-success" style={{ marginTop: 8 }}>{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResumeBuilder;
