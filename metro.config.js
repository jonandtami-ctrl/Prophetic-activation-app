const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Prefer CJS over ESM ("import" condition) so packages like zustand resolve
// to their process.env-based build instead of the import.meta-based one,
// which Metro's web bundler can't parse (import.meta is only valid inside
// real ES modules, and Metro serves web as a plain script, not type=module).
config.resolver.unstable_conditionNames = ['require', 'react-native'];

module.exports = config;
