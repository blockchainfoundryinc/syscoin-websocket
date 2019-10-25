import { rpcServices } from "../../src/rpcServices";
import { JsonRpcCall } from "../../src";

describe('RPC Services Tests', () => {

  describe('callThroughToRpc', () => {
    let mockRpc = (method, args) => {
      return {
        call: () => {
          return {method, args}
        }
      }
    };

    //requires non-anonymous function
    function someRpcMethod(paramA?, paramB?): JsonRpcCall<{ method: string, args: any[]}> { return rpcServices(mockRpc).callThroughToRpc(arguments); }

    it('parses the arguments object correctly', async () => {
      let result = await someRpcMethod("A", "B").call();
      expect(result.method).toBe('somerpcmethod');
      expect(result.args[0]).toBe('A');
      expect(result.args[1]).toBe('B');
    });

    it('should work with no params passed', async () => {
      let result = await someRpcMethod().call();
      expect(result.method).toBe('somerpcmethod');
    });
  });

  describe('unwrapRpcResponse', () => {
    it('doesn\'t modify GET style requests', async () => {
      let mockResponse = {info: 123};
      let result = await rpcServices(null).unwrapRpcResponse(mockResponse);
      expect(result.info).toBe(123);
    });

    it('returns the wrapped result from POST style requests', async () => {
      let mockResponse = {
        result: {
          info: 123
        },
        error: null,
        id: null
      };
      let result = await rpcServices(null).unwrapRpcResponse(mockResponse);
      expect(result.info).toBe(123);
    });
  });
});
