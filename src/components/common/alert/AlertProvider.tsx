"use client";

import { useEffect, useRef, useState } from "react";

import { subscribeToAlerts, type AlertRequest } from "@/components/common/alert/alert";
import AlertModal from "./AlertModal";

export default function AlertProvider() {
    const [currentAlert, setCurrentAlert] = useState<AlertRequest | null>(null);
    const queueRef = useRef<AlertRequest[]>([]);

    useEffect(() => {
        return subscribeToAlerts((request) => {
            queueRef.current.push(request);

            if (queueRef.current.length === 1) {
                setCurrentAlert(request);
            }
        });
    }, []);

    const closeAlert = (confirmed: boolean) => {
        if (!currentAlert) return;

        currentAlert.resolve(confirmed);
        queueRef.current.shift();
        setCurrentAlert(queueRef.current[0] ?? null);
    };

    // The dialog stays mounted so shadcn can play its own close animation;
    // the last alert's content is kept until the next one replaces it.
    const lastAlertRef = useRef<AlertRequest | null>(null);
    if (currentAlert) lastAlertRef.current = currentAlert;
    const display = currentAlert ?? lastAlertRef.current;

    if (!display) return null;

    return (
        <AlertModal
            key={display.id}
            open={!!currentAlert}
            type={display.type}
            title={display.title}
            description={display.description}
            confirmText={display.confirmText}
            cancelText={display.cancelText}
            onConfirm={() => closeAlert(true)}
            onCancel={() => closeAlert(false)}
        />
    );
}