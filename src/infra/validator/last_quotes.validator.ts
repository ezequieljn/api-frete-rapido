import { Validator } from "./validator";
import { z } from "zod";

export class LastQuotesValidator implements Validator {
  errors: { [key: string]: string }[] = null;
  transformedValues: any = null;
  validate(input: any): void {
    const schema = z.object({
      last_quotes: z
        .string()
        .regex(/^\d+$/, "Only numbers are allowed")
        .optional(),
    });
    try {
      this.transformedValues = schema.parse(input).last_quotes;
    } catch (err: any) {
      const message: any = JSON.parse(err.message);
      this.errors = message.map((e: any) => ({ [e.path[0]]: e.message }));
    }
  }
}
