const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailAlert(binId, fullness) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email not configured — skipping alert email');
    return;
  }

  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      process.env.ALERT_RECIPIENT || process.env.EMAIL_USER,
      subject: `🚨 MedWaste Alert — Container ${binId} is full`,
      html: `
        <h2>Container Alert</h2>
        <p>Container <strong>${binId}</strong> has reached <strong>${fullness}%</strong> capacity.</p>
        <p>Immediate collection is required.</p>
      `,
    });
    console.log(`📧 Alert email sent for ${binId}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
}

module.exports = { sendEmailAlert };