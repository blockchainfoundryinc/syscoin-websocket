# Syscoin Websocket  Client
Client library for [syscoin-websocket](https://github.com/blockchainfoundryinc/syscoin-websocket). This library exposes an observable for easy access to message events and an Angular X service wrapper. An example server is available at (https://syscoin-websocket.blockchainfoundry.co)[http://amritb.github.io/socketio-client-tool/#url=aHR0cHM6Ly9zeXNjb2luLXdlYnNvY2tldC5ibG9ja2NoYWluZm91bmRyeS5jbw==&path=&opt=eyJxdWVyeSI6ImFkZHJlc3M9c3lzMXFxdHNxempyNjAybnd0YXh6dHdha2U2OXM3cDh4N2twNG04dHd2ZiJ9&events=sys1qqtsqzjr602nwtaxztwake69s7p8x7kp4m8twvf,hashblock].

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
import { SyscoinWebsocket } from 'syscoin-websocket-client';
const conf = {
  url: 'http://localhost',
  address: 'sys1qqtsqzjr602nwtaxztwake69s7p8x7kp4m8twvf'
}
const socket = new SyscoinWebsocket(conf);
socket.txSubject$.subscribe((msg) => { ... });
socket.hashBlockSubject$.subscribe((msg) => { ... });
```

### Angular X
Add `SyscoinWebsocketConfigService` and `SyscoinWebsocketService` to your applications `app.module.ts`.
```
providers: [
  SyscoinWebsocketConfigService,
  SyscoinWebsocketService,
]
```

Use as a standard Angular service. Call `SyscoinWebsocketConfigService.configure(url, syscoinAddress)` to initialize the connection.
```
constructor(private configService: SyscoinWebsocketConfigService, private socketService: SyscoinWebsocketService) {
  this.configService.configure('http://localhost:9999', 'sys1qqtsqzjr602nwtaxztwake69s7p8x7kp4m8twvf');
  this.socketService.txSubject().subscribe((msg) => { ... });
  this.socketService.hashBlockSubject().subscribe((msg) => { ... });
}
```

Handling Messages
-------------
For more information on the message data the client may receive please see [syscoin-websocket usage](https://github.com/blockchainfoundryinc/syscoin-websocket#sample-output).
