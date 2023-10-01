export interface EnergyServiceConfig {
    openVoltApiConfig: OpenVoltApiConfig;
    carbonIntensityApiConfig: CarbonIntensityApiConfig;
    analysisInterval: {
        startDate: string;
        endDate: string;
    }
}

export interface OpenVoltApiConfig {
    baseUrl: string;
    timeout_s: number; // timeout in seconds
    meter_id: string; // meter_id of our customer
    auth_token: string; // auth token of our customer
}

export interface CarbonIntensityApiConfig {
    baseUrl: string;
    timeout_s: number; // timeout in seconds
}