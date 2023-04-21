import * as dotenv from "dotenv";

export class Config {
  private constructor() {}

  static init() {
    dotenv.config();
    return new Config();
  }

  static config() {
    return {
      port: Number(process.env.PORT),
    };
  }

  static database() {
    return {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    };
  }

  static baseUrl() {
    return {
      freteRapido: process.env.BASE_URL_FRETERAPIDO,
    };
  }

  static tokens() {
    return {
      token: process.env.KEY_TOKEN,
      platformCode: process.env.KEY_PLATFORMCODE,
    };
  }

  static dispatcher() {
    return {
      cnpj: process.env.DISPATCHER_CNPJ,
      zipcode: process.env.DISPATCHER_ZIPCODE,
    };
  }

  static recipient() {
    return {
      type: Number(process.env.RECIPIENT_TYPE),
      country: process.env.RECIPIENT_COUNTRY,
    };
  }
}
