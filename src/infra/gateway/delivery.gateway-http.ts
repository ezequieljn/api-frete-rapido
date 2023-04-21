import { Config } from "../../config/config";
import { DeliveryGateway } from "../../delivery/domain/delivery.gateway.interface";
import { HttpClientInterface } from "../http/HttpClient";

export class DeliveryGatewayHttp implements DeliveryGateway.HttpInterface {
  constructor(readonly httpClient: HttpClientInterface) {}

  async getQuote(
    recipientZipcode: number,
    volumes: DeliveryGateway.VolumeProps[]
  ) {
    try {
      const response = await this.httpClient.post(
        Config.baseUrl().freteRapido,
        {
          shipper: {
            registered_number: Config.dispatcher().cnpj,
            token: Config.tokens().token,
            platform_code: Config.tokens().platformCode,
          },
          recipient: {
            type: Config.recipient().type,
            country: Config.recipient().country,
            zipcode: Number(recipientZipcode),
          },
          dispatchers: [
            {
              registered_number: Config.dispatcher().cnpj,
              zipcode: Number(Config.dispatcher().zipcode),
              volumes,
            },
          ],
          simulation_type: [0],
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
