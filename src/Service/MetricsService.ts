import {OpenVoltApi} from "../ExternalApi/OpenVoltApi";
import {CarbonIntensityApi, FactorsData} from "../ExternalApi/CarbonIntensityApi";
import {NonMatchingValuesException} from "./Exception/NonMatchingValuesException";

export class MetricsService {
    private openVoltApi: OpenVoltApi;
    private carbonIntensityApi: CarbonIntensityApi;

    constructor(openVoltApi: OpenVoltApi, carbonIntensityApi: CarbonIntensityApi) {
        this.openVoltApi = openVoltApi;
        this.carbonIntensityApi = carbonIntensityApi;
    }

    public async getEnergyConsumed(startDate: string, endDate: string): Promise<number | undefined> {
        const metrics = await this.getConsumptionMetrics(startDate, endDate);

        return metrics.reduce((total, metric) => total + metric.consumption, 0);
    }

    public async getCarbonIntensity(startDate: string, endDate: string): Promise<number> {
        const metrics = await this.getConsumptionMetrics(startDate, endDate);
        const carbonIntensities = await this.getCarbonIntensitiesByMetricsBoundaries(
            this.getFormattedDate(metrics[0].startDate),
            this.getFormattedDate(metrics[metrics.length - 1].startDate)
        );

        if (carbonIntensities.length !== metrics.length) {
            throw new NonMatchingValuesException();
        }

        let totalCarbonIntensity = 0;
        for (let i = 0; i < metrics.length; i++) {
            totalCarbonIntensity += metrics[i].consumption * carbonIntensities[i];
        }

        return totalCarbonIntensity;
    }

    public async getFuelMix(startDate: string, endDate: string): Promise<FuelMix> {
        const factorsData = await this.carbonIntensityApi.getFactors();
        const energyConsumed = await this.getEnergyConsumed(startDate, endDate);
        if (energyConsumed === undefined || factorsData === undefined) {
            throw new Error(`Carbon/OpenVolt APIs returned errors.`);
        }

        const totalFactors = Object.values(factorsData).reduce((total, factor) => total + factor, 0);

        const fuelMix: FuelMix = {
            Biomass: 0,
            Coal: 0,
            Oil: 0,
            Wind: 0
        };
        for (const key of Object.keys(factorsData)) {
            if(fuelMix.hasOwnProperty(key)) {
                fuelMix[key as keyof FuelMix] = factorsData[key as keyof FactorsData] / totalFactors * energyConsumed;
            }
        }

        return fuelMix;
    }

    private async getConsumptionMetrics(startDate: string, endDate: string): Promise<ConsumptionMetric[]> {
        const response = await this.openVoltApi.getIntervalData(startDate, endDate);

        if (response === undefined) {
            throw new Error(`OpenVolt API returned errors.`);
        }

        response.metrics.pop(); // remove last metric because it's from the next day

        return response.metrics.map((openVoltMetric) => ({
            startDate: openVoltMetric.startInterval,
            consumption: openVoltMetric.consumption,
        })) as ConsumptionMetric[];
    }

    private async getCarbonIntensitiesByMetricsBoundaries(startDate: string, endDate: string): Promise<number[]> {
        let response = await this.carbonIntensityApi.getIntensityByDate(startDate, endDate);
        let retries = 3;

        while (response === undefined && retries > 0) {
            response = await this.carbonIntensityApi.getIntensityByDate(startDate, endDate);
            --retries;
        }

        if (response === undefined) {
            throw new Error(`Carbon Intensity API returned errors.`);
        }

        return response.map((carbonIntensity) => carbonIntensity.intensity.actual);
    }

    private getFormattedDate(inputDate: string): string {
        const [date, time] = inputDate.split('T');
        return `${date}T${time.split(':').slice(0, 2).join(':')}Z`;
    }
}

export interface ConsumptionMetric {
    startDate: string,
    consumption: number,
}

export interface FuelMix {
    Biomass: number;
    Coal: number;
    Oil: number;
    Wind: number;
}