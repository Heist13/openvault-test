# OpenVolt Test

## Tech
- NodeJS/Express
- Typescript
- Docker

I managed the app to run in a docker container. To run it, just run the following command:
```sh docker-compose up -d --build ```

The app will be running on port 3001. You can change it in the .env file and docker-compose.

The app is structured with the Controller model. You can find the available routes in src/bootstrap.ts .
APIs setup is in the config files (src/Config). The token is in the LocalConfig file, for simplicity (otherwise, I would prefered to store it in a vault storage).
The service logic is available in the src/Service/MetricsService.ts file. The apis implementations in the ExternalApis folder.
Index.ts is the entry point of the app.

## Endpoints:
### GET /v1/carbon-intensity : solve the first problem
### GET /v1/carbon-intensity : solve the second problem
### GET /v1/fuel-mix : solve the third problem partially
I don't know if I really understood how fuel-mix is calculated. Also, for simplicity, I made it only for a couple of keys from the ones provided by the CarbonAPI