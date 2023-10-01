import {EnvVarsBag} from "../Util/EnvVarsBag";
import {EnergyServiceConfig} from "./EnergyServiceConfig";

const config: EnergyServiceConfig = {
    openVoltApiConfig: {
        baseUrl: "https://api.openvolt.com/v1",
        timeout_s: 500,
        meter_id: "6514167223e3d1424bf82742",
        auth_token: "test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR",
    },
    carbonIntensityApiConfig: {
        baseUrl: "https://api.carbonintensity.org.uk",
        timeout_s: 500,
    },
    analysisInterval: {
        startDate: "2023-01-01",
        endDate: "2023-02-01"
    }
};

export default config;