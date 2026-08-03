import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const signupPagePath = path.resolve(__dirname, "../src/app/signup/page.tsx");
const authLibPath = path.resolve(__dirname, "../src/lib/auth.ts");

test("Signup Page: stores verificationToken from verifyPhoneOTP and passes to completeRegistration", () => {
  const content = fs.readFileSync(signupPagePath, "utf8");

  // 1. Verify state variable exists for verificationToken
  assert.match(
    content,
    /const\s+\[verificationToken,\s+setVerificationToken\]\s*=\s*useState/,
    "Signup page must define state for verificationToken"
  );

  // 2. Verify handleVerifyOtp captures token from verifyPhoneOTP response
  assert.match(
    content,
    /const\s+res\s*=\s*await\s+verifyPhoneOTP\(phone,\s*otp\);[\s\S]*?setVerificationToken\(res\.verificationToken\);/,
    "handleVerifyOtp must capture res.verificationToken into state"
  );

  // 3. Verify handleComplete passes verificationToken to completeRegistration
  assert.match(
    content,
    /completeRegistration\(\{[\s\S]*?verificationToken:\s*verificationToken/,
    "completeRegistration call must include verificationToken in payload"
  );
});

test("Auth Library: completeRegistration accepts verificationToken property in payload", () => {
  const content = fs.readFileSync(authLibPath, "utf8");

  assert.match(
    content,
    /verificationToken\?: string;/,
    "completeRegistration interface must include optional verificationToken"
  );
});
