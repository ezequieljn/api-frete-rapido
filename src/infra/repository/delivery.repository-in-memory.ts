import { DeliveryRepository } from "../../delivery/domain/delivery.repository.interface";

type DataProps = {
  id: number;
  shipping_company: string;
  price: number;
  created_at: Date;
};
export class DeliveryRepositoryInMemory
  implements DeliveryRepository.DatabaseInterface
{
  data: DataProps[] = [];

  constructor() {}
  async findByQuotesTotalAndMediaPrice(limit: string = "") {
    const indexStart = this.data.length - Number(limit || this.data.length);
    const data = this.data.slice(indexStart);
    const companies = {};
    data.forEach((company) => {
      const companyValue =
        (companies as any)[company.shipping_company]?.total_price || 0;
      const companyAmount =
        (companies as any)[company.shipping_company]?.amount || 0;
      (companies as any)[company.shipping_company] = {
        total_price: companyValue + company.price,
        amount: companyAmount + 1,
      };
    });
    const companyFormatted: any[] = [];
    for (let key in companies) {
      companyFormatted.push({
        shipping_company: key,
        total_price: (companies as any)[key]["total_price"],
        average_price:
          (companies as any)[key]["total_price"] /
          (companies as any)[key]["amount"],
      });
    }
    return companyFormatted;
  }

  async lowestHighestPrice() {
    let lowest = 0;
    let highest = 0;
    this.data.forEach((carrier) => {
      if (carrier.price > highest) {
        highest = carrier.price;
      }
      if (lowest === 0) {
        lowest = carrier.price;
      }
      if (carrier.price < lowest) {
        lowest = carrier.price;
      }
    });
    return {
      lowest,
      highest,
    };
  }

  async amountCarrier(limit: string = null) {
    const index = this.data.length - Number(limit || this.data.length);
    const data = this.data.slice(index);

    const companies = {};
    data.forEach((company) => {
      const companyCurrent = (companies as any)[company.shipping_company];
      (companies as any)[company.shipping_company] = companyCurrent
        ? companyCurrent + 1
        : 1;
    });
    const companiesFormatted: any[] = [];
    for (let key in companies) {
      companiesFormatted.push({
        shipping_company: key,
        amount: (companies as any)[key],
      });
    }
    return companiesFormatted;
  }

  async save(carriers: DeliveryRepository.CarrierProps[]): Promise<void> {
    for (const carrier of carriers) {
      const newIndex = this.data.length + 1;
      this.data.push({
        id: newIndex,
        price: carrier.price,
        shipping_company: carrier.name,
        created_at: new Date(),
      });
    }
  }
}
