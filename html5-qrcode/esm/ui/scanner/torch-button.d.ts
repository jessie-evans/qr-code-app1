import { Html5Qrcode } from "../../html5-qrcode";
export declare type OnTorchActionFailureCallback = (failureMessage: string) => void;
export interface TorchButtonOptions {
    display: string;
    marginLeft: string;
}
export declare class TorchButton {
    static create(html5Qrcode: Html5Qrcode, torchButtonOptions: TorchButtonOptions, onTorchActionFailureCallback: OnTorchActionFailureCallback): TorchButton;
    private readonly torchButton;
    private readonly torchController;
    private constructor();
    getTorchButton(): HTMLButtonElement;
    reset(): void;
}
export declare class TorchUtils {
    static isTorchSupported(mediaTrackSettings: MediaTrackSettings): boolean;
}
