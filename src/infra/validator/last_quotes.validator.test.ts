import { LastQuotesValidator } from "./last_quotes.validator";

describe("LastQuotesValidator Test", () => {
  const paramsInvalidNumber = [
    {
      value: "asd",
      expected: { last_quotes: "Only numbers are allowed" },
    },
    {
      value: "10.7",
      expected: { last_quotes: "Only numbers are allowed" },
    },
    {
      value: 0,
      expected: { last_quotes: "Expected string, received number" },
    },
    {
      value: -5,
      expected: { last_quotes: "Expected string, received number" },
    },
    {
      value: [] as any,
      expected: { last_quotes: "Expected string, received array" },
    },
  ];

  describe("should return an error if LastQuotes is not a number", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if LastQuotes value is $value",
      (params) => {
        const validator = new LastQuotesValidator();
        validator.validate({ last_quotes: params.value });
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([params.expected]);
      }
    );
  });

  it("should not return error when empty", () => {
    const validator = new LastQuotesValidator();
    validator.validate({} as any);
    expect(validator.errors).toBeNull();
  });
});
