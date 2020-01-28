var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ZdagStatusService = /** @class */ (function () {
    function ZdagStatusService(zmq) {
        var _this = this;
        this.zmq = zmq;
        this.pendingTxs = new Map();
        this.subscriptions = [];
        this.zdagStatusChangeSubject = new rxjs_1.Subject();
        this.zadgStatusChange$ = this.zdagStatusChangeSubject.asObservable();
        console.log('Zdag status service init');
        this.subscriptions.push(this.zmq.newTx$.subscribe(function (txs) {
            var tx = txs[0];
            if (tx.confirmations === 0 && tx.systx && tx.systx.txtype === 'assetallocationsend') {
                console.log('ZDAG tx:', tx);
                _this.addZdagTx(tx);
            }
            else {
                _this.removeZdagTx(tx.txid);
            }
        }));
    }
    ZdagStatusService.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ZdagStatusService.prototype.addZdagTx = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var stx, zdagTx, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        stx = tx.systx;
                        _a = {
                            txid: tx.txid,
                            address: stx.sender
                        };
                        return [4 /*yield*/, rpc().assetAllocationSenderStatus(stx.asset_guid, stx.sender, tx.txid).call()];
                    case 1:
                        zdagTx = (_a.zdag_status = (_b.sent()),
                            _a.asset_guid = stx.asset_guid,
                            _a.receivers = {},
                            _a);
                        stx.allocations.forEach(function (allocation) {
                            zdagTx.receivers[allocation.address] = true;
                        });
                        this.pendingTxs.set(tx.txid, zdagTx);
                        if (this.pendingTxs.size > 0 && !this.updateZdagInterval) {
                            console.log('Start poll zdag.', this.pendingTxs);
                            clearInterval(this.updateZdagInterval);
                            this.updateZdagInterval = setInterval(this.updateZdagTxs.bind(this), 10000);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ZdagStatusService.prototype.updateZdagTxs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statusChanged, _i, _a, _b, key, value, oldVal, status_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        statusChanged = false;
                        _i = 0, _a = this.pendingTxs;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], key = _b[0], value = _b[1];
                        oldVal = __assign({}, value);
                        return [4 /*yield*/, rpc().assetAllocationSenderStatus(value.asset_guid, value.address, value.txid).call()];
                    case 2:
                        status_1 = _c.sent();
                        console.log('Checking:', key, status_1);
                        // update status
                        value.zdag_status = status_1;
                        if (JSON.stringify(value) !== JSON.stringify(oldVal)) {
                            statusChanged = true;
                            this.pendingTxs.set(key, value);
                        }
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (statusChanged) {
                            console.log('ZDAG Status change event');
                            this.zdagStatusChangeSubject.next(this.pendingTxs);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ZdagStatusService.prototype.removeZdagTx = function (txid) {
        this.pendingTxs.delete(txid);
        if (this.pendingTxs.size === 0) {
            clearInterval(this.updateZdagInterval);
            this.updateZdagInterval = null;
        }
    };
    ZdagStatusService.prototype.checkAddressZdagStatus = function (address, guid) {
        // go over all the pending zdag txs and see if any are status 1, if so return 1
        for (var _i = 0, _a = this.pendingTxs.values(); _i < _a.length; _i++) {
            var k = _a[_i];
            if (k.asset_guid === guid && k.zdag_status.status >= 1 && (k.receivers[address] || k.address === address)) {
                return k.zdag_status.status;
            }
        }
        return 0;
    };
    ZdagStatusService = __decorate([
        core_1.Injectable()
    ], ZdagStatusService);
    return ZdagStatusService;
}());
exports.ZdagStatusService = ZdagStatusService;
