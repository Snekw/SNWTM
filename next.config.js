
const { PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    experimental: {
      outputStandalone: true
    },
    compiler: {
      removeConsole: false,
    },
  }
  if (phase === PHASE_PRODUCTION_BUILD) {
    nextConfig.compiler.removeConsole = true
  }
  return nextConfig
}
