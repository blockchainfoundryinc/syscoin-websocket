import { Observable, Subject, Subscription } from 'rxjs';
import { ZMQSocket } from './zmqSocket';
import { SysTxAssetAllocationSend, TransactionListEntry, SyscoinRpcClient, rpcServices } from '@syscoin/syscoin-js';
import { PendingZdagTx, ZdagConstructorProps } from './index';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { ZmqSocketService } from './ZmqSocket.service';
import { SysTxAssetAllocationSend, TransactionListEntry } from '@syscoin/syscoin-js';
import { PendingZdagTx } from './index';
import { BlockExplorerApiService } from "./BlockExplorerApi.service";

export class Zdag {
  private pendingTxs: Map<string, PendingZdagTx> = new Map<string, PendingZdagTx>();
  private subscriptions: Array<Subscription> = [];
  private updateZdagInterval;
  private zmq;
  private syscoin;

  private zdagStatusChangeSubject: Subject<Map<string, PendingZdagTx>> = new Subject<Map<string, PendingZdagTx>>();
  public zdagStatusChange$: Observable<Map<string, PendingZdagTx>> = this.zdagStatusChangeSubject.asObservable();

  constructor(props: ZdagConstructorProps) {
    this.zmq = new ZMQSocket(props.zmq.url);

    const syscoin = new SyscoinRpcClient(props.rpc);
    this.syscoin = rpcServices(syscoin.callRpc);

    console.log('Zdag status service init');

    this.subscriptions.push(this.zmq.newTx$.subscribe(txs => {
      let tx = txs[0];
      if (tx.confirmations === 0 && tx.systx && tx.systx.txtype === 'assetallocationsend') {
        console.log('ZDAG tx:', tx);
        this.addZdagTx(tx);
      } else {
        this.removeZdagTx(tx.txid);
      }
    }));
  }

  public destroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private async addZdagTx(tx: TransactionListEntry) {
    let stx = tx.systx as SysTxAssetAllocationSend;
    let zdagTx = {
      txid: tx.txid,
      address: stx.sender,
      zdag_status: await this.blockExplorerApi.assetAllocationSenderStatus(stx.asset_guid, tx.txid),
      asset_guid: stx.asset_guid
    };

    this.pendingTxs.set(tx.txid, zdagTx);

    if (this.pendingTxs.size > 0 && !this.updateZdagInterval) {
      console.log('Start poll zdag.', this.pendingTxs);
      clearInterval(this.updateZdagInterval);
      this.updateZdagInterval = setInterval(this.updateZdagTxs.bind(this), 10000);
    }
  }

  private async updateZdagTxs() {
    let statusChanged = false;
    let batchData = [];
    for (let [key, value] of this.pendingTxs) {
      let request = batchData.push(this.blockExplorerApi.getDataObject('assetallocationsenderstatus', [value.asset_guid, value.txid]));
    }

    let result = await this.blockExplorerApi.assetAllocationSenderStatusBatch(batchData);

    // TODO: get type info for response
    for (let entry of result) {
      // update status
      value.zdag_status = status;

      if (JSON.stringify(value) !== JSON.stringify(oldVal)) {
        statusChanged = true;
        this.pendingTxs.set(key, value);
      }
    }

    if (statusChanged) {
      console.log('ZDAG Status change event');
      this.zdagStatusChangeSubject.next(this.pendingTxs);
    }
  }

  private removeZdagTx(txid: string) {
    this.pendingTxs.delete(txid);

    if (this.pendingTxs.size === 0) {
      clearInterval(this.updateZdagInterval);
      this.updateZdagInterval = null;
    }
  }

  public checkAddressZdagStatus(address: string, guid: number): number {
    // go over all the pending zdag txs and see if any are status 1, if so return 1
    // @ts-ignore
    for (const k of this.pendingTxs.values()) {
      if (k.asset_guid === guid && k.zdag_status.status >= 1 && k.address === address) {
        return k.zdag_status.status;
      }
    }
    return 0;
  }

  public isTxZdagConfirmed(txid: string) {
    for (const [key, value] of this.pendingTxs) {
      if (value.txid === txid) {
        return value.zdag_status.status === 0;
      }
    }

    throw new Error('Txid not found');
  }

}
