/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { isServer, dev }) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
        };

        config.module.rules.push({
            test: /\.wasm$/,
            type: "asset/resource",
        });

        return config;
    },
};

export default nextConfig;
