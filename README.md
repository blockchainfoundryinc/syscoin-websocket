# Syscoin Websocket
Client library for [syscoin-websocket-server](https://github.com/blockchainfoundryinc/syscoin-websocket-server). This library exposes an observable for easy access to message events and an Angular X service wrapper. An example server is available at [https://syscoin-websocket.blockchainfoundry.co](http://amritb.github.io/socketio-client-tool/#url=aHR0cHM6Ly9zeXNjb2luLXdlYnNvY2tldC5ibG9ja2NoYWluZm91bmRyeS5jbw==&path=&opt=eyJxdWVyeSI6ImFkZHJlc3M9c3lzMXFxdHNxempyNjAybnd0YXh6dHdha2U2OXM3cDh4N2twNG04dHd2ZiJ9&events=sys1qqtsqzjr602nwtaxztwake69s7p8x7kp4m8twvf,hashblock).

Installation
------------
Recommended node version: 12.x or higher.
```
npm i -s http://www.github.com/blockchainfoundryinc/syscoin-websocket
```


Usage
-------------
The client can be used as standalone TS/JS or via an Angular X service wrapper. 
Because the test suite exercises both standalone and Angular X services, you will need 
to install the Angular dependencies for both building and running the test suite. `npm-install-peers` is 
included as a dev-dependency to simplify this process. To fully install, build and 
test from source:

```
cd syscoin-websocket
npm i
npm-install-peers
npm run build-test
```

### Standard TS/JS
```
import { SyscoinWebsocket } from 'syscoin-websocket';
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
For more information on the message data the client may receive please see [syscoin-websocket usage](https://github.com/blockchainfoundryinc/syscoin-websocket-server#sample-output).
