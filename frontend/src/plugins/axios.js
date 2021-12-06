import axios from "axios";
import { config } from "./config";

export default function () {
  return axios.create({
    baseURL: config.service.BASE_API,
  });
}
