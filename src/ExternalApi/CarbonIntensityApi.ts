import axios, {AxiosInstance} from "axios";
import {CarbonIntensityApiConfig} from "../Config/EnergyServiceConfig";

export class CarbonIntensityApi {
    private httpClient: AxiosInstance;

    constructor(config: CarbonIntensityApiConfig) {
        this.httpClient = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout_s * 1000,
        });
    }

    public async getIntensityByDate(startDate: string, endDate: string): Promise<CarbonIntensityMetricData[] | undefined> {
        let response = undefined;
        try {
            response = await this.httpClient.get(`/intensity/${startDate}/${endDate}`);
        } catch (error: any) {
            if (error.response) {
                console.error('Response Error:', error.response.data);
                console.error('Status Code:', error.response.status);
                console.error('Req:', {startDate, endDate});
            } else if (error.request) {
                console.error('Request Error:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }

            return undefined;
        }

        const body = response.data;

        return body.data;
    }

    public async getFactors(): Promise<FactorsData | undefined> {
        let response = undefined;
        try {
            response = await this.httpClient.get(`/intensity/factors`);
        } catch (error: any) {
            if (error.response) {
                console.error('Response Error:', error.response.data);
                console.error('Status Code:', error.response.status);
            } else if (error.request) {
                console.error('Request Error:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }

            return undefined;
        }

        const body = response.data.data[0];
        return {
            Biomass: body.Biomass,
            Coal: body.Coal,
            Oil: body.Oil,
            Wind: body.Wind
        };
    }
}

interface CarbonIntensityMetricData {
    from: string;
    to: string;
    intensity: {
        forecast: number,
        actual: number,
        index: string,
    }
}

export interface FactorsData {
    Biomass: number;
    Coal: number;
    Oil: number;
    Wind: number;
}