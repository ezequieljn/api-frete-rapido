export class QuoteMapper {
  static Output(input: any): QuoteMapperProps {
    const carriers = input.dispatchers[0].offers.map((offer: any) => ({
      name: offer.carrier.name,
      service: offer.service,
      deadline: offer.delivery_time.days,
      price: offer.final_price,
    }));

    return {
      carrier: carriers,
    };
  }

  static toVolumesHttp(input: any) {
    return input.map((volume: any) => ({
      amount: Number(volume.amount),
      amount_volumes: Number(1),
      sku: String(volume.sku),
      category: String("7"),
      height: Number(volume.height),
      width: Number(volume.width),
      length: Number(volume.length),
      unitary_price: Number(volume.price),
      unitary_weight: Number(volume.unitary_weight),
    }));
  }
}

type CarrierProps = {
  name: string;
  service: string;
  deadline: number;
  price: number;
};
type QuoteMapperProps = { carrier: CarrierProps[] };
