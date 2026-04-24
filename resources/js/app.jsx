import React from "react";
import "./bootstrap";
import "../css/app.css";

import { route } from "ziggy-js";

window.route = route;

import { createRoot } from "react-dom/client";
import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// Protect against Vite CSS injection persisting across Frontend/Admin boundaries
router.on("before", (event) => {
    try {
        const targetUrl = new URL(
            event.detail.visit.url,
            window.location.origin,
        );
        const isTargetAdmin = targetUrl.pathname.startsWith("/admin");
        const isCurrentAdmin = window.location.pathname.startsWith("/admin");

        if (isTargetAdmin !== isCurrentAdmin) {
            // Force full page reload when crossing boundaries
            event.preventDefault();
            window.location.href = targetUrl.href;
        }
    } catch (e) {
        // Ignore parsing errors
    }
});

const appName = "SRB Motor";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);

    },
    progress: {
        color: "#4B5563",
    },
});
