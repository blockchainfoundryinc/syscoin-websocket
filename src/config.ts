// @ts-ignore
import { RpcConfigOptions } from "./index";

const config: RpcConfigOptions = {
  host: process.env.DOCKER_GATEWAY_IP || "127.0.0.1",
  rpcPort: process.env.RPC_PORT || 8370, // This is the port used in the docker-based integration tests, change at your peril
  username: process.env.RPC_USER || "u",
  password: process.env.RPC_PWD || "p"
};

export default config;