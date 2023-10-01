import express from 'express';
import {MetricsController} from "./Controller/MetricsController";
import {MetricsService} from "./Service/MetricsService";
import LocalEnergyServiceConfig from "./Config/LocalEnergyServiceConfig";
import {OpenVoltApi} from "./ExternalApi/OpenVoltApi";
import {CarbonIntensityApi} from "./ExternalApi/CarbonIntensityApi";

const router = express.Router();

const energyServiceConfig = LocalEnergyServiceConfig;
// if(env.TYPE == "PROD") config = new LiveConfig();

const openVoltApi = new OpenVoltApi(energyServiceConfig.openVoltApiConfig);
const carbonIntensityApi = new CarbonIntensityApi(energyServiceConfig.carbonIntensityApiConfig);

const metricsService = new MetricsService(openVoltApi, carbonIntensityApi);
const controller = new MetricsController(energyServiceConfig, metricsService);

router.get('/v1/energy-consumed', controller.getEnergyConsumed.bind(controller));
router.get('/v1/carbon-intensity', controller.getCarbonIntensity.bind(controller));
router.get('/v1/fuel-mix', controller.getFuelMix.bind(controller));

export default router;