var PublicUiElementIdAndClasses = (function () {
    function PublicUiElementIdAndClasses() {
    }
    PublicUiElementIdAndClasses.ALL_ELEMENT_CLASS = "html5-qrcode-element";
    PublicUiElementIdAndClasses.CAMERA_PERMISSION_BUTTON_ID = "html5-qrcode-button-camera-permission";
    PublicUiElementIdAndClasses.CAMERA_START_BUTTON_ID = "html5-qrcode-button-camera-start";
    PublicUiElementIdAndClasses.CAMERA_STOP_BUTTON_ID = "html5-qrcode-button-camera-stop";
    PublicUiElementIdAndClasses.TORCH_BUTTON_ID = "html5-qrcode-button-torch";
    PublicUiElementIdAndClasses.CAMERA_SELECTION_SELECT_ID = "html5-qrcode-select-camera";
    PublicUiElementIdAndClasses.FILE_SELECTION_BUTTON_ID = "html5-qrcode-button-file-selection";
    PublicUiElementIdAndClasses.SCAN_TYPE_CHANGE_ANCHOR_ID = "html5-qrcode-anchor-scan-type-change";
    PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_ON = "html5-qrcode-button-torch-on";
    PublicUiElementIdAndClasses.TORCH_BUTTON_CLASS_TORCH_OFF = "html5-qrcode-button-torch-off";
    return PublicUiElementIdAndClasses;
}());
export { PublicUiElementIdAndClasses };
var BaseUiElementFactory = (function () {
    function BaseUiElementFactory() {
    }
    BaseUiElementFactory.createElement = function (elementType, elementId) {
        var element = (document.createElement(elementType));
        element.id = elementId;
        element.classList.add(PublicUiElementIdAndClasses.ALL_ELEMENT_CLASS);
        return element;
    };
    return BaseUiElementFactory;
}());
export { BaseUiElementFactory };
//# sourceMappingURL=base.js.map