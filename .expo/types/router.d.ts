/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(root)` | `/(root)/dashboard` | `/(root)/form` | `/(root)/language` | `/(root)/languagecontext` | `/(root)/profile` | `/(root)\(tabs)\deckselection` | `/(root)\(tabs)\profile` | `/(root)\_layout` | `/(root)\form` | `/(root)\language` | `/_sitemap` | `/dashboard` | `/form` | `/language` | `/languagecontext` | `/profile` | `/sign-in`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
