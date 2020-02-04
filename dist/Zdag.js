Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io-client");
var rxjs_1 = require("rxjs");
var Zdag = /** @class */ (function () {
    function Zdag(props) {
        var _this = this;
        this.txSubject$ = new rxjs_1.Subject();
        this.socket = io(props.url, {
            transports: ['websocket'],
            query: "address=" + props.address
        });
        this.address = props.address;
        this.txSubject$ = new rxjs_1.Subject();
        this.socket.on(props.address, function (data) {
            if (data.message && data.message.hasOwnProperty('status')) {
                data.zdagTx = true;
            }
            else {
                data.zdagTx = false;
            }
            _this.txSubject$.next(data);
        });
    }
    Zdag.prototype.destroy = function () {
        this.socket.close();
    };
    return Zdag;
}());
exports.Zdag = Zdag;
