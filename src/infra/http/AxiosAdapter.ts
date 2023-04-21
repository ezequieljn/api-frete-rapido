import axios from "axios";
import { HttpClientInterface } from "./HttpClient";

export class AxiosAdapter implements HttpClientInterface {
  async get(url: string): Promise<any> {
    const response = await axios.get(url);
    return response.data;
  }

  async post(url: string, body: any): Promise<any> {
    const response = await axios.post(url, body);
    return response.data;
  }
}
