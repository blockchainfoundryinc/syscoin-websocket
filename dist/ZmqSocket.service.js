var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SockJS = require("sockjs-client");
var rxjs_1 = require("rxjs");
var ZmqSocketService = /** @class */ (function () {
    function ZmqSocketService() {
        var _this = this;
        this.config = window['config'];
        this.newBlockSubject = new rxjs_1.BehaviorSubject('');
        this.newBlock$ = this.newBlockSubject.asObservable();
        this.newTxSubject = new rxjs_1.Subject();
        this.newTx$ = this.newTxSubject.asObservable();
        this.networkStatusSubject = new rxjs_1.BehaviorSubject({ connections: 0, status: null });
        this.netStatus$ = this.networkStatusSubject.asObservable();
        this.gethStatusSubject = new rxjs_1.BehaviorSubject({ geth_sync_status: 'not connected', geth_current_block: 0, geth_total_blocks: 1 });
        this.gethStatus$ = this.gethStatusSubject.asObservable();
        this.walletStatusSubject = new rxjs_1.BehaviorSubject({ status: null, name: null });
        this.walletStatus$ = this.walletStatusSubject.asObservable();
        this.socketStatusSubject = new rxjs_1.BehaviorSubject(false);
        this.socketStatus$ = this.socketStatusSubject.asObservable();
        this.reconnectInterval = null;
        this.filterMessages = {
            'ethstatus': true,
            'hashtx': true,
            'hashblock': true,
            'networkstatus': true,
            'walletstatus': true,
            'walletrawtx': true
        };
        this.handleConnect = function () {
            console.log('zmq connected');
            _this.socketStatusSubject.next(true);
            clearInterval(_this.reconnectInterval);
        };
        this.handleMessage = function (e) {
            e.data = JSON.parse(e.data);
            // filter messages
            if (!_this.filterMessages[e.data.topic]) {
                return null;
            }
            console.log('zmq message', e.data.topic);
            switch (e.data.topic) {
                case 'walletrawtx':
                    _this.newTxSubject.next(JSON.parse(e.data.message));
                    break;
                case 'ethstatus':
                    _this.gethStatusSubject.next(JSON.parse(e.data.message));
                    break;
                case 'walletstatus':
                    _this.walletStatusSubject.next(JSON.parse(e.data.message));
                    break;
                case 'networkstatus':
                    _this.networkStatusSubject.next(JSON.parse(e.data.message));
                    break;
                case 'hashblock':
                    _this.newBlockSubject.next(e.data.message);
                    break;
            }
        };
        this.handleDisconnect = function () {
            console.log('zmq disconnected');
            _this.socketStatusSubject.next(false);
            clearInterval(_this.reconnectInterval);
            _this.reconnectInterval = setInterval(_this.connect.bind(_this), 3000);
        };
        this.connect();
    }
    ZmqSocketService.prototype.connect = function () {
        this.socket = new SockJS(this.config.zmq_socket_url);
        this.socket.onopen = this.handleConnect;
        this.socket.onmessage = this.handleMessage;
        this.socket.onclose = this.handleDisconnect;
    };
    ZmqSocketService.prototype.simulateWalletReady = function () {
        console.log('simulate ready');
        this.walletStatusSubject.next({ status: 'ready', name: '' });
    };
    ZmqSocketService = __decorate([
        core_1.Injectable()
    ], ZmqSocketService);
    return ZmqSocketService;
}());
exports.ZmqSocketService = ZmqSocketService;
