Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io-client");
var rxjs_1 = require("rxjs");
var SyscoinWebsocket = /** @class */ (function () {
    function SyscoinWebsocket(props) {
        var _this = this;
        this.txSubject$ = new rxjs_1.Subject();
        this.hashBlockSubject$ = new rxjs_1.Subject();
        this.socket = io(props.url, {
            transports: ['websocket'],
            query: "address=" + props.address
        });
        this.address = props.address;
        this.txSubject$ = new rxjs_1.Subject();
        this.socket.on(props.address, function (data) {
            data.zdagTx = data.message.hasOwnProperty('status') ? true : false;
            _this.txSubject$.next(data);
        });
        this.socket.on('hashblock', function (data) {
            _this.hashBlockSubject$.next(data);
        });
    }
    SyscoinWebsocket.prototype.destroy = function () {
        this.socket.close();
    };
    return SyscoinWebsocket;
}());
exports.SyscoinWebsocket = SyscoinWebsocket;
