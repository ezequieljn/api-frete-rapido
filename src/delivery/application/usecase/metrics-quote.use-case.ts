import { DeliveryRepository } from "../../domain/delivery.repository.interface";

export namespace MetricsQuote {
  export class UseCase {
    constructor(
      private readonly deliveryRepository: DeliveryRepository.DatabaseInterface
    ) {}

    async execute(input: Input): Promise<any> {
      const metrics = await this.metrics(input.last_quotes);
      return metrics;
    }

    async metrics(limit: string = "") {
      const totalAndMediaPricePromise =
        this.deliveryRepository.findByQuotesTotalAndMediaPrice(limit);
      const lowestHighestPricePromise =
        this.deliveryRepository.lowestHighestPrice();
      const amountCarrierPromise = this.deliveryRepository.amountCarrier(limit);

      const [totalAndMediaPrice, lowestHighestPrice, amountCarrier] =
        await Promise.all([
          totalAndMediaPricePromise,
          lowestHighestPricePromise,
          amountCarrierPromise,
        ]);

      return { totalAndMediaPrice, lowestHighestPrice, amountCarrier };
    }
  }

  export type Input = {
    last_quotes?: string;
  };
}
