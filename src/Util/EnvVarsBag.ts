export class EnvVarsBag {
    private static envVars: EnvVars;

    public static buildBag(envContent: {[key: string]: string | undefined }): void {
        if(envContent.OPENVOLT_API_TOKEN === undefined) {
            throw new Error('OPENVOLT_API_TOKEN not found in env');
        }

        this.envVars = {
            OPENVOLT_API_TOKEN: envContent.OPENVOLT_API_TOKEN,
        };
    }

    public static getEnvVars(): EnvVars {
        if (!this.envVars) {
            throw new Error('EnvVarsBag not initialized');
        }

        return this.envVars;
    }
}

interface EnvVars {
    OPENVOLT_API_TOKEN: string
}