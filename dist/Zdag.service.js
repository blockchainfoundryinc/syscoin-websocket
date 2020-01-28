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
var Zdag_1 = require("./Zdag");
var ZdagService = /** @class */ (function () {
    function ZdagService(zmqUrl, sysAddress) {
        console.log('init zdag lib:', zmqUrl);
        this.zmqUrl = zmqUrl;
        this.sysAddress = sysAddress;
        this.zdag = new Zdag_1.Zdag({ url: this.zmqUrl, address: this.sysAddress });
    }
    ZdagService.prototype.ngOnDestroy = function () {
        this.zdag.destroy();
    };
    ZdagService.prototype.asObservable = function () {
        return this.zdag.txSubject$;
    };
    ZdagService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject('zmq_url')), __param(1, core_1.Inject('sys_address'))
    ], ZdagService);
    return ZdagService;
}());
exports.ZdagService = ZdagService;
