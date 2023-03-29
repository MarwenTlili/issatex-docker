/**
 * https://nextjs.org/docs/api-reference/next.config.js/environment-variables
 * custom advanced configuration of Next.js.
 * regular Node.js module.
 * will not be parsed by Webpack, Babel or TypeScript.
 * used by the Next.js server and build phases.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: 'standalone',
	images: {
		domains: ['tailwindui.com', 'flowbite.com', 'via.placeholder.com']
	},
}

module.exports = nextConfig
