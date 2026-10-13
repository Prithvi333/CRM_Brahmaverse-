const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateEnquiryForm = (body) => {
  const errors = [];

  if (!body.name || body.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!body.phone || body.phone.trim() === '') {
    errors.push('Phone is required');
  } else if (!validatePhoneNumber(body.phone)) {
    errors.push('Phone must be a valid 10-digit number');
  }

  if (!body.email || body.email.trim() === '') {
    errors.push('Email is required');
  } else if (!validateEmail(body.email)) {
    errors.push('Email must be a valid email');
  }

  if (!body.course_interest || body.course_interest.trim() === '') {
    errors.push('Course Interest is required');
  }

  return errors;
};

module.exports = {
  validateEmail,
  validatePhoneNumber,
  validateUrl,
  validateEnquiryForm,
};
