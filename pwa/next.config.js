/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	output: 'standalone',
	images: {
		domains: ['tailwindui.com', 'picsum.photos']
	},
}

module.exports = nextConfig
