declare module 'next-pwa' {
  import { NextConfig } from 'next';

  export interface PWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    publicExcludes?: string[];
    buildExcludes?: string[];
    scope?: string;
    sw?: string;
    runtimeCaching?: any[];
    fallbacks?: {
      [key: string]: string;
    };
  }

  export default function withPWA(options?: PWAOptions): (nextConfig: NextConfig) => NextConfig;
} 