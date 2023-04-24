import { GetQuote } from "./delivery/application/usecase/get-quote.use-case";
import { AxiosAdapter } from "./infra/http/AxiosAdapter";
import { DeliveryRepositoryPg } from "./infra/repository/delivery.repository-pg";
import { DeliveryGatewayHttp } from "./infra/gateway/delivery.gateway-http";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";

import { PgPromise } from "./infra/database/pg-promise-adapter";
import { QueueController } from "./infra/controllers/QuoteController";
import { MetricsQuote } from "delivery/application/usecase/metrics-quote.use-case";
import { Config } from "./config/config";
import { MainController } from "infra/controllers/MainController";

Config.init();
const httpClient = new AxiosAdapter();
const connection = new PgPromise();
const deliveryRepositoryDatabase = new DeliveryRepositoryPg(connection);
const deliveryGatewayHttp = new DeliveryGatewayHttp(httpClient);

const httpServer = new ExpressAdapter();

const getQuote = new GetQuote.UseCase(
  deliveryRepositoryDatabase,
  deliveryGatewayHttp
);

const metricsQuote = new MetricsQuote.UseCase(deliveryRepositoryDatabase);

new QueueController(httpServer, getQuote, metricsQuote);
new MainController(httpServer);
httpServer.listen(Config.config().port);
