import { CameraDevice, QrcodeErrorCallback, QrcodeSuccessCallback, Html5QrcodeSupportedFormats, Html5QrcodeResult, QrDimensions, QrDimensionFunction } from "./core";
import { ExperimentalFeaturesConfig } from "./experimental-features";
import { StateManagerProxy, Html5QrcodeScannerState } from "./state-manager";
declare type Html5QrcodeIdentifier = string | MediaTrackConstraints;
export interface Html5QrcodeConfigs {
    formatsToSupport?: Array<Html5QrcodeSupportedFormats> | undefined;
    useBarCodeDetectorIfSupported?: boolean | undefined;
    experimentalFeatures?: ExperimentalFeaturesConfig | undefined;
}
export interface Html5QrcodeFullConfig extends Html5QrcodeConfigs {
    verbose: boolean | undefined;
}
export interface Html5QrcodeCameraScanConfig {
    fps: number | undefined;
    qrbox?: number | QrDimensions | QrDimensionFunction | undefined;
    aspectRatio?: number | undefined;
    disableFlip?: boolean | undefined;
    videoConstraints?: MediaTrackConstraints | undefined;
}
export declare class Html5Qrcode {
    private readonly logger;
    private readonly elementId;
    private readonly verbose;
    private readonly qrcode;
    private shouldScan;
    private element;
    private canvasElement;
    private scannerPausedUiElement;
    private hasBorderShaders;
    private borderShaders;
    private qrMatch;
    private videoElement;
    private foreverScanTimeout;
    private localMediaStream;
    private qrRegion;
    private context;
    private lastScanImageFile;
    stateManagerProxy: StateManagerProxy;
    isScanning: boolean;
    constructor(elementId: string, configOrVerbosityFlag?: boolean | Html5QrcodeFullConfig | undefined);
    start(cameraIdOrConfig: Html5QrcodeIdentifier, configuration: Html5QrcodeCameraScanConfig | undefined, qrCodeSuccessCallback: QrcodeSuccessCallback | undefined, qrCodeErrorCallback: QrcodeErrorCallback | undefined): Promise<null>;
    pause(shouldPauseVideo?: boolean): void;
    resume(): void;
    getState(): Html5QrcodeScannerState;
    stop(): Promise<void>;
    scanFile(imageFile: File, showImage?: boolean): Promise<string>;
    scanFileV2(imageFile: File, showImage?: boolean): Promise<Html5QrcodeResult>;
    clear(): void;
    static getCameras(): Promise<Array<CameraDevice>>;
    getRunningTrackCapabilities(): MediaTrackCapabilities;
    getRunningTrackSettings(): MediaTrackSettings;
    applyVideoConstraints(videoConstaints: MediaTrackConstraints): Promise<void>;
    private static getCamerasFromMediaDevices;
    private static getCamerasFromMediaStreamTrack;
    private getSupportedFormats;
    private getUseBarCodeDetectorIfSupported;
    private validateQrboxSize;
    private validateQrboxConfig;
    private toQrdimensions;
    private setupUi;
    private createScannerPausedUiElement;
    private scanContext;
    private foreverScan;
    private onMediaStreamReceived;
    private createVideoConstraints;
    private computeCanvasDrawConfig;
    private clearElement;
    private createVideoElement;
    private possiblyUpdateShaders;
    private possiblyCloseLastScanImageFile;
    private createCanvasElement;
    private getShadedRegionBounds;
    private possiblyInsertShadingElement;
    private insertShaderBorders;
    private showPausedState;
    private hidePausedState;
    private getTimeoutFps;
}
export {};
