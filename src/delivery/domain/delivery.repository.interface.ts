export namespace DeliveryRepository {
  export type CarrierProps = {
    name: string;
    price: number;
  };
  export type DatabaseInterface = {
    save(carrier: CarrierProps[]): Promise<any>;
    findByQuotesTotalAndMediaPrice(limit: string): Promise<any>;
    lowestHighestPrice(): Promise<any>;
    amountCarrier(limit: string): Promise<any>;
  };
}
