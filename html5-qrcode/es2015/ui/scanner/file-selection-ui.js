import { Html5QrcodeScannerStrings } from "../../strings";
import { BaseUiElementFactory, PublicUiElementIdAndClasses } from "./base";
export class FileSelectionUi {
    constructor(parentElement, showOnRender, onFileSelected) {
        this.fileBasedScanRegion = document.createElement("div");
        this.fileBasedScanRegion.style.textAlign = "center";
        this.fileBasedScanRegion.style.display
            = showOnRender ? "block" : "none";
        parentElement.appendChild(this.fileBasedScanRegion);
        let fileScanLabel = document.createElement("label");
        fileScanLabel.setAttribute("for", this.getFileScanInputId());
        fileScanLabel.style.display = "inline-block";
        this.fileBasedScanRegion.appendChild(fileScanLabel);
        this.fileSelectionButton
            = BaseUiElementFactory.createElement("button", PublicUiElementIdAndClasses.FILE_SELECTION_BUTTON_ID);
        this.setInitialValueToButton();
        this.fileSelectionButton.addEventListener("click", (_) => {
            fileScanLabel.click();
        });
        fileScanLabel.append(this.fileSelectionButton);
        this.fileScanInput
            = BaseUiElementFactory.createElement("input", this.getFileScanInputId());
        this.fileScanInput.type = "file";
        this.fileScanInput.accept = "image/*";
        this.fileScanInput.style.display = "none";
        fileScanLabel.appendChild(this.fileScanInput);
        let $this = this;
        this.fileScanInput.addEventListener("change", (e) => {
            if (e == null || e.target == null) {
                return;
            }
            let target = e.target;
            if (target.files && target.files.length === 0) {
                return;
            }
            let fileList = target.files;
            const file = fileList[0];
            let fileName = file.name;
            $this.setImageNameToButton(fileName);
            onFileSelected(file);
        });
    }
    hide() {
        this.fileBasedScanRegion.style.display = "none";
        this.fileScanInput.disabled = true;
    }
    show() {
        this.fileBasedScanRegion.style.display = "block";
        this.fileScanInput.disabled = false;
    }
    isShowing() {
        return this.fileBasedScanRegion.style.display === "block";
    }
    resetValue() {
        this.fileScanInput.value = "";
        this.setInitialValueToButton();
    }
    setImageNameToButton(imageFileName) {
        const MAX_CHARS = 20;
        if (imageFileName.length > MAX_CHARS) {
            let start8Chars = imageFileName.substring(0, 8);
            let length = imageFileName.length;
            let last8Chars = imageFileName.substring(length - 8, length);
            imageFileName = `${start8Chars}....${last8Chars}`;
        }
        let newText = Html5QrcodeScannerStrings.fileSelectionChooseAnother()
            + " - "
            + imageFileName;
        this.fileSelectionButton.innerText = newText;
    }
    setInitialValueToButton() {
        let initialText = Html5QrcodeScannerStrings.fileSelectionChooseImage()
            + " - "
            + Html5QrcodeScannerStrings.fileSelectionNoImageSelected();
        this.fileSelectionButton.innerText = initialText;
    }
    getFileScanInputId() {
        return "html5-qrcode-private-filescan-input";
    }
    static create(parentElement, showOnRender, onFileSelected) {
        let button = new FileSelectionUi(parentElement, showOnRender, onFileSelected);
        return button;
    }
}
//# sourceMappingURL=file-selection-ui.js.map