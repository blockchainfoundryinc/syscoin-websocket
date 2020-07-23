import * as socketio from 'socket.io';
import { SyscoinWebsocket } from '../../dist';

describe('SyscoinWebsocket class tests', () => {
  const app = require('http').createServer();
  const io = socketio(app);
  const syscoinWebsocketExampleConf = {
    url: 'http://localhost',
    address: 'test_address'
  }

  beforeAll(() => {
    // Create a simple socket.io server
    app.listen(80);
  });

  afterAll((done) => {
    app.close(done);
  })

  it('should create a Zdag instance', () => {
    const ws = new SyscoinWebsocket(syscoinWebsocketExampleConf);

    expect(ws).toBeInstanceOf(SyscoinWebsocket);
  });

  it('should indicate connected status through connectionSubject$', (done) => {
    const ws = new SyscoinWebsocket(syscoinWebsocketExampleConf);

    let numEvents = 0;
    ws.connectedSubject$.subscribe((data) => {
      numEvents ++;
      if(numEvents > 1) {
        expect(data).toEqual(true);
        done();
      }
    });
  });

  it('should indicate disconnected status through connectionSubject$', (done) => {
    const ws = new SyscoinWebsocket(syscoinWebsocketExampleConf);

    let numEvents = 0;
    ws.connectedSubject$.subscribe((data) => {
      numEvents ++;
      switch(numEvents) {
        case 2:
          ws.destroy();
          break;

        case 3:
          expect(data).toEqual(false);
          done();
          break;
      }
    });
  });

  it('should subscribe to txSubject$', (done) => {
    const ws = new SyscoinWebsocket(syscoinWebsocketExampleConf);

    ws.txSubject$.subscribe((data) => {
      expect(data.test).toEqual('test');
      done();
    });

    ws.txSubject$.next({ test: 'test' });
  });

  it('should trigger subscription when socket receives a message', (done) => {
    const conf = {...syscoinWebsocketExampleConf};
    conf.address = conf.address + Math.random();
    const ws = new SyscoinWebsocket(conf);

    ws.txSubject$.subscribe((data) => {
      expect(data.test).toEqual('test');
      done();
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit(conf.address, { test: 'test', message: {} });
    }, 200);
  });

  it('should add zdagTx prop if tx contains zdag status prop', (done) => {
    const conf = {...syscoinWebsocketExampleConf};
    conf.address = conf.address + Math.random();
    const ws = new SyscoinWebsocket(conf);

    ws.txSubject$.subscribe((data) => {
      expect(data.zdagTx).toBeTruthy();
      done();
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit(conf.address, {
        message: {
          status: 0
        }
      });
    }, 200);
  });

  it('should not add zdagTx prop if tx does not contain zdag status prop', (done) => {
    const conf = {...syscoinWebsocketExampleConf};
    conf.address = conf.address + Math.random();
    const ws = new SyscoinWebsocket(conf);

    ws.txSubject$.subscribe((data) => {
      expect(data.zdagTx).toBeFalsy();
      done();
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit(conf.address, {
        message: {}
      });
    }, 200);
  });

  it('should kill socket if destroy is called', (done) => {
    const conf = {...syscoinWebsocketExampleConf};
    conf.address = conf.address + Math.random();
    const ws = new SyscoinWebsocket(conf);

    let timesFired = 0;

    ws.txSubject$.subscribe((data) => {
      timesFired += 1;
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit(conf.address, {
        message: {}
      });
    }, 200);

    setTimeout(() => {
      ws.destroy();

      io.emit(conf.address, {
        message: {}
      });

      setTimeout(() => {
        expect(timesFired).toEqual(1);
        done();
      }, 600);
    }, 400);
  });

  it('should dispatch hashblockSubject$ messages when handler is called', (done) => {
    const ws = new SyscoinWebsocket(syscoinWebsocketExampleConf);

    ws.hashBlockSubject$.subscribe((data) => {
      expect(data.message[0]).toEqual('test');
      done();
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit('hashblock', {
        message: ['test']
      });
    }, 200);
  });

  it('should dispatch rejectedTxsSubject$ messages when handler is called', (done) => {
    const ws = new SyscoinWebsocket(syscoinWebsocketExampleConf);

    ws.rejectedTxsSubject$.subscribe((data) => {
      expect(data.message[0]).toEqual('test');
      done();
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit('rejected_txs', {
        message: ['test']
      });
    }, 200);
  });

});
