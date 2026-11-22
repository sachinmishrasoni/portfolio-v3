import type { AlertType } from "@/components/common/alert/alert";

/**
 * Static Tailwind classes shared by every alert type.
 * `!` (important) is used on purpose to override the default layout of the
 * shadcn alert-dialog parts (left-aligned header, inset/bordered footer, padding).
 */
export const alertStyles = {
    content:
        "!gap-0 !p-0 max-w-[420px] overflow-hidden !rounded-2xl border shadow-2xl sm:max-w-[420px] text-center data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-bottom-4 duration-300",
    accentBar: "absolute inset-x-0 top-0 h-1 origin-left bg-gradient-to-r",
    body: "flex w-full flex-col items-center justify-center px-6 pb-6 pt-8 text-center",
    iconRoot: "relative mb-6 flex h-16 w-16 items-center justify-center",
    iconRing: "absolute inset-0 rounded-full",
    iconCircle:
        "relative flex h-16 w-16 items-center justify-center rounded-full",
    icon: "h-8 w-8",
    header:
        "!flex !w-full !flex-col !items-center !justify-center !gap-2 !place-items-center !text-center sm:!text-center",
    headerItem: "w-full text-center",
    title: "!text-center text-xl font-semibold tracking-tight text-foreground",
    description:
        "mx-auto max-w-[320px] !text-center text-sm leading-relaxed text-muted-foreground",
    footerWrap: "mt-6 w-full",
    footer:
        "!m-0 !flex !w-full !flex-col-reverse !items-center !justify-center !gap-3 !rounded-none !border-0 !bg-transparent !p-0 sm:!flex-row",
    buttonWrap: "w-full sm:w-auto",
    button:
        "h-10 w-full min-w-[120px] rounded-xl px-6 text-sm font-semibold !mt-0 sm:w-auto",
    cancelButton: "border bg-background hover:bg-accent",
} as const;

/** Per-type colour theming. */
export const alertTypeStyles: Record<
    AlertType,
    {
        iconCircle: string;
        iconRing: string;
        accent: string;
        confirmButton: string;
        defaultTitle: string;
        defaultConfirmText: string;
    }
> = {
    confirm: {
        iconCircle:
            "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        iconRing: "bg-amber-400/30",
        accent: "from-amber-400 via-orange-400 to-red-400",
        confirmButton:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        defaultTitle: "Are you sure?",
        defaultConfirmText: "Continue",
    },
    success: {
        iconCircle:
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
        iconRing: "bg-emerald-400/30",
        accent: "from-emerald-400 via-green-400 to-teal-400",
        confirmButton: "bg-emerald-600 text-white hover:bg-emerald-600/90",
        defaultTitle: "Success!",
        defaultConfirmText: "OK",
    },
    error: {
        iconCircle:
            "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
        iconRing: "bg-red-400/30",
        accent: "from-red-500 via-rose-400 to-orange-400",
        confirmButton: "bg-red-600 text-white hover:bg-red-600/90",
        defaultTitle: "Something went wrong!",
        defaultConfirmText: "OK",
    },
    warning: {
        iconCircle:
            "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
        iconRing: "bg-amber-400/30",
        accent: "from-yellow-400 via-amber-400 to-orange-400",
        confirmButton: "bg-amber-500 text-white hover:bg-amber-500/90",
        defaultTitle: "Warning!",
        defaultConfirmText: "OK",
    },
    info: {
        iconCircle:
            "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
        iconRing: "bg-blue-400/30",
        accent: "from-blue-500 via-sky-400 to-cyan-400",
        confirmButton: "bg-blue-600 text-white hover:bg-blue-600/90",
        defaultTitle: "Information",
        defaultConfirmText: "OK",
    },
};