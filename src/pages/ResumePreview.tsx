import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ResumeData } from './ResumeBuilder';

const ResumePreview: React.FC = () => {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResume = async () => {
      const token = localStorage.getItem('token');
      let loaded = false;
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/resume', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data && res.data.length > 0 && res.data[res.data.length - 1].name) {
            setResume(res.data[res.data.length - 1]);
            loaded = true;
          }
        } catch (err: any) {
          if (err.response?.status === 401 || err.response?.data?.message === 'Invalid token') {
            localStorage.removeItem('token');
            alert('Session expired or invalid token. Please log in again.');
            navigate('/login');
            return;
          }
        }
      } else {
        // No token, redirect to login
        alert('You must be logged in to view your resume.');
        navigate('/login');
        return;
      }
      if (!loaded) {
        const data = localStorage.getItem('resumeData');
        if (data) setResume(JSON.parse(data));
        else navigate('/builder');
      }
    };
    fetchResume();
  }, [navigate]);

  const handleBackendPDFDownload = async () => {
    const token = localStorage.getItem('token');
    if (!resume || !token) {
      alert('You must be logged in to download your resume.');
      navigate('/login');
      return;
    }
    try {
      console.log('Sending resume to backend:', resume);
      const response = await axios.post(
        'http://localhost:5000/api/resume/generate-pdf',
        resume,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.data?.message === 'Invalid token') {
        localStorage.removeItem('token');
        alert('Session expired or invalid token. Please log in again.');
        navigate('/login');
      } else {
        alert('Failed to download PDF');
      }
    }
  };

  if (!resume) return null;

  return (
    <div className="main-page-container">
      <div className="resume-preview-card" style={{ maxWidth: 800, margin: 'auto', background: '#fff', color: '#222', padding: 32, borderRadius: 12 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 24
        }}>
          <h2 style={{ margin: 0, marginBottom: 16 }}>Resume Preview</h2>
          <button
            className="preview-btn"
            style={{ alignSelf: 'center', marginBottom: 8 }}
            onClick={handleBackendPDFDownload}
          >
            Download ATS PDF
          </button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>{resume.name}</h1>
          <div>{[resume.city, resume.country].filter(Boolean).join(', ')}{resume.phone ? ` | ${resume.phone}` : ''}{resume.email ? ` | ${resume.email}` : ''}</div>
        </div>
        {resume.summary && (
          <>
            <h3>Professional Summary</h3>
            <p>{resume.summary}</p>
          </>
        )}
        {resume.experience && resume.experience[0] && resume.experience[0].company && (
          <>
            <h3>Work Experience</h3>
            {resume.experience.map((exp, idx) => (
              exp.company && (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <b>{exp.role}</b> at <b>{exp.company}</b>
                  {exp.location && <> | {exp.location}</>}
                  {(exp.start || exp.end) && <> ({exp.start} - {exp.end})</>}
                  <ul>
                    {exp.description && exp.description.split(/\n|;/).map((line, i) =>
                      line.trim() && <li key={i}>{line.trim()}</li>
                    )}
                  </ul>
                </div>
              )
            ))}
          </>
        )}
        {resume.education && resume.education[0] && resume.education[0].school && (
          <>
            <h3>Education</h3>
            {resume.education.map((edu, idx) => (
              edu.school && (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <b>{edu.degree}</b> at <b>{edu.school}</b>
                  {edu.location && <> | {edu.location}</>}
                  {(edu.start || edu.end) && <> ({edu.start} - {edu.end})</>}
                  {edu.details && <div>{edu.details}</div>}
                </div>
              )
            ))}
          </>
        )}
        {resume.skills && resume.skills.filter(Boolean).length > 0 && (
          <>
            <h3>Skills</h3>
            <div>{resume.skills.filter(Boolean).join(', ')}</div>
          </>
        )}
        {resume.additional && (
          <>
            <h3>Additional</h3>
            <div>{resume.additional}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
