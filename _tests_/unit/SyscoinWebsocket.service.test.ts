import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { SyscoinWebsocketConfigService, SyscoinWebsocketService } from '../../dist';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

describe('Service: SyscoinWebsocket', () => {
  let service, config;

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        SyscoinWebsocketConfigService,
        SyscoinWebsocketService
      ]
    });

    config = TestBed.get(SyscoinWebsocketConfigService);
    service = TestBed.get(SyscoinWebsocketService);
    config.configure('test', 'test');
  });

  it('Configuring the config service should trigger the websocket service to init', () => {
    expect(service.config).toEqual({ url: 'test', address: 'test' });
  });

  it('txSubject is defined after config', () => {
    expect(service.txSubject()).toBeDefined()
  });

  it('hashBlockSubject is defined after config', () => {
    expect(service.hashBlockSubject()).toBeDefined()
  });
});
