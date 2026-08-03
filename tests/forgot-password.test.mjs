import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Forgot Password: non-existent account error handling prevents step advance', async () => {
  const mockApiError = {
    message: 'No account found with this phone number. Please check the number or sign up.',
    statusCode: 404,
  };

  let step = 'phone';
  let errorMessage = null;

  async function handleSendOtpMock(phone, requestFn) {
    errorMessage = null;
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || !/^(97|98)\d{8}$/.test(cleanPhone)) {
      errorMessage = 'Please enter a valid 10-digit Nepal mobile number (97 or 98 series).';
      return;
    }

    try {
      const res = await requestFn(cleanPhone);
      if (res && res.status === false) {
        errorMessage = res.message || 'No registered account found with this phone number.';
        return;
      }
      step = 'otp';
    } catch (err) {
      errorMessage = err.message || 'Failed to send OTP. Please try again.';
    }
  }

  // Test 1: Missing Account throwing error
  await handleSendOtpMock('9800000000', async () => {
    throw mockApiError;
  });

  assert.equal(step, 'phone', 'Step must remain "phone" when account is not found');
  assert.equal(errorMessage, 'No account found with this phone number. Please check the number or sign up.');

  // Test 2: Registered Account
  await handleSendOtpMock('9818600001', async () => {
    return { status: true, message: 'OTP sent successfully.' };
  });

  assert.equal(step, 'otp', 'Step must advance to "otp" when account is found and OTP is sent');
});
