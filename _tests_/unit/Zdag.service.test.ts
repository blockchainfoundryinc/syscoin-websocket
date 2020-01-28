import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { ZdagService } from "../../dist";
import { TestBed } from "@angular/core/testing";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

describe('Service: ZdagStatus', () => {
  let service: ZdagService;

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        ZdagService,
        { provide: 'zmq_url', useValue: 'url'}
      ]
    });
  });

  it('zmqUrl should be injected by angular DI', () => {
    service = TestBed.get(ZdagService);
    expect(service.zmqUrl).toEqual('url');
  });
});
