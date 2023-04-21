export namespace DeliveryGateway {
  export type VolumeProps = {
    amount: number;
    category: string;
    sku: string;
    height: number;
    width: number;
    length: number;
    unitary_price: number;
    unitary_weight: number;
  };

  export type HttpInterface = {
    getQuote(recipientZipcode: number, volumes: VolumeProps[]): Promise<any>;
  };
}
