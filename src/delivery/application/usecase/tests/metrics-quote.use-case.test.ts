import { DeliveryGatewayHttp } from "../../../../infra/gateway/delivery.gateway-http";
import { GetQuote } from "../get-quote.use-case";
import { DeliveryRepositoryInMemory } from "../../../../infra/repository/delivery.repository-in-memory";
import { MetricsQuote } from "../metrics-quote.use-case";

describe("Quote Usecase Test - Integration", () => {
  let useCase: MetricsQuote.UseCase;

  it("should return a quote empty", async () => {
    const repository = new DeliveryRepositoryInMemory();
    useCase = new MetricsQuote.UseCase(repository);
    const output = await useCase.execute({
      last_quotes: "10",
    });
    expect(output).toStrictEqual({
      totalAndMediaPrice: [],
      lowestHighestPrice: { lowest: 0, highest: 0 },
      amountCarrier: [],
    });
  });

  it("should return a quote only carrie with name CORREIOS", async () => {
    const repository = new DeliveryRepositoryInMemory();
    repository.save([{ name: "CORREIOS", price: 10 }]);
    useCase = new MetricsQuote.UseCase(repository);
    const output = await useCase.execute({
      last_quotes: "1",
    });
    expect(output).toStrictEqual({
      totalAndMediaPrice: [
        { average_price: 10, shipping_company: "CORREIOS", total_price: 10 },
      ],
      lowestHighestPrice: { lowest: 10, highest: 10 },
      amountCarrier: [{ amount: 1, shipping_company: "CORREIOS" }],
    });
  });

  it("should return a quote only carrie two last", async () => {
    const repository = new DeliveryRepositoryInMemory();
    repository.save([
      { name: "FRETE BR", price: 10 },
      { name: "ALI", price: 7 },
      { name: "CORREIOS", price: 10 },
    ]);
    useCase = new MetricsQuote.UseCase(repository);
    const output = await useCase.execute({
      last_quotes: "2",
    });
    expect(output).toStrictEqual({
      totalAndMediaPrice: [
        { average_price: 7, shipping_company: "ALI", total_price: 7 },
        { average_price: 10, shipping_company: "CORREIOS", total_price: 10 },
      ],
      lowestHighestPrice: { lowest: 7, highest: 10 },
      amountCarrier: [
        { amount: 1, shipping_company: "ALI" },
        { amount: 1, shipping_company: "CORREIOS" },
      ],
    });
  });
});
