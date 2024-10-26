export declare type OnFileSelected = (file: File) => void;
export declare class FileSelectionUi {
    private readonly fileBasedScanRegion;
    private readonly fileScanInput;
    private readonly fileSelectionButton;
    constructor(parentElement: HTMLDivElement, showOnRender: boolean, onFileSelected: OnFileSelected);
    hide(): void;
    show(): void;
    isShowing(): boolean;
    resetValue(): void;
    private setImageNameToButton;
    private setInitialValueToButton;
    private getFileScanInputId;
    static create(parentElement: HTMLDivElement, showOnRender: boolean, onFileSelected: OnFileSelected): FileSelectionUi;
}
