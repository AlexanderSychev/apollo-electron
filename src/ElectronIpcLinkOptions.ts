/** Stateless link options */
export interface ElectronIpcLinkOptions {
    /** Request event type (from render process to main process) */
    requestEventType: string;
    /** Response event type (from main process to render process) */
    responseEventType: string;
}
