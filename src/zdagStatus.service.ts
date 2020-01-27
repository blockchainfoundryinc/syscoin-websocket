import { Injectable, OnDestroy } from '@angular/core';
import { Zdag, ZdagConstructorProps } from '.';

@Injectable()
export class ZdagStatusService implements OnDestroy {
  private zdag: any;

  initialize(config: ZdagConstructorProps) {
    this.zdag = new Zdag(config);
  }

  ngOnDestroy() {
    this.zdag.destroy();
  }

  public listenToZdagConfirmed(tx: string) {
    return new Promise((resolve, reject) => {
      this.zdag.onZdagConfirm(data => {
        if (data.tx.txid === tx) {
          return resolve(data)
        }
      })
    });
  }

}