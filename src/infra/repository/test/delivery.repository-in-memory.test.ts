import { DeliveryRepositoryInMemory } from "../delivery.repository-in-memory";

describe("Delivery Repository In Memory", () => {
  let repositoryInMemory: DeliveryRepositoryInMemory;

  beforeEach(() => {
    repositoryInMemory = new DeliveryRepositoryInMemory();
  });

  it("should insert a delivery", async () => {
    const carriers = [
      { name: "carrier 1", price: 10 },
      { name: "carrier 2", price: 20 },
    ];
    expect(repositoryInMemory.data).toStrictEqual([]);
    repositoryInMemory.save(carriers);
    expect(repositoryInMemory.data).toStrictEqual([
      {
        id: 1,
        shipping_company: "carrier 1",
        price: 10,
        created_at: expect.any(Date),
      },
      {
        id: 2,
        shipping_company: "carrier 2",
        price: 20,
        created_at: expect.any(Date),
      },
    ]);
  });

  it("should return count carriers only two last", async () => {
    const carriers = [
      { name: "carrier 1", price: 10 },
      { name: "carrier 3", price: 20 },
      { name: "carrier 3", price: 30 },
      { name: "carrier 4", price: 40 },
    ];
    repositoryInMemory.save(carriers);
    const data = await repositoryInMemory.amountCarrier("3");
    expect(data).toStrictEqual([
      { amount: 2, shipping_company: "carrier 3" },
      { amount: 1, shipping_company: "carrier 4" },
    ]);
  });

  it("should return count carriers all", async () => {
    const carriers = [
      { name: "carrier 1", price: 10 },
      { name: "carrier 3", price: 20 },
      { name: "carrier 3", price: 30 },
      { name: "carrier 4", price: 40 },
    ];
    repositoryInMemory.save(carriers);
    const data = await repositoryInMemory.amountCarrier();
    expect(data).toStrictEqual([
      { amount: 1, shipping_company: "carrier 1" },
      { amount: 2, shipping_company: "carrier 3" },
      { amount: 1, shipping_company: "carrier 4" },
    ]);
  });

  it("should return lowest and highest price", async () => {
    const carriers = [
      { name: "carrier 4", price: 40 },
      { name: "carrier 2", price: 20 },
      { name: "carrier 3", price: 30 },
      { name: "carrier 1", price: 10 },
    ];
    repositoryInMemory.save(carriers);
    const data = await repositoryInMemory.lowestHighestPrice();
    expect(data).toStrictEqual({
      lowest: 10,
      highest: 40,
    });
  });

  it("should return total and media price", async () => {
    const carriers = [
      { name: "carrier 4", price: 40 },
      { name: "carrier 3", price: 20 },
      { name: "carrier 3", price: 30 },
      { name: "carrier 1", price: 15 },
      { name: "carrier 1", price: 10 },
    ];
    repositoryInMemory.save(carriers);
    const data = await repositoryInMemory.findByQuotesTotalAndMediaPrice("4");
    expect(data).toStrictEqual([
      {
        shipping_company: "carrier 3",
        total_price: 50,
        average_price: 25,
      },
      {
        shipping_company: "carrier 1",
        total_price: 25,
        average_price: 12.5,
      },
    ]);
  });
});
