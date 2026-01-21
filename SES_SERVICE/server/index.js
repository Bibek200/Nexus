const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { sendEmail } = require('./sendEmail');
const { Inquiry, WebhookConfig, WebhookLog } = require('./models');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let isMongoConnected = false;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    isMongoConnected = true;
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Using fallback mode without database');
    isMongoConnected = false;
  });

// Fallback in-memory storage
const fallbackData = {
  inquiries: [
    { id: '1', name: 'Rahim Ahmed', email: 'rahim@test.com', message: 'I need help with the webhook integration documentation.', date: '2023-10-24', status: 'new' },
    { id: '2', name: 'Sarah Khan', email: 'sarah.k@business.com', message: 'Pricing inquiry for enterprise plan.', date: '2023-10-23', status: 'read' }
  ],
  webhookConfig: {
    email: 'admin@nexus.com',
    domain: 'https://api.nexus.com/v1/webhook',
    isActive: true
  }
};

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      return res.json({ success: true, user: { id: '2', name: 'Admin User', role: 'admin', email: email } });
    }
    if (email === process.env.VIEWER_EMAIL && password === process.env.VIEWER_PASSWORD) {
      return res.json({ success: true, user: { id: '1', name: 'Viewer User', role: 'viewer', email: email } });
    }
    res.status(401).json({ error: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Create Inquiry Endpoint (New)
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    let savedInquiry = null;

    if (isMongoConnected) {
      const inquiry = new Inquiry({ name, email, message, status: 'new' });
      savedInquiry = await inquiry.save();
    } else {
      savedInquiry = { id: Date.now().toString(), name, email, message, date: new Date().toISOString().split('T')[0], status: 'new' };
      fallbackData.inquiries.unshift(savedInquiry);
    }
    res.json({ success: true, data: savedInquiry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

// Send Email Endpoint (Purely for emailing)
app.post('/api/send-email', async (req, res) => {
  try {
    const { recipientEmail, subject, html } = req.body;

    // Just send email, don't save to DB
    await sendEmail(recipientEmail, subject, html);

    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Get Inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    let inquiries = [];
    if (isMongoConnected) {
      inquiries = await Inquiry.find().sort({ createdAt: -1 });
      inquiries = inquiries.map(inq => ({ id: inq._id.toString(), name: inq.name, email: inq.email, message: inq.message, date: inq.date, status: inq.status }));
    } else {
      inquiries = fallbackData.inquiries;
    }
    res.json({ success: true, data: inquiries });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Delete Inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Inquiry.findByIdAndDelete(id);
    } else {
      fallbackData.inquiries = fallbackData.inquiries.filter(i => i.id !== id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Update Status
app.patch('/api/inquiries/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (isMongoConnected) {
      await Inquiry.findByIdAndUpdate(id, { status });
    } else {
      fallbackData.inquiries = fallbackData.inquiries.map(i => i.id === id ? { ...i, status } : i);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Webhook Config
app.get('/api/webhook-config', async (req, res) => {
  try {
    let config = fallbackData.webhookConfig;
    if (isMongoConnected) {
      let mongoConfig = await WebhookConfig.findOne();
      if (!mongoConfig) {
        mongoConfig = new WebhookConfig({ email: 'admin@nexus.com', domain: 'https://api.nexus.com/v1/webhook', isActive: true });
        await mongoConfig.save();
      }
      config = { email: mongoConfig.email, domain: mongoConfig.domain, isActive: mongoConfig.isActive };
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/webhook-config', async (req, res) => {
  try {
    const { email, domain, isActive } = req.body;
    fallbackData.webhookConfig = { email, domain, isActive };
    if (isMongoConnected) {
      let config = await WebhookConfig.findOne();
      if (!config) config = new WebhookConfig();
      config.email = email;
      config.domain = domain;
      config.isActive = isActive;
      await config.save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
