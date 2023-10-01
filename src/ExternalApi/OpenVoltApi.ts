import axios, {AxiosInstance} from "axios";
import {OpenVoltApiConfig} from "../Config/EnergyServiceConfig";

export class OpenVoltApi {
    private httpClient: AxiosInstance;
    private apiMeterId: string;

    constructor(config: OpenVoltApiConfig) {
        this.httpClient = axios.create({
            baseURL: config.baseUrl,
            timeout: config.timeout_s * 1000,
            headers: {
                'x-api-key': config.auth_token
            }
        });
        this.apiMeterId = config.meter_id;
    }

    public async getIntervalData(startDate: string, endDate: string): Promise<OpenVoltApiIntervalDataResponse | undefined> {
        const params = {
            meter_id: this.apiMeterId,
            granularity: "hh",
            start_date: startDate,
            end_date: endDate,
        }

        let response = undefined;
        try {
            response = await this.httpClient.get(`/interval-data`, {
                params: params
            });
        } catch (error: any) {
            if (error.response) {
                console.error('Response Error:', error.response.data);
                console.error('Status Code:', error.response.status);
                console.error('Req:', params);
            } else if (error.request) {
                console.error('Request Error:', error.request);
            } else {
                console.error('Error Message:', error.message);
            }

            return undefined;
        }

        const body = response.data;
        return {
            metrics: body.data.map((metric: { [key: string]: string }) => ({
                startInterval: metric.start_interval,
                meterId: metric.meter_id,
                meterNumber: metric.meter_number,
                customerId: metric.customer_id,
                consumption: parseFloat(metric.consumption),
                consumptionUnit: metric.consumption_unit
            })) as OpenVoltMetricData[],
        };
    }
}

export interface OpenVoltApiIntervalDataResponse {
    metrics: OpenVoltMetricData[]
}

interface OpenVoltMetricData {
    startInterval: string;
    meterId: string;
    meterNumber: string,
    customerId: string,
    consumption: number,
    consumptionUnit: string,
}