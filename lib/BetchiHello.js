"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var BetchiHello = (function (_super) {
    __extends(BetchiHello, _super);
    function BetchiHello() {
        return _super.apply(this, arguments) || this;
    }
    BetchiHello.prototype.render = function () {
        return React.createElement("div", null, this.props.content);
    };
    return BetchiHello;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BetchiHello;
//# sourceMappingURL=BetchiHello.js.map