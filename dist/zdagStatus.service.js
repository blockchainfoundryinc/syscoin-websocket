var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.ZMQ_URL = new core_1.InjectionToken('TEST');
var ZdagStatusService = /** @class */ (function () {
    function ZdagStatusService(zmqUrl) {
        console.log('init zdag lib:', zmqUrl);
        this.initialize({ zmq: { url: zmqUrl } });
    }
    ZdagStatusService.prototype.initialize = function (config) {
        this.zmqUrl = config.zmq.url;
        // this.zdag = new Zdag(config); disabled for now, needs to be refactored to use remote endpoints not local RPC
    };
    ZdagStatusService.prototype.ngOnDestroy = function () {
        this.zdag.destroy();
    };
    ZdagStatusService.prototype.isZdagConfirmed = function (tx) {
        try {
            return this.zdag.isTxZdagConfirmed(tx);
        }
        catch (err) {
            throw err;
        }
    };
    ZdagStatusService.prototype.statusChange = function () {
        return this.zdag.zdagStatusChange$;
    };
    ZdagStatusService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject('zmq_url'))
    ], ZdagStatusService);
    return ZdagStatusService;
}());
exports.ZdagStatusService = ZdagStatusService;
