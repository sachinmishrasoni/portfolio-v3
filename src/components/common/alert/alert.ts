export type AlertType = "confirm" | "success" | "error" | "warning" | "info";

export interface AlertOptions {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

export interface AlertRequest extends AlertOptions {
    id: number;
    type: AlertType;
    resolve: (confirmed: boolean) => void;
}

type AlertListener = (request: AlertRequest) => void;

const listeners = new Set<AlertListener>();
let requestId = 0;

const notify = (request: AlertRequest) => {
    listeners.forEach((listener) => listener(request));
};

export const subscribeToAlerts = (listener: AlertListener) => {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
};

const createAlert = (type: AlertType) => {
    return (options: AlertOptions): Promise<boolean> =>
        new Promise((resolve) => {
            notify({
                ...options,
                id: ++requestId,
                type,
                resolve,
            });
        });
};

export const alert = {
    confirm: createAlert("confirm"),
    success: createAlert("success"),
    error: createAlert("error"),
    warning: createAlert("warning"),
    info: createAlert("info"),
};
