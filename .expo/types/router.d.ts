/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(root)` | `/(root)/dashboard` | `/(root)/form` | `/(root)/language` | `/(root)/languagecontext` | `/_sitemap` | `/dashboard` | `/form` | `/language` | `/languagecontext` | `/sign-in`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
