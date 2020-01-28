import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { RpcDataObject } from "./index";

@Injectable()
export class BlockExplorerApiService {

  private baseUrl: string = 'http://explorer.blockchainfoundry.co/';
  private assetSenderStatusUri = 'ext/assetsenderstatus';
  private assetSenderStatusBatchUri = 'ext/assetsenderstatusbatch';
  private assetAllocationBalanceUri = 'ext/assetallocationbalance';

  private readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create();
  }

  public async assetAllocationSenderStatus(assetGuid: number, txid: string) {
    return await this.instance.post(`${this.baseUrl}${this.assetSenderStatusUri}`, this.getDataObject('assetallocationsenderstatus', [assetGuid, txid]));
  }

  public async assetAllocationSenderStatusBatch(dataObjs: RpcDataObject[] ) {
    return await this.instance.post(`${this.baseUrl}${this.assetAllocationSenderStatusBatch}`, dataObjs);
  }

  public async assetAllocationBalance(assetGuid: number, txid: string) {
    return await this.instance.post(`${this.baseUrl}${this.assetAllocationBalanceUri}`, this.getDataObject('assetallocationbalance', [assetGuid, txid]));
  }

  public getDataObject(method: string, params: any[]): RpcDataObject {
    return {
      jsonrpc: "1.0",
      method: method.toLowerCase(),
      params: params ? Array.from(params).filter(element => element !== undefined) : [],
    }
  }
}

