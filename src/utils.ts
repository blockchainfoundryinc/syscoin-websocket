import axios, { AxiosInstance } from 'axios';

export const callHttp = async (url, method: 'get' | 'post' = 'get', data, unwrap = true) => {
  let responseFromRpc;
  try {
    responseFromRpc = await axios({ method, url, data });
    if (unwrap) {
      return getStandardResponseFromRpcResponse(responseFromRpc.data);
    } else {
      return responseFromRpc.data;
    }
  } catch(e) {
    if (unwrap && e.response.data.error !== undefined) {
      console.error("rpc error:", e.response);
      if(e.response.data.error.message.indexOf('ERRCODE') > -1) {
        throw new Error(e.response.data.error.message.substr(e.response.data.error.message.indexOf('ERRCODE')));
      }else {
        throw new Error(e.response.data.error.message);
      }
    } else {
      throw new Error(JSON.stringify(e.response));
    }
  }
};

export const getStandardResponseFromRpcResponse = (response) => {
  return response.result ? response.result : response;
};
