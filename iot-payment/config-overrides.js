// config-overrides.js
module.exports = function override(config, env) {
    // Hinzufügen der Fallback-Option für Node.js-Module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      util: require.resolve("util"),
    };
  
    return config;
  };
  