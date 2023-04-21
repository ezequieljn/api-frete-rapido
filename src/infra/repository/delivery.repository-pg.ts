import { DeliveryRepository } from "../../delivery/domain/delivery.repository.interface";
import { Connection } from "../database/connection";

export class DeliveryRepositoryPg
  implements DeliveryRepository.DatabaseInterface
{
  constructor(readonly connection: Connection) {}
  async findByQuotesTotalAndMediaPrice(limit: string): Promise<number> {
    const data = await this.connection.query(
      `SELECT shipping_company, SUM(price) as total_price, 
      AVG(price) as average_price 
      FROM carrier_quotation WHERE id IN 
      ( SELECT id FROM carrier_quotation 
        ORDER BY id DESC ${limit ? "LIMIT $1" : ""}) 
      GROUP BY shipping_company;`,
      [limit]
    );

    return data;
  }

  async lowestHighestPrice() {
    const [data] = await this.connection.query(
      `SELECT MIN(price) AS lowest, 
        MAX(price) AS highest
        FROM carrier_quotation;`
    );
    return data;
  }

  async amountCarrier(limit: string) {
    const data = await this.connection.query(
      `SELECT shipping_company, COUNT(*) as amount 
      FROM carrier_quotation WHERE id IN 
    ( SELECT id FROM carrier_quotation ORDER BY id DESC ${
      limit ? "LIMIT $1" : ""
    }) 
    GROUP BY shipping_company;`,
      [limit]
    );

    return data;
  }

  async save(carriers: DeliveryRepository.CarrierProps[]): Promise<any> {
    for (const carrier of carriers) {
      const [data] = await this.connection.query(
        "insert into carrier_quotation (shipping_company, price) values ($1, $2)",
        [carrier.name, carrier.price]
      );
    }
  }
}
