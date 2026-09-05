import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes placeholder
app.get('/api/v1/services', (req: Request, res: Response) => {
  res.json({
    services: [
      { id: 1, title: 'Strategic Planning', category: 'strategy' },
      { id: 2, title: 'Digital Transformation', category: 'technology' },
      { id: 3, title: 'Operational Excellence', category: 'operations' },
      { id: 4, title: 'Mergers & Acquisitions', category: 'finance' },
      { id: 5, title: 'Risk Management', category: 'risk' },
      { id: 6, title: 'Sustainability', category: 'esg' },
    ],
  });
});

app.get('/api/v1/case-studies', (req: Request, res: Response) => {
  res.json({
    caseStudies: [
      {
        id: 1,
        client: 'Fortune 100 Tech Company',
        challenge: 'Digital transformation across 40 countries',
        results: { costReduction: '47%', timeToMarket: '3.2x', valueCreated: '$2.4B' },
      },
      {
        id: 2,
        client: 'Global Financial Services',
        challenge: 'Regulatory compliance modernization',
        results: { complianceRate: '99.9%', fasterReporting: '60%', riskMitigated: '$500M' },
      },
    ],
  });
});

app.get('/api/v1/insights', (req: Request, res: Response) => {
  res.json({
    insights: [
      {
        id: 1,
        title: 'The Future of Digital Transformation',
        category: 'Strategy',
        date: '2024-12-01',
        excerpt: 'How AI and automation are reshaping the competitive landscape.',
      },
      {
        id: 2,
        title: 'Building Resilient Supply Chains',
        category: 'Operations',
        date: '2024-11-15',
        excerpt: 'Lessons from global disruptions and paths to resilience.',
      },
    ],
  });
});

// Contact form endpoint
app.post('/api/v1/contact', (req: Request, res: Response) => {
  const { name, email, company, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  
  // In production, this would send an email via Nodemailer
  console.log('Contact form submission:', { name, email, company, message });
  
  res.json({ 
    success: true, 
    message: 'Thank you for your message. We will be in touch soon.' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
