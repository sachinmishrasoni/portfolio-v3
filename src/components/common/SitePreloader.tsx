"use client";

import { usePathname } from "next/navigation";
import Preloader from "./Preloader";

export default function SitePreloader() {
    const pathname = usePathname();

    // Do not show the portfolio preloader on admin pages.
    if (pathname.startsWith("/admin")) {
        return null;
    }

    return <Preloader oncePerSession />;
}
