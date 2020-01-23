import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { ZdagStatusService } from "../../dist";
import { TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

describe('Service: ZdagStatus', () => {
  let service: ZdagStatusService;

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        ZdagStatusService,
        { provide: 'zmq_url', useValue: 'url'}
      ]
    });
  });

  it('zmqUrl should be injected by angular DI', () => {
    service = TestBed.get(ZdagStatusService);
    expect(service.zmqUrl).toEqual('url');
  });
});
