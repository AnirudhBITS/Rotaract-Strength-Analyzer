// In-memory OTP store with expiry
const store = new Map();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_LENGTH = 6;

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function setOTP(email) {
  const otp = generateOTP();
  store.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });
  return otp;
}

function verifyOTP(email, otp) {
  const key = email.toLowerCase();
  const entry = store.get(key);

  if (!entry) {
    return { valid: false, message: 'No OTP found. Please request a new one.' };
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (entry.attempts >= 5) {
    store.delete(key);
    return { valid: false, message: 'Too many attempts. Please request a new OTP.' };
  }

  entry.attempts++;

  if (entry.otp !== otp) {
    return { valid: false, message: 'Incorrect OTP. Please try again.' };
  }

  store.delete(key);
  return { valid: true };
}

module.exports = { setOTP, verifyOTP };
