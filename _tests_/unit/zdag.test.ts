import * as socketio from 'socket.io';
import { Zdag } from '../../src';

describe('Zdag class tests', () => {
  const app = require('http').createServer();
  const io = socketio(app);
  const zdagExampleConf = {
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
    const zdag = new Zdag(zdagExampleConf);

    expect(zdag).toBeInstanceOf(Zdag);
  });

  it('should subscribe to txSubject$', (done) => {
    const zdag = new Zdag(zdagExampleConf);

    zdag.txSubject$.subscribe((data) => {
      expect(data.test).toEqual('test');
      done();
    });

    zdag.txSubject$.next({ test: 'test' });
  });

  it('should trigger subscription when socket receives a message', (done) => {
    const conf = {...zdagExampleConf};
    conf.address = conf.address + Math.random();
    const zdag = new Zdag(conf);

    zdag.txSubject$.subscribe((data) => {
      expect(data.test).toEqual('test');
      done();
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit(conf.address, { test: 'test', message: {} });
    }, 200);
  });

  it('should add zdagTx prop if tx contains zdag status prop', (done) => {
    const conf = {...zdagExampleConf};
    conf.address = conf.address + Math.random();
    const zdag = new Zdag(conf);

    zdag.txSubject$.subscribe((data) => {
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
    const conf = {...zdagExampleConf};
    conf.address = conf.address + Math.random();
    const zdag = new Zdag(conf);

    zdag.txSubject$.subscribe((data) => {
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
    const conf = {...zdagExampleConf};
    conf.address = conf.address + Math.random();
    const zdag = new Zdag(conf);

    let timesFired = 0;

    zdag.txSubject$.subscribe((data) => {
      timesFired += 1;
    });

    setTimeout(() => {
      // Give it a little time so server doesnt emit the message before subscribing
      io.emit(conf.address, {
        message: {}
      });
    }, 200);

    setTimeout(() => {
      zdag.destroy();

      io.emit(conf.address, {
        message: {}
      });

      setTimeout(() => {
        expect(timesFired).toEqual(1);
        done();
      }, 600);
    }, 400);
  });

});
