import type { AdapterExecutionContext, AdapterExecutionResult } from "@paperclipai/adapter-utils";
export declare function execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult>;
export declare function testEnvironment(ctx: {
    companyId: string;
    adapterType: string;
    config: Record<string, unknown>;
}): Promise<{
    ok: boolean;
    status: "pass" | "warn" | "fail";
    checks: Array<{
        code: string;
        level: "info" | "warn" | "error";
        message: string;
        hint?: string;
    }>;
    testedAt: string;
}>;
//# sourceMappingURL=execute.d.ts.map