import { readdir } from "fs/promises";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const unitDir = join(__dirname, "unit");

// Discover and run all unit test files
async function main() {
    console.log("🚀 Running all unit tests...\n");

    const files = (await readdir(unitDir))
        .filter(f => f.endsWith(".test.js"))
        .sort();

    let totalPassed = 0;
    let totalFailed = 0;

    for (const file of files) {
        const path = join(unitDir, file);
        const url = pathToFileURL(path).href;

        try {
            const mod = await import(url);
            if (typeof mod.run === "function") {
                const result = await mod.run();
                totalPassed += result.passed;
                totalFailed += result.failed;
            }
        } catch (err) {
            console.error(`💥 Failed to run ${file}: ${err.message}`);
            totalFailed++;
        }
    }

    console.log(`\n${"═".repeat(55)}`);
    console.log(`📊 TOTAL: ${totalPassed} passed, ${totalFailed} failed`);
    console.log(`${"═".repeat(55)}\n`);

    process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch(err => {
    console.error("💥 Fatal:", err);
    process.exit(1);
});
