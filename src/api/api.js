import axios from "redaxios";

export function createRequest(config = {}) {
  return axios.create({
    baseURL: "http://localhost:3000",
    ...config,
  });
}
