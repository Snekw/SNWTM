
const { PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    compiler: {
      removeConsole: false,
    },
  }
  if (phase === PHASE_PRODUCTION_BUILD) {
    nextConfig.compiler.removeConsole = true
  }
  return nextConfig
}
