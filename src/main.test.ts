import { GetQuote } from "./delivery/application/usecase/get-quote.use-case";
import { AxiosAdapter } from "./infra/http/AxiosAdapter";
import { DeliveryRepositoryPg } from "./infra/repository/delivery.repository-pg";
import { DeliveryGatewayHttp } from "./infra/gateway/delivery.gateway-http";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { QueueController } from "./infra/controllers/QuoteController";
import { MetricsQuote } from "./delivery/application/usecase/metrics-quote.use-case";
import { Config } from "./config/config";
import { DeliveryRepositoryInMemory } from "./infra/repository/delivery.repository-in-memory";
import request from "supertest";
import { DeliveryRepository } from "./delivery/domain/delivery.repository.interface";
import { DeliveryGateway } from "./delivery/domain/delivery.gateway.interface";

describe("Test E2E application", () => {
  beforeAll(() => {
    Config.init();
  });

  function startApp(
    repository?: DeliveryRepository.DatabaseInterface,
    gateway?: DeliveryGateway.HttpInterface
  ) {
    const httpClient = new AxiosAdapter();
    const deliveryRepositoryDatabaseInMemory =
      repository || new DeliveryRepositoryInMemory();
    const deliveryGatewayHttp = gateway || new DeliveryGatewayHttp(httpClient);
    const httpServer = new ExpressAdapter();
    const getQuote = new GetQuote.UseCase(
      deliveryRepositoryDatabaseInMemory,
      deliveryGatewayHttp
    );
    const metricsQuote = new MetricsQuote.UseCase(
      deliveryRepositoryDatabaseInMemory
    );
    new QueueController(httpServer, getQuote, metricsQuote);
    return httpServer;
  }

  describe("should return error because of invalid fields", () => {
    const paramsInvalid: { value: any; expected: any }[] = [
      {
        value: {
          recipient: {
            address: {
              zipcode: "39400200",
            },
          },
          volumes: [],
        },
        expected: { volumes: "The volume is empty" },
      },
      {
        value: {},
        expected: {
          volumes: "The volume is empty",
          zipcode: "Required",
        },
      },
      {
        value: {
          recipient: {
            address: {
              zipcode: "39400200",
            },
          },
          volumes: [{}],
        },
        expected: {
          amount: "Required",
          category: "Required",
          height: "Required",
          length: "Required",
          price: "Required",
          sku: "Required",
          unitary_weight: "Required",
          width: "Required",
        },
      },
    ];

    test.each(paramsInvalid)(
      "should error with message $expected",
      async ({ value, expected }) => {
        const httpServer = startApp();
        const response = await request
          .agent(httpServer.app)
          .post("/quote")
          .send(value);
        expect(response.status).toBe(422);
        expect(response.body).toStrictEqual({ message: expected });
      }
    );
  });

  it("should return values metrics empty", async () => {
    const httpServer = startApp();
    const response = await request.agent(httpServer.app).get("/metrics");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      totalAndMediaPrice: [],
      lowestHighestPrice: { lowest: 0, highest: 0 },
      amountCarrier: [],
    });
  });

  it("should return the metrics of only one company", async () => {
    const repository = new DeliveryRepositoryInMemory();
    repository.save([{ name: "correios 1 ", price: 10 }]);
    const httpServer = startApp(repository);
    const response = await request.agent(httpServer.app).get("/metrics");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      totalAndMediaPrice: [
        {
          average_price: 10,
          shipping_company: "correios 1 ",
          total_price: 10,
        },
      ],
      lowestHighestPrice: { lowest: 10, highest: 10 },
      amountCarrier: [{ amount: 1, shipping_company: "correios 1 " }],
    });
  });

  it("should return metrics from the last 3 quotes", async () => {
    const repository = new DeliveryRepositoryInMemory();
    repository.save([
      { name: "correios 1", price: 10 },
      { name: "correios 2", price: 20 },
      { name: "correios 3", price: 30 },
      { name: "correios 5", price: 40 },
      { name: "correios 5", price: 50 },
      { name: "correios 6", price: 60 },
    ]);
    const httpServer = startApp(repository);
    const response = await request
      .agent(httpServer.app)
      .get("/metrics?last_quotes=3");
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      totalAndMediaPrice: [
        {
          average_price: 45,
          shipping_company: "correios 5",
          total_price: 90,
        },
        {
          average_price: 60,
          shipping_company: "correios 6",
          total_price: 60,
        },
      ],
      lowestHighestPrice: { lowest: 10, highest: 60 },
      amountCarrier: [
        { amount: 2, shipping_company: "correios 5" },
        { amount: 1, shipping_company: "correios 6" },
      ],
    });
  });
});
