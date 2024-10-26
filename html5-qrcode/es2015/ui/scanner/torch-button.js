var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Html5QrcodeScannerStrings } from "../../strings";
import { BaseUiElementFactory, PublicUiElementIdAndClasses } from "./base";
class TorchController {
    constructor(html5Qrcode, buttonElement, onTorchActionFailureCallback) {
        this.isTorchOn = false;
        this.html5Qrcode = html5Qrcode;
        this.buttonElement = buttonElement;
        this.onTorchActionFailureCallback = onTorchActionFailureCallback;
    }
    isTorchEnabled() {
        return this.isTorchOn;
    }
    flipState() {
        return __awaiter(this, void 0, void 0, function* () {
            this.buttonElement.disabled = true;
            let isTorchOnExpected = !this.isTorchOn;
            let constraints = {
                "torch": isTorchOnExpected,
                "advanced": [{
                        "torch": isTorchOnExpected
                    }]
            };
            try {
                yield this.html5Qrcode.applyVideoConstraints(constraints);
                let settings = this.html5Qrcode.getRunningTrackSettings();
                this.updateUiBasedOnLatestSettings(settings, isTorchOnExpected);
            }
            catch (error) {
                this.propagateFailure(isTorchOnExpected, error);
                this.buttonElement.disabled = false;
            }
        });
    }
    updateUiBasedOnLatestSettings(settings, isTorchOnExpected) {
        if (settings.torch === isTorchOnExpected) {
            this.buttonElement.innerText
                = isTorchOnExpected
                    ? Html5QrcodeScannerStrings.torchOffButton()
                    : Html5QrcodeScannerStrings.torchOnButton();
            this.isTorchOn = isTorchOnExpected;
        }
        else {
            this.propagateFailure(isTorchOnExpected);
        }
        this.buttonElement.disabled = false;
    }
    propagateFailure(isTorchOnExpected, error) {
        let errorMessage = isTorchOnExpected
            ? Html5QrcodeScannerStrings.torchOnFailedMessage()
            : Html5QrcodeScannerStrings.torchOffFailedMessage();
        if (error) {
            errorMessage += "; Error = " + error;
        }
        this.onTorchActionFailureCallback(errorMessage);
    }
    reset() {
        this.isTorchOn = false;
    }
}
export class TorchButton {
    constructor(torchButton, torchController) {
        this.torchButton = torchButton;
        this.torchController = torchController;
    }
    static create(html5Qrcode, torchButtonOptions, onTorchActionFailureCallback) {
        let torchButton = BaseUiElementFactory.createElement("button", PublicUiElementIdAndClasses.TORCH_BUTTON_ID);
        let torchController = new TorchController(html5Qrcode, torchButton, onTorchActionFailureCallback);
        torchButton.innerText
            = Html5QrcodeScannerStrings.torchOnButton();
        torchButton.style.display = torchButtonOptions.display;
        torchButton.style.marginLeft = torchButtonOptions.marginLeft;
        torchButton.addEventListener("click", (_) => __awaiter(this, void 0, void 0, function* () {
            yield torchController.flipState();
            if (torchController.isTorchEnabled()) {
                torchButton.classList.remove(PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_OFF);
                torchButton.classList.add(PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_ON);
            }
            else {
                torchButton.classList.remove(PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_ON);
                torchButton.classList.add(PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_OFF);
            }
        }));
        return new TorchButton(torchButton, torchController);
    }
    getTorchButton() {
        return this.torchButton;
    }
    reset() {
        this.torchButton.innerText = Html5QrcodeScannerStrings.torchOnButton();
        this.torchController.reset();
    }
}
export class TorchUtils {
    static isTorchSupported(mediaTrackSettings) {
        return "torch" in mediaTrackSettings;
    }
}
//# sourceMappingURL=torch-button.js.map