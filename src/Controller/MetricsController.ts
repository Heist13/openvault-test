import {FuelMix, MetricsService} from "../Service/MetricsService";
import {Request, Response} from "express";
import {EnergyServiceConfig} from "../Config/EnergyServiceConfig";

export class MetricsController {
    private config: EnergyServiceConfig;
    private metricsService: MetricsService;

    constructor(config: EnergyServiceConfig, metricsService: MetricsService) {
        this.metricsService = metricsService;
        this.config = config;
    }

    public async getEnergyConsumed(_: Request, res: Response<EnergyConsumedResponseBody>) {
        const energyConsumed = await this.metricsService.getEnergyConsumed(this.config.analysisInterval.startDate, this.config.analysisInterval.endDate);

        if (energyConsumed === undefined) {
            res.status(500).json();
            return;
        }

        res.json({
            energy_consumed: energyConsumed
        });
    }

    public async getCarbonIntensity(_: Request, res: Response<ReportResponseBody>) {
        const carbonIntensity = await this.metricsService.getCarbonIntensity(this.config.analysisInterval.startDate, this.config.analysisInterval.endDate);

        if (carbonIntensity === undefined) {
            res.status(500).json();
            return;
        }

        res.json({
            co2Emitted: carbonIntensity,
        });
    }

    public async getFuelMix(_: Request, res: Response<FuelMix>) {
        let fuelMix;
        try {
            fuelMix = await this.metricsService.getFuelMix(this.config.analysisInterval.startDate, this.config.analysisInterval.endDate);
        } catch (error) {

            res.status(500).json();
            return;
        }

        res.json(fuelMix);
    }
}

export interface EnergyConsumedResponseBody {
    energy_consumed: number;
}

export interface ReportResponseBody {
    co2Emitted: number;
}