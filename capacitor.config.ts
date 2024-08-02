import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sds.driver',
  appName: 'sdsdriver',
  webDir: 'www',
  plugins: {
    FileOpener: {
      androidPackage: "sds.driver"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
