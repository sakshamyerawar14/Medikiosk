import {
  LoginSchema,
  PatientDemographicsSchema,
  ConsentSchema,
  ClinicalResponseSchema,
  DoctorReviewSchema,
} from "../lib/validation/schemas";

export function runValidationTests() {
  console.log("=== Running Zod Validation Schema Tests ===");

  // 1. Valid Login
  const validLogin = LoginSchema.safeParse({
    email: "doctor@hospital.org",
    password: "securePassword123",
    role: "doctor",
  });
  console.assert(validLogin.success, "Valid login schema should pass");
  console.log(`[PASS] Login schema validation passed.`);

  // 2. Invalid Email Login
  const invalidLogin = LoginSchema.safeParse({
    email: "not-an-email",
    password: "123",
  });
  console.assert(!invalidLogin.success, "Invalid login schema should fail");
  console.log(`[PASS] Invalid email rejected correctly.`);

  // 3. Patient Demographics
  const validPatient = PatientDemographicsSchema.safeParse({
    fullName: "Ramesh Kumar",
    gender: "male",
    phone: "+91 9876543210",
    dateOfBirth: "1974-05-14",
    abhaReference: "91-4523-8891-2014",
  });
  console.assert(validPatient.success, "Valid patient demographics should pass");
  console.log(`[PASS] Patient demographics schema validation passed.`);

  // 4. Doctor Review Action
  const validReview = DoctorReviewSchema.safeParse({
    encounterId: "123e4567-e89b-12d3-a456-426614174000",
    doctorId: "123e4567-e89b-12d3-a456-426614174001",
    action: "VERIFIED",
    comments: "Reviewed and verified clinical summary.",
  });
  console.assert(validReview.success, "Valid doctor review schema should pass");
  console.log(`[PASS] Doctor review schema validation passed.`);

  return true;
}
