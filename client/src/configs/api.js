import axios from "axios";

const normalizeBaseUrl = (url) => url?.replace(/\/+$/, "");
const isLoopbackUrl = (url) => {
    if (!url) {
        return false;
    }

    try {
        const parsed = new URL(url);
        return ["localhost", "127.0.0.1"].includes(parsed.hostname);
    } catch {
        return false;
    }
};

const envBaseURL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_APP_BASE_URL;

const isLocalRuntime =
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname);

const resolvedEnvBaseURL = normalizeBaseUrl(envBaseURL);
const shouldIgnoreEnvBaseURL = !isLocalRuntime && isLoopbackUrl(resolvedEnvBaseURL);

// In production, avoid localhost fallback so deployed users don't hit your own machine.
const baseURL = normalizeBaseUrl(
    (shouldIgnoreEnvBaseURL ? null : resolvedEnvBaseURL) ||
    (isLocalRuntime ? "http://localhost:3000" : window.location.origin)
);

const api=axios.create({

        baseURL,

});

export default api;
