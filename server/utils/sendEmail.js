const nodemailer = require('nodemailer');

/**
 * Send an email using configured SMTP
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async (options) => {
  // Silently skip if SMTP is not configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[Email] SMTP not configured — skipping email send.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'LearnPulse LMS'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Sent to ${options.to} — "${options.subject}"`);
  } catch (err) {
    // Log the error but never crash the server
    console.error(`[Email Error] Failed to send email: ${err.message}`);
  }
};

module.exports = sendEmail;
