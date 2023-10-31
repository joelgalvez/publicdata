/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    async headers() {
        return [
            {
                source: '/',
                headers: [
                    {
                        key: 'CDN-Cache-Control',
                        value: 'no-store',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'max-age:0',
                    },
                    {
                        key: 'x-joel',
                        value: 'hi',
                    },
                ],
            },
            {
                source: '/api/subscribe',
                headers: [
                    {
                        key: 'Content-type',
                        value: 'text/calendar',
                    },
                ],
            },
        ];
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
