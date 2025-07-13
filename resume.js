import express from 'express';
import jwt from 'jsonwebtoken';
import Resume from './models/Resume.js';
import PDFDocument from 'pdfkit';
const router = express.Router();

function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
        req.user = jwt.verify(token, 'SECRET');
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}

router.post('/', auth, async (req, res) => {
    const resume = new Resume({ ...req.body, user: req.user.userId });
    await resume.save();
    res.json(resume);
});

router.get('/', auth, async (req, res) => {
    const resumes = await Resume.find({ user: req.user.userId });
    res.json(resumes);
});

// PDF generation endpoint
router.post('/generate-pdf', auth, async (req, res) => {
    const {
        name, email, phone, city, country, summary = '',
        experience = [], education = [], skills = [], additional = ''
    } = req.body;
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    doc.pipe(res);

    // Dummy text for debugging
    doc.font('Helvetica-Bold').fontSize(16).fillColor('white').text('RESUME', { align: 'center' });
    doc.moveDown();
    doc.fillColor('black');

    // Header
    doc.font('Helvetica-Bold').fontSize(18).text(name || '', { align: 'center' });
    doc.moveDown(0.2);
    doc.font('Helvetica').fontSize(11).text(
        [city, country].filter(Boolean).join(', ') +
        (phone ? ` | P: ${phone}` : '') +
        (email ? ` | ${email}` : ''),
        { align: 'center' }
    );
    doc.moveDown();

    // Professional Summary
    if (summary) {
        doc.font('Helvetica-Bold').fontSize(12).text('PROFESSIONAL SUMMARY', { underline: true });
        doc.font('Helvetica').fontSize(11).text(summary);
        doc.moveDown();
    }

    // Education
    if (education.length && education[0].school) {
        doc.font('Helvetica-Bold').fontSize(12).text('EDUCATION', { underline: true });
        education.forEach(edu => {
            doc.font('Helvetica-Bold').text(`${edu.school || ''}`, { continued: true })
                .font('Helvetica').text(edu.location ? `, ${edu.location}` : '', { continued: true })
                .font('Helvetica').text(
                    (edu.start || edu.end) ? ` (${edu.start || ''} - ${edu.end || ''})` : '',
                    { align: 'right' }
                );
            doc.font('Helvetica').text(edu.degree || '');
            if (edu.details) doc.font('Helvetica').text(edu.details);
            doc.moveDown(0.5);
        });
        doc.moveDown(0.5);
    }

    // Work Experience
    if (experience.length && experience[0].company) {
        doc.font('Helvetica-Bold').fontSize(12).text('WORK EXPERIENCE', { underline: true });
        experience.forEach(exp => {
            doc.font('Helvetica-Bold').text(`${exp.company || ''}`, { continued: true })
                .font('Helvetica').text(exp.location ? `, ${exp.location}` : '', { continued: true })
                .font('Helvetica').text(
                    (exp.start || exp.end) ? ` (${exp.start || ''} - ${exp.end || ''})` : '',
                    { align: 'right' }
                );
            doc.font('Helvetica-Oblique').text(exp.role || '');
            if (exp.description) {
                exp.description.split(/\n|;/).forEach(line => {
                    if (line.trim()) doc.font('Helvetica').text('• ' + line.trim(), { indent: 20 });
                });
            }
            doc.moveDown(0.5);
        });
        doc.moveDown(0.5);
    }

    // Skills
    if (skills.length && skills[0]) {
        doc.font('Helvetica-Bold').fontSize(12).text('SKILLS', { underline: true });
        doc.font('Helvetica').text(skills.filter(Boolean).join(', '));
        doc.moveDown(0.5);
    }

    // Additional
    if (additional) {
        doc.font('Helvetica-Bold').fontSize(12).text('ADDITIONAL', { underline: true });
        doc.font('Helvetica').text(additional);
        doc.moveDown(0.5);
    }

    doc.end();
});

export default router; 