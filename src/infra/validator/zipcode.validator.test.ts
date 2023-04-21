import { ZipcodeValidator } from "./zipcode.validator";

describe("ZipcodeValidator Test", () => {
  const paramsInvalidNumber = [
    {
      value: "1",
      expected: "String must contain exactly 8 character(s)",
    },
    {
      value: "999999999",
      expected: "String must contain exactly 8 character(s)",
    },
    {
      value: "7777777",
      expected: "String must contain exactly 8 character(s)",
    },
    {
      value: "39400-00",
      expected: "Only numbers are allowed",
    },
    {
      value: [] as any,
      expected: "Expected string, received array",
    },
  ];
  describe("should return an error if amount is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if amount value is $value",
      (params) => {
        const validator = new ZipcodeValidator();
        validator.validate({
          zipcode: params.value,
        });
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([{ zipcode: params.expected }]);
      }
    );
  });

  it("should return null if zipcode is valid", () => {
    const validator = new ZipcodeValidator();
    validator.validate({
      zipcode: "39400000",
    });
    expect(validator.errors).toBeNull();
    expect(validator.transformedValues).toStrictEqual(39400000);
  });
});
