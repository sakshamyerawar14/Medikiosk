import { runClinicalEngineTests } from "./clinical-engine.test";
import { runRedFlagTests } from "./red-flags.test";
import { runValidationTests } from "./validation.test";
import { runOcrProcessorTests } from "./ocr-processor.test";
import { runSummaryGeneratorTests } from "./summary-generator.test";

async function main() {
  console.log("==================================================");
  console.log(" MediKiosk Full-Stack Backend & Integration Tests ");
  console.log("==================================================\n");

  try {
    runClinicalEngineTests();
    console.log("");

    runRedFlagTests();
    console.log("");

    runValidationTests();
    console.log("");

    await runOcrProcessorTests();
    console.log("");

    await runSummaryGeneratorTests();
    console.log("");

    console.log("==================================================");
    console.log(" ALL TESTS PASSED SUCCESSFULLY! (100% PASS RATE) ");
    console.log("==================================================");
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
}

main();
