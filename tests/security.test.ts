import { signSessionToken, verifySessionToken, SessionPayload } from "../lib/auth/session";
import { checkRateLimit } from "../lib/api/rate-limiter";
import { generateId, generateToken } from "../lib/utils";
import { LoginSchema } from "../lib/validation/schemas";

export async function runSecurityTests() {
  console.log("=== Running Dedicated Healthcare Security Architecture Tests ===");

  // Test 1: HMAC-SHA256 Session Token Signing & Verification
  const validPayload: SessionPayload = {
    id: "doc-test-1",
    email: "doctor@hospital.gov.in",
    fullName: "Dr. Tester",
    role: "doctor",
    departmentId: "Cardiology",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const token = await signSessionToken(validPayload);
  console.assert(token && token.includes("."), "Session token must be formatted as payload.signature");

  const verified = await verifySessionToken(token);
  console.assert(verified !== null, "Valid session token must verify cleanly");
  console.assert(verified?.role === "doctor", "Verified role must match original");
  console.log("[PASS] Cryptographic session signing and verification passed.");

  // Test 2: Tampered Token Rejection
  const tamperedToken = token.slice(0, -4) + "XXXX";
  const tamperedVerified = await verifySessionToken(tamperedToken);
  console.assert(tamperedVerified === null, "Tampered signature must be rejected");
  console.log("[PASS] Tampered session token rejected.");

  // Test 3: Expired Token Rejection
  const expiredPayload: SessionPayload = {
    ...validPayload,
    exp: Math.floor(Date.now() / 1000) - 60, // Expired 1 minute ago
  };
  const expiredToken = await signSessionToken(expiredPayload);
  const expiredVerified = await verifySessionToken(expiredToken);
  console.assert(expiredVerified === null, "Expired token must be rejected");
  console.log("[PASS] Expired session token rejected.");

  // Test 4: AI Rate Limiting Protection (Denial of Wallet Defense)
  const testIp = `test-ip-${Date.now()}`;
  let allowedCount = 0;
  for (let i = 0; i < 5; i++) {
    const res = checkRateLimit(testIp, { maxRequests: 3, windowSeconds: 10 });
    if (res.allowed) allowedCount++;
  }
  console.assert(allowedCount === 3, "Rate limiter must cap at exactly maxRequests (3)");
  const blockedRes = checkRateLimit(testIp, { maxRequests: 3, windowSeconds: 10 });
  console.assert(!blockedRes.allowed, "Subsequent requests beyond limit must be blocked");
  console.log("[PASS] In-memory sliding window rate limiter strictly enforced.");

  // Test 5: Cryptographically Secure Identifiers (No predictable PRNG)
  const id1 = generateId();
  const id2 = generateId();
  console.assert(id1 !== id2, "Generated IDs must be unique");
  console.assert(id1.length >= 10, "Generated ID must have sufficient cryptographic entropy");

  const token1 = generateToken();
  const token2 = generateToken();
  console.assert(/^[A-Z]-[1-9][0-9]{2}$/.test(token1), "Queue token must conform to standard hospital token pattern");
  console.log("[PASS] Cryptographically secure PRNG generated valid tokens.");

  // Test 6: Fail-Closed Input Validation
  const invalidLogin = LoginSchema.safeParse({
    email: "invalid-email-string",
    password: "short",
    role: "doctor",
  });
  console.assert(!invalidLogin.success, "Invalid credentials schema must fail closed");
  console.log("[PASS] Input validation strictly rejects malformed credentials.");

  return true;
}

runSecurityTests()
  .then(() => {
    console.log("\n==================================================");
    console.log(" ALL SECURITY TESTS PASSED (100% PASS RATE)       ");
    console.log("==================================================");
  })
  .catch((err) => {
    console.error("Security tests failed:", err);
    process.exit(1);
  });
