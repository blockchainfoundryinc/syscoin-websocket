# Syscoin Websocket  Client
Client library for syscoin-websocket. This library exposes an observable for easy access to message events and an Angular X service wrapper.

Installation
------------
```
npm i -s http://www.github.com/blockchainfoundryinc/syscoin-websocket-client
```


Usage
-------------
The client can be used as standalone TS/JS or via an Angular X service wrapper.

### Standard TS/JS
```
import { Zdag } from 'syscoin-websocket-client';
const conf = {
  url: 'http://localhost',
  address: 'sys1qqtsqzjr602nwtaxztwake69s7p8x7kp4m8twvf'
}
const zdag = new Zdag(zdagExampleConf);
zdag.txSubject$.subscribe((msg) => { ... });
```

### Angular X
Add `ZdagService`, `zmq_url`, and `sys_address` to your applications `app.module.ts`.
```
providers: [
  ZdagService,
  { provide: 'zmq_url', useValue: 'http://localhost'},
  { provide: 'sys_address', useValue: 'sys1qqtsqzjr602nwtaxztwake69s7p8x7kp4m8twvf'},
]
```

Use `ZdagService` as a standard Angular service.
```
constructor(private zdagService: ZdagService) {
  this.zdagService.asObservable().subscribe((msg) => { ... });
}
```
