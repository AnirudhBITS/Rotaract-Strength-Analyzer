const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const ADMIN_BCC = ['3234drs2627@gmail.com', '3234drr2627@gmail.com', 'rtrvigneshchandran@gmail.com'];

function buildAcknowledgementHtml({ name, applicationNumber, top5, recommendations, selectedPositions }) {
  const top5Rows = top5
    .map((t, i) => `<tr><td style="padding:6px 12px;font-weight:600;color:#e71e6d">#${i + 1}</td><td style="padding:6px 12px">${t}</td></tr>`)
    .join('');

  const recRows = recommendations
    .map((r, i) => `<tr><td style="padding:6px 12px;font-weight:600;color:#0f9fd8">Match #${i + 1}</td><td style="padding:6px 12px">${r}</td></tr>`)
    .join('');

  const choiceRows = selectedPositions
    .map((t, i) => `<tr><td style="padding:6px 12px;font-weight:600;color:#cc8200">${i + 1}</td><td style="padding:6px 12px">${t}</td></tr>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5fa;font-family:'Segoe UI',system-ui,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">
    <!-- Header bar -->
    <div style="height:4px;background:linear-gradient(to right,#42b8e9,#e71e6d,#ffc829,#f97316)"></div>

    <div style="padding:32px 28px 24px">
      <h1 style="margin:0 0 4px;font-size:22px;color:#1e1e30;text-align:center">Rotaract 3234 DO Screening</h1>
      <p style="margin:0 0 24px;font-size:13px;color:#8587b3;text-align:center">District Officials Recruitment — EOI Acknowledgement</p>

      <!-- Application Number -->
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:#f0f4ff;border:1px solid #d0d8f0;border-radius:8px;padding:12px 28px">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#8587b3;margin-bottom:4px">Application Number</div>
          <div style="font-size:22px;font-weight:800;color:#1e1e30;letter-spacing:2px">${applicationNumber}</div>
        </div>
      </div>

      <p style="text-align:center;font-size:15px;color:#34344b">Dear <strong>${name}</strong>,</p>
      <p style="text-align:center;font-size:14px;color:#66689a;line-height:1.6;margin-bottom:28px">
        Thank you for submitting your Expression of Interest for District Official positions. Your application has been received successfully. Below is a summary of your submission.
      </p>

      <!-- Top 5 Strengths -->
      <h2 style="font-size:14px;color:#1e1e30;border-bottom:2px solid #e8e9f0;padding-bottom:6px;margin:24px 0 8px">Your Top 5 Strengths</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#34344b">${top5Rows}</table>

      <!-- Recommended Positions -->
      <h2 style="font-size:14px;color:#1e1e30;border-bottom:2px solid #e8e9f0;padding-bottom:6px;margin:24px 0 8px">Recommended Positions</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#34344b">${recRows}</table>

      <!-- Preferred Positions -->
      <h2 style="font-size:14px;color:#1e1e30;border-bottom:2px solid #e8e9f0;padding-bottom:6px;margin:24px 0 8px">Your Preferred Positions</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#34344b">${choiceRows}</table>

      <!-- What Next -->
      <h2 style="font-size:14px;color:#1e1e30;border-bottom:2px solid #e8e9f0;padding-bottom:6px;margin:24px 0 8px">What Next?</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#34344b">
        <tr><td style="padding:8px 12px;font-weight:600;color:#e71e6d">1</td><td style="padding:8px 12px">Our team will schedule a screening meet with the District core team.</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#e71e6d">2</td><td style="padding:8px 12px">You will receive a confirmation on your selection via mail.</td></tr>
      </table>

      <!-- Note -->
      <div style="margin:24px 0;background:#fffbf0;border:1px solid #f0e0b0;border-radius:8px;padding:14px 16px;font-size:12px;color:#66689a;line-height:1.6">
        <strong style="color:#34344b">Please note:</strong> These suggestions are intended to give you an insight into the roles that may align well with your strengths. Selecting a suggested position does not guarantee a confirmed District Official posting. All submissions will undergo a dedicated screening process, and the final decision rests with the District Core Team.
      </div>

      <p style="font-size:13px;color:#8587b3;text-align:center;margin-top:28px">
        Please retain your Application Number <strong style="color:#1e1e30">${applicationNumber}</strong> for future follow-ups.
      </p>
    </div>

    <!-- Footer -->
    <div style="height:4px;background:linear-gradient(to right,#42b8e9,#e71e6d,#ffc829,#f97316)"></div>
    <div style="background:#1e1e30;padding:16px 28px;text-align:center">
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.5)">
        Let's <span style="color:#e71e6d;font-weight:700">Unite</span> Together &middot; Rotaract District 3234 &middot; 2025-26
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildAdminNotificationHtml({ name, email, phone, clubName, applicationNumber, top5, recommendations, selectedPositions }) {
  const top5List = top5.map((t, i) => `#${i + 1} ${t}`).join(', ');
  const suggestedList = recommendations.map((t, i) => `${i + 1}. ${t}`).join('<br>');
  const choicesList = selectedPositions.map((t, i) => `${i + 1}. ${t}`).join('<br>');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5fa;font-family:'Segoe UI',system-ui,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">
    <div style="height:4px;background:linear-gradient(to right,#42b8e9,#e71e6d,#ffc829,#f97316)"></div>
    <div style="padding:28px">
      <h1 style="margin:0 0 4px;font-size:18px;color:#1e1e30">New EOI Application Received</h1>
      <p style="margin:0 0 20px;font-size:13px;color:#8587b3">Application: <strong style="color:#1e1e30">${applicationNumber}</strong></p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#34344b">
        <tr><td style="padding:6px 0;color:#8587b3;width:120px">Name</td><td style="padding:6px 0;font-weight:600">${name}</td></tr>
        <tr><td style="padding:6px 0;color:#8587b3">Email</td><td style="padding:6px 0">${email}</td></tr>
        <tr><td style="padding:6px 0;color:#8587b3">Phone</td><td style="padding:6px 0">${phone}</td></tr>
        <tr><td style="padding:6px 0;color:#8587b3">Club</td><td style="padding:6px 0">${clubName}</td></tr>
        <tr><td style="padding:6px 0;color:#8587b3">Top 5</td><td style="padding:6px 0">${top5List}</td></tr>
        <tr><td style="padding:6px 0;color:#8587b3;vertical-align:top">Suggested</td><td style="padding:6px 0;color:#0f9fd8">${suggestedList}</td></tr>
        <tr><td style="padding:6px 0;color:#8587b3;vertical-align:top">Preferred</td><td style="padding:6px 0">${choicesList}</td></tr>
      </table>

      <p style="margin:20px 0 0;font-size:13px;color:#8587b3">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin" style="color:#e71e6d;text-decoration:none;font-weight:600">View in Admin Dashboard &rarr;</a>
      </p>
    </div>
    <div style="height:4px;background:linear-gradient(to right,#42b8e9,#e71e6d,#ffc829,#f97316)"></div>
  </div>
</body>
</html>`;
}

async function sendAcknowledgement({ applicantEmail, name, applicationNumber, top5, recommendations, selectedPositions }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured — skipping email');
    return;
  }

  const applicantHtml = buildAcknowledgementHtml({
    name,
    applicationNumber,
    top5,
    recommendations,
    selectedPositions,
  });

  try {
    await transporter.sendMail({
      from: `"Rotaract 3234 DO Screening" <${process.env.SMTP_USER}>`,
      to: applicantEmail,
      subject: `EOI Acknowledged — ${applicationNumber} | Rotaract District 3234`,
      html: applicantHtml,
    });
    console.log(`Acknowledgement email sent to ${applicantEmail}`);
  } catch (err) {
    console.error('Failed to send acknowledgement email:', err.message);
  }
}

async function sendAdminNotification({ name, email, phone, clubName, applicationNumber, top5, recommendations, selectedPositions }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  const adminHtml = buildAdminNotificationHtml({
    name,
    email,
    phone,
    clubName,
    applicationNumber,
    top5,
    recommendations,
    selectedPositions,
  });

  try {
    await transporter.sendMail({
      from: `"Rotaract 3234 DO Screening" <${process.env.SMTP_USER}>`,
      to: ADMIN_BCC,
      subject: `New EOI: ${name} (${applicationNumber}) — ${clubName}`,
      html: adminHtml,
    });
    console.log(`Admin notification sent for ${applicationNumber}`);
  } catch (err) {
    console.error('Failed to send admin notification:', err.message);
  }
}

async function sendOTPEmail(email, otp) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured — skipping OTP email');
    return;
  }

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5fa;font-family:'Segoe UI',system-ui,sans-serif">
  <div style="max-width:480px;margin:0 auto;background:#ffffff">
    <div style="height:4px;background:linear-gradient(to right,#42b8e9,#e71e6d,#ffc829,#f97316)"></div>
    <div style="padding:32px 28px;text-align:center">
      <h1 style="margin:0 0 8px;font-size:20px;color:#1e1e30">Email Verification</h1>
      <p style="margin:0 0 24px;font-size:13px;color:#8587b3">Rotaract 3234 DO Screening — District EOI</p>
      <p style="font-size:14px;color:#34344b;margin-bottom:20px">Your verification code is:</p>
      <div style="display:inline-block;background:#f0f4ff;border:2px solid #d0d8f0;border-radius:12px;padding:16px 36px;margin-bottom:20px">
        <span style="font-size:32px;font-weight:800;letter-spacing:8px;color:#1e1e30">${otp}</span>
      </div>
      <p style="font-size:12px;color:#8587b3;margin-top:16px">This code expires in 5 minutes. Do not share it with anyone.</p>
    </div>
    <div style="height:4px;background:linear-gradient(to right,#42b8e9,#e71e6d,#ffc829,#f97316)"></div>
  </div>
</body></html>`;

  try {
    await transporter.sendMail({
      from: `"Rotaract 3234 DO Screening" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Verification Code — Rotaract EOI',
      html,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (err) {
    console.error('Failed to send OTP email:', err.message);
    throw err;
  }
}

module.exports = { sendAcknowledgement, sendAdminNotification, sendOTPEmail };
