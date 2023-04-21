import { Validator } from "./validator";
import { z } from "zod";

export class VolumeValidator implements Validator {
  errors: { [key: string]: string }[] = null;
  transformedValues: any = null;
  validate(input: any): void {
    const schema = z.array(
      z.object({
        category: z.number().transform((value) => String(value)),
        amount: z.number().positive(),
        unitary_weight: z.number().positive(),
        price: z.number().positive(),
        sku: z.string(),
        height: z.number().positive(),
        width: z.number().positive(),
        length: z.number().positive(),
      })
    );
    try {
      const arrayEmpty = input.length === 0;
      if (arrayEmpty) {
        this.errors = [{ volumes: "The volume is empty" }];
      }
      this.transformedValues = schema.parse(input);
    } catch (err: any) {
      const message: any = JSON.parse(err.message);
      this.errors = message.map((e: any) => {
        if (e.expected === "array") {
          return { volumes: "Expected array, received object" };
        }
        return { [e.path[0] || e.path[1]]: e.message };
      });
    }
  }
}
