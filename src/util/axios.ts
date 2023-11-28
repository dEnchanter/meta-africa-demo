import axios from "axios";
import { Baseurl } from "./constants";

const instance = axios.create({
  baseURL: Baseurl + "/api/x1/",
});

instance.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  config.headers['Authorization'] = `Bearer ${token}`;
  config.headers['APP_ID'] = 'bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr';
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = 'application/json';
  return config;
});

export default instance;