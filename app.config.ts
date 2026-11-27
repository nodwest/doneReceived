import type { ConfigContext } from 'expo/config';

export default function configure({ config }: ConfigContext) {
  const projectId = process.env.DONE_RECEIVED_EAS_PROJECT_ID;
  const googleServicesFile = process.env.DONE_RECEIVED_GOOGLE_SERVICES_FILE;
  const bundleIdentifier = process.env.DONE_RECEIVED_IOS_BUNDLE_IDENTIFIER;

  return {
    ...config,
    extra: projectId
      ? { ...config.extra, eas: { ...config.extra?.eas, projectId } }
      : config.extra,
    android: {
      ...config.android,
      ...(googleServicesFile && { googleServicesFile }),
    },
    ios: { ...config.ios, ...(bundleIdentifier && { bundleIdentifier }) },
  };
}
