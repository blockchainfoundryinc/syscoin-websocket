Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
var Zdag = /** @class */ (function () {
    function Zdag(props) {
        this.socket = socket_io_client_1.default.connect(props.url);
        this.address = props.address;
    }
    Zdag.prototype.destroy = function () {
        this.socket.close();
    };
    Zdag.prototype.onZdagConfirm = function (fn) {
        this.socket.on(this.address, function (data) {
            if (data.message && data.message.status === 0) {
                fn(data.message);
            }
        });
    };
    return Zdag;
}());
exports.Zdag = Zdag;
