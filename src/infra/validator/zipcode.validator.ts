import { Validator } from "./validator";
import { z } from "zod";

export class ZipcodeValidator implements Validator {
  errors: { [key: string]: string }[] = null;
  transformedValues: any = null;
  validate(input: any): void {
    const schema = z.object({
      zipcode: z
        .string()
        .length(8)
        .regex(/^\d+$/, "Only numbers are allowed")
        .transform((value) => Number(value)),
    });
    try {
      this.transformedValues = schema.parse(input).zipcode;
    } catch (err: any) {
      const message: any = JSON.parse(err.message);
      this.errors = message.map((e: any) => ({ [e.path[0]]: e.message }));
    }
  }
}
