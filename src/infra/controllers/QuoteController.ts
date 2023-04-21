import { GetQuote } from "../../delivery/application/usecase/get-quote.use-case";
import { HttpServer } from "../http/HttpServer";
import { MetricsQuote } from "delivery/application/usecase/metrics-quote.use-case";
import { ZipcodeValidator } from "../../infra/validator/zipcode.validator";
import { Response } from "express";
import { VolumeValidator } from "../../infra/validator/volume.validator";

export class QueueController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getQuote: GetQuote.UseCase,
    readonly metricsQuote: MetricsQuote.UseCase
  ) {
    httpServer.on(
      "post",
      "/quote",
      async (params: any, body: any, query: any, response: Response) => {
        const { errors, volumes, zipcode } = this.parameterHandling(
          body?.recipient?.address?.zipcode,
          body?.volumes || []
        );
        if (errors) {
          response.status(422).json({ message: errors });
          return;
        }
        return getQuote.execute({ zipcode, volumes });
      }
    );
    httpServer.on(
      "get",
      "/metrics",
      async (params: any, body: any, query: any) => {
        return metricsQuote.execute({ last_quotes: query.last_quotes });
      }
    );
  }
  parameterHandling(zipcode: any, volumes: any) {
    let errorMessages = {};
    const zipcodeValidator = new ZipcodeValidator();
    zipcodeValidator.validate({
      zipcode,
    });
    if (zipcodeValidator.errors) {
      errorMessages = { ...zipcodeValidator.errors[0] };
    }
    const volumesValidator = new VolumeValidator();
    volumesValidator.validate(volumes);
    if (volumesValidator.errors) {
      let errors = {};
      volumesValidator.errors.forEach((item) => {
        for (const key in item) {
          (errors as any)[key] = item[key];
        }
      });
      errorMessages = { ...errorMessages, ...errors };
    }
    const hasError = Object.keys(errorMessages).length > 0;
    return {
      zipcode: zipcodeValidator.transformedValues,
      volumes: volumesValidator.transformedValues,
      errors: hasError ? errorMessages : null,
    };
  }
}
