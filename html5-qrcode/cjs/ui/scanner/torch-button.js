"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TorchUtils = exports.TorchButton = void 0;
var strings_1 = require("../../strings");
var base_1 = require("./base");
var TorchController = (function () {
    function TorchController(html5Qrcode, buttonElement, onTorchActionFailureCallback) {
        this.isTorchOn = false;
        this.html5Qrcode = html5Qrcode;
        this.buttonElement = buttonElement;
        this.onTorchActionFailureCallback = onTorchActionFailureCallback;
    }
    TorchController.prototype.isTorchEnabled = function () {
        return this.isTorchOn;
    };
    TorchController.prototype.flipState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isTorchOnExpected, constraints, settings, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.buttonElement.disabled = true;
                        isTorchOnExpected = !this.isTorchOn;
                        constraints = {
                            "torch": isTorchOnExpected,
                            "advanced": [{
                                    "torch": isTorchOnExpected
                                }]
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this.html5Qrcode.applyVideoConstraints(constraints)];
                    case 2:
                        _a.sent();
                        settings = this.html5Qrcode.getRunningTrackSettings();
                        this.updateUiBasedOnLatestSettings(settings, isTorchOnExpected);
                        return [3, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.propagateFailure(isTorchOnExpected, error_1);
                        this.buttonElement.disabled = false;
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    TorchController.prototype.updateUiBasedOnLatestSettings = function (settings, isTorchOnExpected) {
        if (settings.torch === isTorchOnExpected) {
            this.buttonElement.innerText
                = isTorchOnExpected
                    ? strings_1.Html5QrcodeScannerStrings.torchOffButton()
                    : strings_1.Html5QrcodeScannerStrings.torchOnButton();
            this.isTorchOn = isTorchOnExpected;
        }
        else {
            this.propagateFailure(isTorchOnExpected);
        }
        this.buttonElement.disabled = false;
    };
    TorchController.prototype.propagateFailure = function (isTorchOnExpected, error) {
        var errorMessage = isTorchOnExpected
            ? strings_1.Html5QrcodeScannerStrings.torchOnFailedMessage()
            : strings_1.Html5QrcodeScannerStrings.torchOffFailedMessage();
        if (error) {
            errorMessage += "; Error = " + error;
        }
        this.onTorchActionFailureCallback(errorMessage);
    };
    TorchController.prototype.reset = function () {
        this.isTorchOn = false;
    };
    return TorchController;
}());
var TorchButton = (function () {
    function TorchButton(torchButton, torchController) {
        this.torchButton = torchButton;
        this.torchController = torchController;
    }
    TorchButton.create = function (html5Qrcode, torchButtonOptions, onTorchActionFailureCallback) {
        var _this = this;
        var torchButton = base_1.BaseUiElementFactory.createElement("button", base_1.PublicUiElementIdAndClasses.TORCH_BUTTON_ID);
        var torchController = new TorchController(html5Qrcode, torchButton, onTorchActionFailureCallback);
        torchButton.innerText
            = strings_1.Html5QrcodeScannerStrings.torchOnButton();
        torchButton.style.display = torchButtonOptions.display;
        torchButton.style.marginLeft = torchButtonOptions.marginLeft;
        torchButton.addEventListener("click", function (_) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, torchController.flipState()];
                    case 1:
                        _a.sent();
                        if (torchController.isTorchEnabled()) {
                            torchButton.classList.remove(base_1.PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_OFF);
                            torchButton.classList.add(base_1.PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_ON);
                        }
                        else {
                            torchButton.classList.remove(base_1.PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_ON);
                            torchButton.classList.add(base_1.PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_OFF);
                        }
                        return [2];
                }
            });
        }); });
        return new TorchButton(torchButton, torchController);
    };
    TorchButton.prototype.getTorchButton = function () {
        return this.torchButton;
    };
    TorchButton.prototype.reset = function () {
        this.torchButton.innerText = strings_1.Html5QrcodeScannerStrings.torchOnButton();
        this.torchController.reset();
    };
    return TorchButton;
}());
exports.TorchButton = TorchButton;
var TorchUtils = (function () {
    function TorchUtils() {
    }
    TorchUtils.isTorchSupported = function (mediaTrackSettings) {
        return "torch" in mediaTrackSettings;
    };
    return TorchUtils;
}());
exports.TorchUtils = TorchUtils;
//# sourceMappingURL=torch-button.js.map