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
      const interval = setInterval(() => {
        try {
          const isConfirmed = this.zdag.isZdagConfirmed(tx);

          if (isConfirmed) {
            clearInterval(interval);
            return resolve(tx);
          }
        } catch(err) {
          clearInterval(interval);
          return reject(err);
        }
      }, 1000);
    });
  }

  public isZdagConfirmed(tx: string) {
    try {
      return this.zdag.isTxZdagConfirmed(tx);
    } catch(err) {
      throw err;
    }
  }
}