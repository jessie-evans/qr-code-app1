import { Html5QrcodeScannerStrings } from "../../strings";
import { BaseUiElementFactory, PublicUiElementIdAndClasses } from "./base";
var FileSelectionUi = (function () {
    function FileSelectionUi(parentElement, showOnRender, onFileSelected) {
        this.fileBasedScanRegion = document.createElement("div");
        this.fileBasedScanRegion.style.textAlign = "center";
        this.fileBasedScanRegion.style.display
            = showOnRender ? "block" : "none";
        parentElement.appendChild(this.fileBasedScanRegion);
        var fileScanLabel = document.createElement("label");
        fileScanLabel.setAttribute("for", this.getFileScanInputId());
        fileScanLabel.style.display = "inline-block";
        this.fileBasedScanRegion.appendChild(fileScanLabel);
        this.fileSelectionButton
            = BaseUiElementFactory.createElement("button", PublicUiElementIdAndClasses.FILE_SELECTION_BUTTON_ID);
        this.setInitialValueToButton();
        this.fileSelectionButton.addEventListener("click", function (_) {
            fileScanLabel.click();
        });
        fileScanLabel.append(this.fileSelectionButton);
        this.fileScanInput
            = BaseUiElementFactory.createElement("input", this.getFileScanInputId());
        this.fileScanInput.type = "file";
        this.fileScanInput.accept = "image/*";
        this.fileScanInput.style.display = "none";
        fileScanLabel.appendChild(this.fileScanInput);
        var $this = this;
        this.fileScanInput.addEventListener("change", function (e) {
            if (e == null || e.target == null) {
                return;
            }
            var target = e.target;
            if (target.files && target.files.length === 0) {
                return;
            }
            var fileList = target.files;
            var file = fileList[0];
            var fileName = file.name;
            $this.setImageNameToButton(fileName);
            onFileSelected(file);
        });
    }
    FileSelectionUi.prototype.hide = function () {
        this.fileBasedScanRegion.style.display = "none";
        this.fileScanInput.disabled = true;
    };
    FileSelectionUi.prototype.show = function () {
        this.fileBasedScanRegion.style.display = "block";
        this.fileScanInput.disabled = false;
    };
    FileSelectionUi.prototype.isShowing = function () {
        return this.fileBasedScanRegion.style.display === "block";
    };
    FileSelectionUi.prototype.resetValue = function () {
        this.fileScanInput.value = "";
        this.setInitialValueToButton();
    };
    FileSelectionUi.prototype.setImageNameToButton = function (imageFileName) {
        var MAX_CHARS = 20;
        if (imageFileName.length > MAX_CHARS) {
            var start8Chars = imageFileName.substring(0, 8);
            var length_1 = imageFileName.length;
            var last8Chars = imageFileName.substring(length_1 - 8, length_1);
            imageFileName = start8Chars + "...." + last8Chars;
        }
        var newText = Html5QrcodeScannerStrings.fileSelectionChooseAnother()
            + " - "
            + imageFileName;
        this.fileSelectionButton.innerText = newText;
    };
    FileSelectionUi.prototype.setInitialValueToButton = function () {
        var initialText = Html5QrcodeScannerStrings.fileSelectionChooseImage()
            + " - "
            + Html5QrcodeScannerStrings.fileSelectionNoImageSelected();
        this.fileSelectionButton.innerText = initialText;
    };
    FileSelectionUi.prototype.getFileScanInputId = function () {
        return "html5-qrcode-private-filescan-input";
    };
    FileSelectionUi.create = function (parentElement, showOnRender, onFileSelected) {
        var button = new FileSelectionUi(parentElement, showOnRender, onFileSelected);
        return button;
    };
    return FileSelectionUi;
}());
export { FileSelectionUi };
//# sourceMappingURL=file-selection-ui.js.map