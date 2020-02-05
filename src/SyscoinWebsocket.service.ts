import { Injectable, OnDestroy } from '@angular/core';
import { SyscoinWebsocket } from "./SyscoinWebsocket";
import { SyscoinWebsocketConfigService } from "./SyscoinWebsocketConfig.service";
import { SyscoinWebsocketConstructorProps } from "./index";

@Injectable()
export class SyscoinWebsocketService implements OnDestroy {
  private syscoinWebsocket: SyscoinWebsocket;
  public config: SyscoinWebsocketConstructorProps;

  constructor(private configService: SyscoinWebsocketConfigService) {
    this.configService.configComplete.subscribe(config => {
      if (!config) return;
      this.config = config;
      this.syscoinWebsocket = new SyscoinWebsocket({ url: config.url, address: config.address});
    });
  }

  ngOnDestroy() {
    this.configService.configComplete.unsubscribe();
  }

  txSubject() {
    return this.syscoinWebsocket.txSubject$;
  }

  hashBlockSubject() {
    return this.syscoinWebsocket.hashBlockSubject$;
  }
}
