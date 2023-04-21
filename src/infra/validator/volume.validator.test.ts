import { VolumeValidator } from "./volume.validator";

describe("VolumeValidator Test", () => {
  const paramsValid = {
    category: 1,
    amount: 1,
    unitary_weight: 1,
    price: 1,
    sku: "1",
    height: 1,
    width: 1,
    length: 1,
  };

  const paramsInvalidNumber = [
    {
      value: "1",
      expected: "Expected number, received string",
    },
    {
      value: "0",
      expected: "Expected number, received string",
    },
    {
      value: 0,
      expected: "Number must be greater than 0",
    },
    {
      value: -5,
      expected: "Number must be greater than 0",
    },
    {
      value: [] as any,
      expected: "Expected number, received array",
    },
  ];

  describe("should return an error if amount is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if amount value is $value",
      (params) => {
        const type = "amount";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  describe("should return an error if unitary_weight is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if unitary_weight value is $value",
      (params) => {
        const type = "unitary_weight";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  describe("should return an error if price is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if price value is $value",
      (params) => {
        const type = "price";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  describe("should return an error if height is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if height value is $value",
      (params) => {
        const type = "height";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  describe("should return an error if width is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if width value is $value",
      (params) => {
        const type = "width";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  describe("should return an error if length is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if length value is $value",
      (params) => {
        const type = "length";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  const paramsInvalidCategory = [
    {
      value: "1",
      expected: "Expected number, received string",
    },
    {
      value: "0",
      expected: "Expected number, received string",
    },
    {
      value: [] as any,
      expected: "Expected number, received array",
    },
  ];
  describe("should return an error if category is not a number", () => {
    test.each(paramsInvalidCategory)(
      "should return an error if category value is $value",
      (params) => {
        const type = "category";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  const paramsInvalidSku = [
    {
      value: 1,
      expected: "Expected string, received number",
    },
    {
      value: false,
      expected: "Expected string, received boolean",
    },
    {
      value: [] as any,
      expected: "Expected string, received array",
    },
    {
      value: 0,
      expected: "Expected string, received number",
    },
  ];
  describe("should return an error if sku is not a number", () => {
    test.each(paramsInvalidSku)(
      "should return an error if sku value is $value",
      (params) => {
        const type = "sku";
        const validator = new VolumeValidator();
        validator.validate([{ ...paramsValid, [type]: params.value }]);
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ [type]: params.expected }]);
      }
    );
  });

  it("should return an error if props is for empty", () => {
    const validator = new VolumeValidator();
    validator.validate([{}]);
    expect(validator.errors).toStrictEqual([
      { category: "Required" },
      { amount: "Required" },
      { unitary_weight: "Required" },
      { price: "Required" },
      { sku: "Required" },
      { height: "Required" },
      { width: "Required" },
      { length: "Required" },
    ]);
  });

  it("should return error when when not array", () => {
    const validator = new VolumeValidator();
    validator.validate({} as any);
    expect(validator.errors).toStrictEqual([
      { volumes: "Expected array, received object" },
    ]);
  });

  it("should return error when it is an empty array", () => {
    const validator = new VolumeValidator();
    validator.validate([]);
    expect(validator.errors).toStrictEqual([
      { volumes: "The volume is empty" },
    ]);
  });
});
