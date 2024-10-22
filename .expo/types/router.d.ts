/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(root)` | `/(root)/dashboard` | `/_sitemap` | `/dashboard` | `/sign-in`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
