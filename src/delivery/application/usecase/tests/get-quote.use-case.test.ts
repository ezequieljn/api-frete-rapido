import { DeliveryGatewayHttp } from "../../../../infra/gateway/delivery.gateway-http";
import { GetQuote } from "../get-quote.use-case";
import { DeliveryRepositoryInMemory } from "../../../../infra/repository/delivery.repository-in-memory";

describe("Quote Usecase Test - Integration", () => {
  const responseHttpValid = {
    dispatchers: [
      {
        id: "6441ef2a5b83b7cd09bee451",
        request_id: "6441ef2a5b83b7cd09bee450",
        registered_number_shipper: "25438296000158",
        registered_number_dispatcher: "25438296000158",
        zipcode_origin: 29161376,
        offers: [
          {
            offer: 1,
            table_reference: "63b7fd854ed2f3f5dc78b4f5",
            simulation_type: 0,
            carrier: {
              name: "CORREIOS",
              registered_number: "34028316000103",
              state_inscription: "ISENTO",
              logo: "",
              reference: 281,
              company_name: "EMPRESA BRASILEIRA DE CORREIOS E TELEGRAFOS",
            },
            service: "Normal",
            delivery_time: { days: 7, estimated_date: "2023-05-03" },
            expiration: "2023-05-21T02:04:26.3433422Z",
            cost_price: 87.63,
            final_price: 87.63,
            weights: { real: 13, used: 17 },
            correios: { recipient_only: true },
            original_delivery_time: { days: 7, estimated_date: "2023-05-03" },
          },
          {
            offer: 2,
            table_reference: "637b79e783c460c51214cc04",
            simulation_type: 0,
            carrier: {
              name: "EXPRESSO FR (TESTE)",
              registered_number: "69436534000161",
              state_inscription: "ISENTO",
              logo: "https://s3.amazonaws.com/public.prod.freterapido.uploads/transportadora/foto-perfil/69436534000161.png",
              reference: 354,
              company_name: "TRANSPORTADORA EXPRESSO FR (TESTE)",
            },
            service: "Normal",
            delivery_time: {
              days: 7,
              hours: 22,
              minutes: 13,
              estimated_date: "2023-05-03",
            },
            expiration: "2023-05-21T02:04:26.343333929Z",
            cost_price: 98.23,
            final_price: 98.23,
            weights: { real: 13, cubed: 16, used: 16 },
            original_delivery_time: {
              days: 7,
              hours: 22,
              minutes: 13,
              estimated_date: "2023-05-03",
            },
          },
          {
            offer: 3,
            table_reference: "637b7a0d83c460c51214cc05",
            simulation_type: 0,
            carrier: {
              name: "RAPIDÃO FR (TESTE)",
              registered_number: "32964513000109",
              state_inscription: "ISENTO",
              logo: "https://s3.amazonaws.com/public.prod.freterapido.uploads/transportadora/foto-perfil/32964513000109.jpg",
              reference: 355,
              company_name: "TRANSPORTADORA RAPIDÃO FR (TESTE)",
            },
            service: "Normal",
            delivery_time: { days: 7, estimated_date: "2023-05-03" },
            expiration: "2023-05-21T02:04:26.34333953Z",
            cost_price: 116.75,
            final_price: 116.75,
            weights: { real: 13, cubed: 24, used: 24 },
            original_delivery_time: { days: 7, estimated_date: "2023-05-03" },
          },
        ],
      },
    ],
  };

  let useCase: GetQuote.UseCase;

  const volumeValid = {
    amount: 1,
    category: "7",
    sku: "123",
    height: 0.6,
    width: 0.2,
    length: 0.1,
    unitary_price: 100,
    unitary_weight: 1,
  };

  it("should return a quote", async () => {
    const httpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
    };

    httpClientMock.post.mockResolvedValue(responseHttpValid);
    const gateway = new DeliveryGatewayHttp(httpClientMock);
    const repository = new DeliveryRepositoryInMemory();
    useCase = new GetQuote.UseCase(repository, gateway);
    const output = await useCase.execute({
      zipcode: 39400200,
      volumes: [volumeValid],
    });
    const postCall = jest.spyOn(httpClientMock, "post");
    expect(postCall).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      carrier: [
        { name: "CORREIOS", service: "Normal", deadline: 7, price: 87.63 },
        {
          name: "EXPRESSO FR (TESTE)",
          service: "Normal",
          deadline: 7,
          price: 98.23,
        },
        {
          name: "RAPIDÃO FR (TESTE)",
          service: "Normal",
          deadline: 7,
          price: 116.75,
        },
      ],
    });
  });
});
