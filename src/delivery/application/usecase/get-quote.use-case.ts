import { DeliveryGateway } from "../../domain/delivery.gateway.interface";
import { DeliveryRepository } from "../../domain/delivery.repository.interface";
import { QuoteMapper } from "../../domain/quote.mapper";

export namespace GetQuote {
  export class UseCase {
    constructor(
      private readonly deliveryRepository: DeliveryRepository.DatabaseInterface,
      private readonly deliveryGateway: DeliveryGateway.HttpInterface
    ) {}

    async execute(input: Input): Promise<Output> {
      const response = await this.deliveryGateway.getQuote(
        input.zipcode,
        QuoteMapper.toVolumesHttp(input.volumes)
      );
      const mappedToQuote = QuoteMapper.Output(response);
      await this.deliveryRepository.save(mappedToQuote.carrier);
      return mappedToQuote;
    }
  }

  type VolumeProps = {
    amount: number;
    sku: string;
    category: string;
    height: number;
    width: number;
    length: number;
    unitary_weight: number;
    unitary_price: number;
  };

  export type Input = {
    zipcode: number;
    volumes: VolumeProps[];
  };

  type CarrierProps = {
    name: string;
    service: string;
    deadline: number;
    price: number;
  };

  export type Output = {
    carrier: CarrierProps[];
  };
}
