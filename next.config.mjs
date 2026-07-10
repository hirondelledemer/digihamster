/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
    this is temporary. Since react-big-calendar buttons do not work with nextjs starting v13
    more information here https://github.com/vercel/next.js/issues/56206
	*/
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
   typescript: {
    // Dangerously allow production builds to successfully complete 
    // even if your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
