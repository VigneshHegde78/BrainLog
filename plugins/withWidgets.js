import { ConfigPlugin, withPluginBasedProvider } from 'expo/config-plugins';

const withWidgets: ConfigPlugin = (config) => {
  return withPluginBasedProvider(config, async (nextConfig) => {
    // This plugin will be called during the build process
    // The native widget files we created will be included automatically
    // when using expo prebuild with --clean
    return nextConfig;
  });
};

export default withWidgets;
