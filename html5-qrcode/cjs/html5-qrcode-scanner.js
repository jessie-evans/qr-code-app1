"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Html5QrcodeScanner = void 0;
var core_1 = require("./core");
var html5_qrcode_1 = require("./html5-qrcode");
var strings_1 = require("./strings");
var image_assets_1 = require("./image-assets");
var storage_1 = require("./storage");
var ui_1 = require("./ui");
var camera_1 = require("./camera");
var scan_type_selector_1 = require("./ui/scanner/scan-type-selector");
var torch_button_1 = require("./ui/scanner/torch-button");
var file_selection_ui_1 = require("./ui/scanner/file-selection-ui");
var base_1 = require("./ui/scanner/base");
var Html5QrcodeScannerStatus;
(function (Html5QrcodeScannerStatus) {
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_DEFAULT"] = 0] = "STATUS_DEFAULT";
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_SUCCESS"] = 1] = "STATUS_SUCCESS";
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_WARNING"] = 2] = "STATUS_WARNING";
    Html5QrcodeScannerStatus[Html5QrcodeScannerStatus["STATUS_REQUESTING_PERMISSION"] = 3] = "STATUS_REQUESTING_PERMISSION";
})(Html5QrcodeScannerStatus || (Html5QrcodeScannerStatus = {}));
function toHtml5QrcodeCameraScanConfig(config) {
    return {
        fps: config.fps,
        qrbox: config.qrbox,
        aspectRatio: config.aspectRatio,
        disableFlip: config.disableFlip,
        videoConstraints: config.videoConstraints
    };
}
function toHtml5QrcodeFullConfig(config, verbose) {
    return {
        formatsToSupport: config.formatsToSupport,
        useBarCodeDetectorIfSupported: config.useBarCodeDetectorIfSupported,
        experimentalFeatures: config.experimentalFeatures,
        verbose: verbose
    };
}
var Html5QrcodeScanner = (function () {
    function Html5QrcodeScanner(elementId, config, verbose) {
        this.lastMatchFound = null;
        this.cameraScanImage = null;
        this.fileScanImage = null;
        this.fileSelectionUi = null;
        this.elementId = elementId;
        this.config = this.createConfig(config);
        this.verbose = verbose === true;
        if (!document.getElementById(elementId)) {
            throw "HTML Element with id=" + elementId + " not found";
        }
        this.scanTypeSelector = new scan_type_selector_1.ScanTypeSelector(this.config.supportedScanTypes);
        this.currentScanType = this.scanTypeSelector.getDefaultScanType();
        this.sectionSwapAllowed = true;
        this.logger = new core_1.BaseLoggger(this.verbose);
        this.persistedDataManager = new storage_1.PersistedDataManager();
        if (config.rememberLastUsedCamera !== true) {
            this.persistedDataManager.reset();
        }
    }
    Html5QrcodeScanner.prototype.render = function (qrCodeSuccessCallback, qrCodeErrorCallback) {
        var _this = this;
        this.lastMatchFound = null;
        this.qrCodeSuccessCallback
            = function (decodedText, result) {
                if (qrCodeSuccessCallback) {
                    qrCodeSuccessCallback(decodedText, result);
                }
                else {
                    if (_this.lastMatchFound === decodedText) {
                        return;
                    }
                    _this.lastMatchFound = decodedText;
                    _this.setHeaderMessage(strings_1.Html5QrcodeScannerStrings.lastMatch(decodedText), Html5QrcodeScannerStatus.STATUS_SUCCESS);
                }
            };
        this.qrCodeErrorCallback =
            function (errorMessage, error) {
                if (qrCodeErrorCallback) {
                    qrCodeErrorCallback(errorMessage, error);
                }
            };
        var container = document.getElementById(this.elementId);
        if (!container) {
            throw "HTML Element with id=" + this.elementId + " not found";
        }
        container.innerHTML = "";
        this.createBasicLayout(container);
        this.html5Qrcode = new html5_qrcode_1.Html5Qrcode(this.getScanRegionId(), toHtml5QrcodeFullConfig(this.config, this.verbose));
    };
    Html5QrcodeScanner.prototype.pause = function (shouldPauseVideo) {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        if (core_1.isNullOrUndefined(shouldPauseVideo) || shouldPauseVideo !== true) {
            shouldPauseVideo = false;
        }
        this.html5Qrcode.pause(shouldPauseVideo);
    };
    Html5QrcodeScanner.prototype.resume = function () {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        this.html5Qrcode.resume();
    };
    Html5QrcodeScanner.prototype.getState = function () {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.getState();
    };
    Html5QrcodeScanner.prototype.clear = function () {
        var _this = this;
        var emptyHtmlContainer = function () {
            var mainContainer = document.getElementById(_this.elementId);
            if (mainContainer) {
                mainContainer.innerHTML = "";
                _this.resetBasicLayout(mainContainer);
            }
        };
        if (this.html5Qrcode) {
            return new Promise(function (resolve, reject) {
                if (!_this.html5Qrcode) {
                    resolve();
                    return;
                }
                if (_this.html5Qrcode.isScanning) {
                    _this.html5Qrcode.stop().then(function (_) {
                        if (!_this.html5Qrcode) {
                            resolve();
                            return;
                        }
                        _this.html5Qrcode.clear();
                        emptyHtmlContainer();
                        resolve();
                    }).catch(function (error) {
                        if (_this.verbose) {
                            _this.logger.logError("Unable to stop qrcode scanner", error);
                        }
                        reject(error);
                    });
                }
                else {
                    _this.html5Qrcode.clear();
                    emptyHtmlContainer();
                }
            });
        }
        return Promise.resolve();
    };
    Html5QrcodeScanner.prototype.getRunningTrackCapabilities = function () {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.getRunningTrackCapabilities();
    };
    Html5QrcodeScanner.prototype.getRunningTrackSettings = function () {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.getRunningTrackSettings();
    };
    Html5QrcodeScanner.prototype.applyVideoConstraints = function (videoConstaints) {
        if (!this.html5Qrcode) {
            throw "Code scanner not initialized.";
        }
        return this.html5Qrcode.applyVideoConstraints(videoConstaints);
    };
    Html5QrcodeScanner.prototype.createConfig = function (config) {
        if (config) {
            if (!config.fps) {
                config.fps = core_1.Html5QrcodeConstants.SCAN_DEFAULT_FPS;
            }
            if (config.rememberLastUsedCamera !== (!core_1.Html5QrcodeConstants.DEFAULT_REMEMBER_LAST_CAMERA_USED)) {
                config.rememberLastUsedCamera
                    = core_1.Html5QrcodeConstants.DEFAULT_REMEMBER_LAST_CAMERA_USED;
            }
            if (!config.supportedScanTypes) {
                config.supportedScanTypes
                    = core_1.Html5QrcodeConstants.DEFAULT_SUPPORTED_SCAN_TYPE;
            }
            return config;
        }
        return {
            fps: core_1.Html5QrcodeConstants.SCAN_DEFAULT_FPS,
            rememberLastUsedCamera: core_1.Html5QrcodeConstants.DEFAULT_REMEMBER_LAST_CAMERA_USED,
            supportedScanTypes: core_1.Html5QrcodeConstants.DEFAULT_SUPPORTED_SCAN_TYPE
        };
    };
    Html5QrcodeScanner.prototype.createBasicLayout = function (parent) {
        parent.style.position = "relative";
        parent.style.padding = "0px";
        parent.style.border = "1px solid silver";
        this.createHeader(parent);
        var qrCodeScanRegion = document.createElement("div");
        var scanRegionId = this.getScanRegionId();
        qrCodeScanRegion.id = scanRegionId;
        qrCodeScanRegion.style.width = "100%";
        qrCodeScanRegion.style.minHeight = "100px";
        qrCodeScanRegion.style.textAlign = "center";
        parent.appendChild(qrCodeScanRegion);
        if (scan_type_selector_1.ScanTypeSelector.isCameraScanType(this.currentScanType)) {
            this.insertCameraScanImageToScanRegion();
        }
        else {
            this.insertFileScanImageToScanRegion();
        }
        var qrCodeDashboard = document.createElement("div");
        var dashboardId = this.getDashboardId();
        qrCodeDashboard.id = dashboardId;
        qrCodeDashboard.style.width = "100%";
        parent.appendChild(qrCodeDashboard);
        this.setupInitialDashboard(qrCodeDashboard);
    };
    Html5QrcodeScanner.prototype.resetBasicLayout = function (mainContainer) {
        mainContainer.style.border = "none";
    };
    Html5QrcodeScanner.prototype.setupInitialDashboard = function (dashboard) {
        var $this = this;
        this.createSection(dashboard);
        this.createSectionControlPanel();
        if (this.scanTypeSelector.hasMoreThanOneScanType()) {
            this.createSectionSwap();
        }
    };
    Html5QrcodeScanner.prototype.createHeader = function (dashboard) {
        var header = document.createElement("div");
        header.style.textAlign = "left";
        header.style.margin = "0px";
        dashboard.appendChild(header);
        var libraryInfo = new ui_1.LibraryInfoContainer();
        libraryInfo.renderInto(header);
        var headerMessageContainer = document.createElement("div");
        headerMessageContainer.id = this.getHeaderMessageContainerId();
        headerMessageContainer.style.display = "none";
        headerMessageContainer.style.textAlign = "center";
        headerMessageContainer.style.fontSize = "14px";
        headerMessageContainer.style.padding = "2px 10px";
        headerMessageContainer.style.margin = "4px";
        headerMessageContainer.style.borderTop = "1px solid #f6f6f6";
        header.appendChild(headerMessageContainer);
    };
    Html5QrcodeScanner.prototype.createSection = function (dashboard) {
        var section = document.createElement("div");
        section.id = this.getDashboardSectionId();
        section.style.width = "100%";
        section.style.padding = "10px 0px 10px 0px";
        section.style.textAlign = "left";
        dashboard.appendChild(section);
    };
    Html5QrcodeScanner.prototype.createCameraListUi = function (scpCameraScanRegion, requestPermissionContainer, requestPermissionButton) {
        var $this = this;
        $this.setHeaderMessage(strings_1.Html5QrcodeScannerStrings.cameraPermissionRequesting());
        var createPermissionButtonIfNotExists = function () {
            if (!requestPermissionButton) {
                $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
            }
        };
        html5_qrcode_1.Html5Qrcode.getCameras().then(function (cameras) {
            $this.persistedDataManager.setHasPermission(true);
            $this.resetHeaderMessage();
            if (cameras && cameras.length > 0) {
                scpCameraScanRegion.removeChild(requestPermissionContainer);
                $this.renderCameraSelection(cameras);
            }
            else {
                $this.setHeaderMessage(strings_1.Html5QrcodeScannerStrings.noCameraFound(), Html5QrcodeScannerStatus.STATUS_WARNING);
                createPermissionButtonIfNotExists();
            }
        }).catch(function (error) {
            $this.persistedDataManager.setHasPermission(false);
            if (requestPermissionButton) {
                requestPermissionButton.disabled = false;
            }
            else {
                createPermissionButtonIfNotExists();
            }
            $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
        });
    };
    Html5QrcodeScanner.prototype.createPermissionButton = function (scpCameraScanRegion, requestPermissionContainer) {
        var $this = this;
        var requestPermissionButton = base_1.BaseUiElementFactory
            .createElement("button", this.getCameraPermissionButtonId());
        requestPermissionButton.innerText
            = strings_1.Html5QrcodeScannerStrings.cameraPermissionTitle();
        requestPermissionButton.addEventListener("click", function () {
            requestPermissionButton.disabled = true;
            $this.createCameraListUi(scpCameraScanRegion, requestPermissionContainer, requestPermissionButton);
        });
        requestPermissionContainer.appendChild(requestPermissionButton);
    };
    Html5QrcodeScanner.prototype.createPermissionsUi = function (scpCameraScanRegion, requestPermissionContainer) {
        var $this = this;
        if (scan_type_selector_1.ScanTypeSelector.isCameraScanType(this.currentScanType)
            && this.persistedDataManager.hasCameraPermissions()) {
            camera_1.CameraManager.hasCameraPermissions().then(function (hasPermissions) {
                if (hasPermissions) {
                    $this.createCameraListUi(scpCameraScanRegion, requestPermissionContainer);
                }
                else {
                    $this.persistedDataManager.setHasPermission(false);
                    $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
                }
            }).catch(function (_) {
                $this.persistedDataManager.setHasPermission(false);
                $this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
            });
            return;
        }
        this.createPermissionButton(scpCameraScanRegion, requestPermissionContainer);
    };
    Html5QrcodeScanner.prototype.createSectionControlPanel = function () {
        var $this = this;
        var section = document.getElementById(this.getDashboardSectionId());
        var sectionControlPanel = document.createElement("div");
        section.appendChild(sectionControlPanel);
        var scpCameraScanRegion = document.createElement("div");
        scpCameraScanRegion.id = this.getDashboardSectionCameraScanRegionId();
        scpCameraScanRegion.style.display
            = scan_type_selector_1.ScanTypeSelector.isCameraScanType(this.currentScanType)
                ? "block" : "none";
        sectionControlPanel.appendChild(scpCameraScanRegion);
        var requestPermissionContainer = document.createElement("div");
        requestPermissionContainer.style.textAlign = "center";
        scpCameraScanRegion.appendChild(requestPermissionContainer);
        if (this.scanTypeSelector.isCameraScanRequired()) {
            this.createPermissionsUi(scpCameraScanRegion, requestPermissionContainer);
        }
        this.renderFileScanUi(sectionControlPanel);
    };
    Html5QrcodeScanner.prototype.renderFileScanUi = function (parent) {
        var showOnRender = scan_type_selector_1.ScanTypeSelector.isFileScanType(this.currentScanType);
        var $this = this;
        var onFileSelected = function (file) {
            if (!$this.html5Qrcode) {
                throw "html5Qrcode not defined";
            }
            if (!scan_type_selector_1.ScanTypeSelector.isFileScanType($this.currentScanType)) {
                return;
            }
            $this.html5Qrcode.scanFileV2(file, true)
                .then(function (html5qrcodeResult) {
                $this.resetHeaderMessage();
                $this.qrCodeSuccessCallback(html5qrcodeResult.decodedText, html5qrcodeResult);
            })
                .catch(function (error) {
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
                $this.qrCodeErrorCallback(error, core_1.Html5QrcodeErrorFactory.createFrom(error));
            });
        };
        this.fileSelectionUi = file_selection_ui_1.FileSelectionUi.create(parent, showOnRender, onFileSelected);
    };
    Html5QrcodeScanner.prototype.renderCameraSelection = function (cameras) {
        var _this = this;
        var $this = this;
        var scpCameraScanRegion = document.getElementById(this.getDashboardSectionCameraScanRegionId());
        scpCameraScanRegion.style.textAlign = "center";
        var cameraSelectionContainer = document.createElement("span");
        cameraSelectionContainer.style.marginRight = "10px";
        var numCameras = cameras.length;
        var cameraSelectionSelect = base_1.BaseUiElementFactory.createElement("select", this.getCameraSelectionId());
        if (numCameras === 1) {
            cameraSelectionSelect.style.display = "none";
        }
        else {
            var selectCameraString = strings_1.Html5QrcodeScannerStrings.selectCamera();
            cameraSelectionContainer.innerText
                = selectCameraString + " (" + cameras.length + ")  ";
        }
        var options = [];
        for (var _i = 0, cameras_1 = cameras; _i < cameras_1.length; _i++) {
            var camera = cameras_1[_i];
            var value = camera.id;
            var name_1 = camera.label == null ? value : camera.label;
            var option = document.createElement("option");
            option.value = value;
            option.innerText = name_1;
            options.push(option);
            cameraSelectionSelect.appendChild(option);
        }
        cameraSelectionContainer.appendChild(cameraSelectionSelect);
        scpCameraScanRegion.appendChild(cameraSelectionContainer);
        var cameraActionContainer = document.createElement("span");
        var cameraActionStartButton = base_1.BaseUiElementFactory.createElement("button", base_1.PublicUiElementIdAndClasses.CAMERA_START_BUTTON_ID);
        cameraActionStartButton.innerText
            = strings_1.Html5QrcodeScannerStrings.scanButtonStartScanningText();
        cameraActionContainer.appendChild(cameraActionStartButton);
        var cameraActionStopButton = base_1.BaseUiElementFactory.createElement("button", base_1.PublicUiElementIdAndClasses.CAMERA_STOP_BUTTON_ID);
        cameraActionStopButton.innerText
            = strings_1.Html5QrcodeScannerStrings.scanButtonStopScanningText();
        cameraActionStopButton.style.display = "none";
        cameraActionStopButton.disabled = true;
        cameraActionContainer.appendChild(cameraActionStopButton);
        var torchButton = torch_button_1.TorchButton.create($this.html5Qrcode, { display: "none", marginLeft: "5px" }, function (errorMessage) {
            $this.setHeaderMessage(errorMessage, Html5QrcodeScannerStatus.STATUS_WARNING);
        });
        var cameraActionTorchButton = torchButton.getTorchButton();
        cameraActionContainer.appendChild(cameraActionTorchButton);
        var showTorchButtonIfSupported = function (settings) {
            if (!torch_button_1.TorchUtils.isTorchSupported(settings)) {
                cameraActionTorchButton.style.display = "none";
                return;
            }
            cameraActionTorchButton.style.display = "inline-block";
        };
        scpCameraScanRegion.appendChild(cameraActionContainer);
        var resetCameraActionStartButton = function (shouldShow) {
            if (!shouldShow) {
                cameraActionStartButton.style.display = "none";
            }
            cameraActionStartButton.innerText
                = strings_1.Html5QrcodeScannerStrings
                    .scanButtonStartScanningText();
            cameraActionStartButton.style.opacity = "1";
            cameraActionStartButton.disabled = false;
            if (shouldShow) {
                cameraActionStartButton.style.display = "inline-block";
            }
        };
        cameraActionStartButton.addEventListener("click", function (_) {
            cameraActionStartButton.innerText
                = strings_1.Html5QrcodeScannerStrings.scanButtonScanningStarting();
            cameraSelectionSelect.disabled = true;
            cameraActionStartButton.disabled = true;
            cameraActionStartButton.style.opacity = "0.5";
            if (_this.scanTypeSelector.hasMoreThanOneScanType()) {
                $this.showHideScanTypeSwapLink(false);
            }
            $this.resetHeaderMessage();
            var cameraId = cameraSelectionSelect.value;
            $this.persistedDataManager.setLastUsedCameraId(cameraId);
            $this.html5Qrcode.start(cameraId, toHtml5QrcodeCameraScanConfig($this.config), $this.qrCodeSuccessCallback, $this.qrCodeErrorCallback)
                .then(function (_) {
                cameraActionStopButton.disabled = false;
                cameraActionStopButton.style.display = "inline-block";
                resetCameraActionStartButton(false);
                if (_this.config.showTorchButtonIfSupported === true) {
                    showTorchButtonIfSupported($this.html5Qrcode.getRunningTrackSettings());
                }
            })
                .catch(function (error) {
                $this.showHideScanTypeSwapLink(true);
                cameraSelectionSelect.disabled = false;
                resetCameraActionStartButton(true);
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
            });
        });
        if (numCameras === 1) {
            cameraActionStartButton.click();
        }
        cameraActionStopButton.addEventListener("click", function (_) {
            if (!$this.html5Qrcode) {
                throw "html5Qrcode not defined";
            }
            cameraActionStopButton.disabled = true;
            $this.html5Qrcode.stop()
                .then(function (_) {
                if (_this.scanTypeSelector.hasMoreThanOneScanType()) {
                    $this.showHideScanTypeSwapLink(true);
                }
                cameraSelectionSelect.disabled = false;
                cameraActionStartButton.disabled = false;
                cameraActionStopButton.style.display = "none";
                cameraActionStartButton.style.display = "inline-block";
                torchButton.reset();
                cameraActionTorchButton.style.display = "none";
                $this.insertCameraScanImageToScanRegion();
            }).catch(function (error) {
                cameraActionStopButton.disabled = false;
                $this.setHeaderMessage(error, Html5QrcodeScannerStatus.STATUS_WARNING);
            });
        });
        if ($this.persistedDataManager.getLastUsedCameraId()) {
            var cameraId = $this.persistedDataManager.getLastUsedCameraId();
            var cameraFound = false;
            for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
                var option = options_1[_a];
                if (option.value === cameraId) {
                    cameraFound = true;
                    break;
                }
            }
            if (cameraFound) {
                cameraSelectionSelect.value = cameraId;
                cameraActionStartButton.click();
            }
            else {
                $this.persistedDataManager.resetLastUsedCameraId();
            }
        }
    };
    Html5QrcodeScanner.prototype.createSectionSwap = function () {
        var $this = this;
        var TEXT_IF_CAMERA_SCAN_SELECTED = strings_1.Html5QrcodeScannerStrings.textIfCameraScanSelected();
        var TEXT_IF_FILE_SCAN_SELECTED = strings_1.Html5QrcodeScannerStrings.textIfFileScanSelected();
        var section = document.getElementById(this.getDashboardSectionId());
        var switchContainer = document.createElement("div");
        switchContainer.style.textAlign = "center";
        var switchScanTypeLink = base_1.BaseUiElementFactory.createElement("a", this.getDashboardSectionSwapLinkId());
        switchScanTypeLink.style.textDecoration = "underline";
        switchScanTypeLink.innerText
            = scan_type_selector_1.ScanTypeSelector.isCameraScanType(this.currentScanType)
                ? TEXT_IF_CAMERA_SCAN_SELECTED : TEXT_IF_FILE_SCAN_SELECTED;
        switchScanTypeLink.addEventListener("click", function () {
            if (!$this.sectionSwapAllowed) {
                if ($this.verbose) {
                    $this.logger.logError("Section swap called when not allowed");
                }
                return;
            }
            $this.resetHeaderMessage();
            $this.fileSelectionUi.resetValue();
            $this.sectionSwapAllowed = false;
            if (scan_type_selector_1.ScanTypeSelector.isCameraScanType($this.currentScanType)) {
                $this.clearScanRegion();
                $this.getCameraScanRegion().style.display = "none";
                $this.fileSelectionUi.show();
                switchScanTypeLink.innerText = TEXT_IF_FILE_SCAN_SELECTED;
                $this.currentScanType = core_1.Html5QrcodeScanType.SCAN_TYPE_FILE;
                $this.insertFileScanImageToScanRegion();
            }
            else {
                $this.clearScanRegion();
                $this.getCameraScanRegion().style.display = "block";
                $this.fileSelectionUi.hide();
                switchScanTypeLink.innerText = TEXT_IF_CAMERA_SCAN_SELECTED;
                $this.currentScanType = core_1.Html5QrcodeScanType.SCAN_TYPE_CAMERA;
                $this.insertCameraScanImageToScanRegion();
                $this.startCameraScanIfPermissionExistsOnSwap();
            }
            $this.sectionSwapAllowed = true;
        });
        switchContainer.appendChild(switchScanTypeLink);
        section.appendChild(switchContainer);
    };
    Html5QrcodeScanner.prototype.startCameraScanIfPermissionExistsOnSwap = function () {
        var _this = this;
        var $this = this;
        if (this.persistedDataManager.hasCameraPermissions()) {
            camera_1.CameraManager.hasCameraPermissions().then(function (hasPermissions) {
                if (hasPermissions) {
                    var permissionButton = document.getElementById($this.getCameraPermissionButtonId());
                    if (!permissionButton) {
                        _this.logger.logError("Permission button not found, fail;");
                        throw "Permission button not found";
                    }
                    permissionButton.click();
                }
                else {
                    $this.persistedDataManager.setHasPermission(false);
                }
            }).catch(function (_) {
                $this.persistedDataManager.setHasPermission(false);
            });
            return;
        }
    };
    Html5QrcodeScanner.prototype.resetHeaderMessage = function () {
        var messageDiv = document.getElementById(this.getHeaderMessageContainerId());
        messageDiv.style.display = "none";
    };
    Html5QrcodeScanner.prototype.setHeaderMessage = function (messageText, scannerStatus) {
        if (!scannerStatus) {
            scannerStatus = Html5QrcodeScannerStatus.STATUS_DEFAULT;
        }
        var messageDiv = this.getHeaderMessageDiv();
        messageDiv.innerText = messageText;
        messageDiv.style.display = "block";
        switch (scannerStatus) {
            case Html5QrcodeScannerStatus.STATUS_SUCCESS:
                messageDiv.style.background = "rgba(106, 175, 80, 0.26)";
                messageDiv.style.color = "#477735";
                break;
            case Html5QrcodeScannerStatus.STATUS_WARNING:
                messageDiv.style.background = "rgba(203, 36, 49, 0.14)";
                messageDiv.style.color = "#cb2431";
                break;
            case Html5QrcodeScannerStatus.STATUS_DEFAULT:
            default:
                messageDiv.style.background = "rgba(0, 0, 0, 0)";
                messageDiv.style.color = "rgb(17, 17, 17)";
                break;
        }
    };
    Html5QrcodeScanner.prototype.showHideScanTypeSwapLink = function (shouldDisplay) {
        if (shouldDisplay !== true) {
            shouldDisplay = false;
        }
        this.sectionSwapAllowed = shouldDisplay;
        this.getDashboardSectionSwapLink().style.display
            = shouldDisplay ? "inline-block" : "none";
    };
    Html5QrcodeScanner.prototype.insertCameraScanImageToScanRegion = function () {
        var $this = this;
        var qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        if (this.cameraScanImage) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild(this.cameraScanImage);
            return;
        }
        this.cameraScanImage = new Image;
        this.cameraScanImage.onload = function (_) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild($this.cameraScanImage);
        };
        this.cameraScanImage.width = 64;
        this.cameraScanImage.style.opacity = "0.8";
        this.cameraScanImage.src = image_assets_1.ASSET_CAMERA_SCAN;
    };
    Html5QrcodeScanner.prototype.insertFileScanImageToScanRegion = function () {
        var $this = this;
        var qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        if (this.fileScanImage) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild(this.fileScanImage);
            return;
        }
        this.fileScanImage = new Image;
        this.fileScanImage.onload = function (_) {
            qrCodeScanRegion.innerHTML = "<br>";
            qrCodeScanRegion.appendChild($this.fileScanImage);
        };
        this.fileScanImage.width = 64;
        this.fileScanImage.style.opacity = "0.8";
        this.fileScanImage.src = image_assets_1.ASSET_FILE_SCAN;
    };
    Html5QrcodeScanner.prototype.clearScanRegion = function () {
        var qrCodeScanRegion = document.getElementById(this.getScanRegionId());
        qrCodeScanRegion.innerHTML = "";
    };
    Html5QrcodeScanner.prototype.getDashboardSectionId = function () {
        return this.elementId + "__dashboard_section";
    };
    Html5QrcodeScanner.prototype.getDashboardSectionCameraScanRegionId = function () {
        return this.elementId + "__dashboard_section_csr";
    };
    Html5QrcodeScanner.prototype.getDashboardSectionSwapLinkId = function () {
        return base_1.PublicUiElementIdAndClasses.SCAN_TYPE_CHANGE_ANCHOR_ID;
    };
    Html5QrcodeScanner.prototype.getScanRegionId = function () {
        return this.elementId + "__scan_region";
    };
    Html5QrcodeScanner.prototype.getDashboardId = function () {
        return this.elementId + "__dashboard";
    };
    Html5QrcodeScanner.prototype.getHeaderMessageContainerId = function () {
        return this.elementId + "__header_message";
    };
    Html5QrcodeScanner.prototype.getCameraSelectionId = function () {
        return base_1.PublicUiElementIdAndClasses.CAMERA_SELECTION_SELECT_ID;
    };
    Html5QrcodeScanner.prototype.getCameraPermissionButtonId = function () {
        return base_1.PublicUiElementIdAndClasses.CAMERA_PERMISSION_BUTTON_ID;
    };
    Html5QrcodeScanner.prototype.getCameraScanRegion = function () {
        return document.getElementById(this.getDashboardSectionCameraScanRegionId());
    };
    Html5QrcodeScanner.prototype.getDashboardSectionSwapLink = function () {
        return document.getElementById(this.getDashboardSectionSwapLinkId());
    };
    Html5QrcodeScanner.prototype.getHeaderMessageDiv = function () {
        return document.getElementById(this.getHeaderMessageContainerId());
    };
    return Html5QrcodeScanner;
}());
exports.Html5QrcodeScanner = Html5QrcodeScanner;
//# sourceMappingURL=html5-qrcode-scanner.js.map