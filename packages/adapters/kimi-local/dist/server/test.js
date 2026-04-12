function summarizeStatus(checks) {
    if (checks.some((check) => check.level === "error"))
        return "fail";
    if (checks.some((check) => check.level === "warn"))
        return "warn";
    return "pass";
}
export async function testEnvironment(ctx) {
    const checks = [];
    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey) {
        checks.push({
            code: "kimi_api_key_missing",
            level: "error",
            message: "KIMI_API_KEY environment variable not set",
            hint: "Set KIMI_API_KEY to your Kimi API key",
        });
    }
    else if (apiKey.length < 10) {
        checks.push({
            code: "kimi_api_key_invalid",
            level: "error",
            message: "KIMI_API_KEY appears to be invalid (too short)",
            hint: "Check that your API key is complete",
        });
    }
    else {
        checks.push({
            code: "kimi_api_key_configured",
            level: "info",
            message: "Kimi API key is configured",
        });
    }
    return {
        adapterType: ctx.adapterType,
        status: summarizeStatus(checks),
        checks,
        testedAt: new Date().toISOString(),
    };
}
