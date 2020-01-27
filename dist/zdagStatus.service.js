var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _1 = require(".");
var ZdagStatusService = /** @class */ (function () {
    function ZdagStatusService() {
    }
    ZdagStatusService.prototype.initialize = function (config) {
        this.zdag = new _1.Zdag(config);
    };
    ZdagStatusService.prototype.ngOnDestroy = function () {
        this.zdag.destroy();
    };
    ZdagStatusService.prototype.listenToZdagConfirmed = function (tx) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.zdag.onZdagConfirm(function (data) {
                if (data.tx.txid === tx) {
                    return resolve(data);
                }
            });
        });
    };
    ZdagStatusService = __decorate([
        core_1.Injectable()
    ], ZdagStatusService);
    return ZdagStatusService;
}());
exports.ZdagStatusService = ZdagStatusService;
