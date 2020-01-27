import { Injectable, OnDestroy } from '@angular/core';
import { Zdag, ZdagConstructorProps } from '.';

@Injectable()
export class ZdagStatusService implements OnDestroy {
  private zdag: any;

  ngOnDestroy() {
    this.zdag.destroy();
  }

  public initialize(config: ZdagConstructorProps) {
    this.zdag = new Zdag(config);
  }

  asObservable() {
    return this.zdag.txSubject$;
  }

}