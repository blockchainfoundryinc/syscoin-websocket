Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io-client");
var rxjs_1 = require("rxjs");
var SyscoinWebsocket = /** @class */ (function () {
    function SyscoinWebsocket(props) {
        this.txSubject$ = new rxjs_1.Subject();
        this.hashBlockSubject$ = new rxjs_1.Subject();
        this.rejectedTxsSubject$ = new rxjs_1.Subject();
        this.connectedSubject$ = new rxjs_1.BehaviorSubject(null);
        this.socket = io(props.url, {
            transports: ['websocket'],
            query: "address=" + props.address
        });
        this.address = props.address;
        this.txSubject$ = new rxjs_1.Subject();
        this.socket.on('connect', this.handleConnect.bind(this));
        this.socket.on('disconnect', this.handleDisconnect.bind(this));
        this.socket.on(props.address, this.handleTxMessage.bind(this));
        this.socket.on('hashblock', this.handleHashblockMessage.bind(this));
        this.socket.on('rejected_txs', this.handleRejectedTxsMessage.bind(this));
    }
    SyscoinWebsocket.prototype.handleConnect = function () {
        this.connectedSubject$.next(true);
    };
    SyscoinWebsocket.prototype.handleDisconnect = function () {
        this.connectedSubject$.next(false);
    };
    SyscoinWebsocket.prototype.handleTxMessage = function (data) {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            }
            catch (err) {
                // Not an object, return to prevent crashing
                return;
            }
        }
        try {
            data.zdagTx = data.message.hasOwnProperty('status');
        }
        catch (err) {
            data.zdagTx = false;
        }
        this.txSubject$.next(data);
    };
    SyscoinWebsocket.prototype.handleHashblockMessage = function (data) {
        this.hashBlockSubject$.next(data);
    };
    SyscoinWebsocket.prototype.handleRejectedTxsMessage = function (data) {
        this.rejectedTxsSubject$.next(data);
    };
    SyscoinWebsocket.prototype.destroy = function () {
        this.socket.close();
    };
    return SyscoinWebsocket;
}());
exports.SyscoinWebsocket = SyscoinWebsocket;
