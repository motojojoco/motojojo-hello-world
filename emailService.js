import express from 'express';
import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

const ses = new SESv2Client({
  region: 'ap-south-1',
  // credentials will be picked up from environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws: { SendEmailCommand } }
});

app.post('/send-ticket', async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    // Generate PDF from HTML
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Send email with PDF attachment
    await transporter.sendMail({
      from: 'info@motojojo.co',
      to,
      subject,
      html: 'Your ticket is attached as a PDF.',
      attachments: [
        {
          filename: 'ticket.pdf',
          content: pdfBuffer,
        },
      ],
    });

    res.status(200).json({ message: 'Email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(3001, () => console.log('Email service running on port 3001')); 