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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var zmqSocket_1 = require("./zmqSocket");
var syscoin_js_1 = require("@syscoin/syscoin-js");
var Zdag = /** @class */ (function () {
    function Zdag(props) {
        var _this = this;
        this.pendingTxs = new Map();
        this.subscriptions = [];
        this.zdagStatusChangeSubject = new rxjs_1.Subject();
        this.zadgStatusChange$ = this.zdagStatusChangeSubject.asObservable();
        this.zmq = new zmqSocket_1.ZMQSocket(props.zmq.url);
        var syscoin = new syscoin_js_1.SyscoinRpcClient(props.rpc);
        this.syscoin = syscoin_js_1.rpcServices(syscoin.callRpc);
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
    Zdag.prototype.destroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    Zdag.prototype.addZdagTx = function (tx) {
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
                        return [4 /*yield*/, this.syscoin.assetAllocationVerifyZdag(tx.txid).call()];
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
    Zdag.prototype.updateZdagTxs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statusChanged, _a, _b, _c, key, value, oldVal, status_1, e_1_1;
            var e_1, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        statusChanged = false;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        _a = __values(this.pendingTxs), _b = _a.next();
                        _e.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        _c = __read(_b.value, 2), key = _c[0], value = _c[1];
                        oldVal = __assign({}, value);
                        return [4 /*yield*/, this.syscoin.assetAllocationVerifyZdag(value.txid).call()];
                    case 3:
                        status_1 = _e.sent();
                        console.log('Checking:', key, status_1);
                        // update status
                        value.zdag_status = status_1;
                        if (JSON.stringify(value) !== JSON.stringify(oldVal)) {
                            statusChanged = true;
                            this.pendingTxs.set(key, value);
                        }
                        _e.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        if (statusChanged) {
                            console.log('ZDAG Status change event');
                            this.zdagStatusChangeSubject.next(this.pendingTxs);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Zdag.prototype.removeZdagTx = function (txid) {
        this.pendingTxs.delete(txid);
        if (this.pendingTxs.size === 0) {
            clearInterval(this.updateZdagInterval);
            this.updateZdagInterval = null;
        }
    };
    Zdag.prototype.checkAddressZdagStatus = function (address, guid) {
        var e_2, _a;
        try {
            // go over all the pending zdag txs and see if any are status 1, if so return 1
            // @ts-ignore
            for (var _b = __values(this.pendingTxs.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var k = _c.value;
                if (k.asset_guid === guid && k.zdag_status.status >= 1 && (k.receivers[address] || k.address === address)) {
                    return k.zdag_status.status;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return 0;
    };
    Zdag.prototype.isTxZdagConfirmed = function (txid) {
        var e_3, _a;
        try {
            for (var _b = __values(this.pendingTxs), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                if (value.txid === txid) {
                    return value.zdag_status.status === 0;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        throw new Error('Txid not found');
    };
    return Zdag;
}());
exports.Zdag = Zdag;
