/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(root)` | `/(root)/(tabs)` | `/(root)/(tabs)/deckselection` | `/(root)/(tabs)/profile` | `/(root)/deckselection` | `/(root)/form` | `/(root)/language` | `/(root)/languagecontext` | `/(root)/profile` | `/(root)\editavatar` | `/(tabs)` | `/(tabs)/deckselection` | `/(tabs)/profile` | `/_sitemap` | `/deckselection` | `/form` | `/language` | `/languagecontext` | `/profile` | `/sign-in`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
