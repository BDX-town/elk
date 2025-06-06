import type { akkoma } from '@bdxtown/akko'
import { DEFAULT_FONT_SIZE } from '~/constants'

export type FontSize = `${number}px`

// Temporary type for backward compatibility
export type OldFontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ColorMode = 'light' | 'dark' | 'system'

export type NavButtonName = 'home' | 'search' | 'notification' | 'mention' | 'favorite' | 'bookmark' | 'compose' | 'explore' | 'local' | 'bubble' | 'federated' | 'list' | 'hashtag' | 'setting' | 'moreMenu'

export interface PreferencesSettings {
  replyVisibility: akkoma.rest.v1.ListTimelineParams['replyVisibility']
  hideAltIndicatorOnPosts: boolean
  hideGifIndicatorOnPosts: boolean
  hideBoostCount: boolean
  hideReplyCount: boolean
  hideReactCount: boolean
  hideFollowerCount: boolean
  hideTranslation: boolean
  hideUsernameEmojis: boolean
  hideAccountHoverCard: boolean
  hideTagHoverCard: boolean
  hideNews: boolean
  grayscaleMode: boolean
  enableAutoplay: boolean
  unmuteVideos: boolean
  optimizeForLowPerformanceDevice: boolean
  autoloadNewItems: boolean
  enableDataSaving: boolean
  enablePinchToZoom: boolean
  zenMode: boolean
  experimentalVirtualScroller: boolean
  experimentalGitHubCards: boolean
  experimentalUserPicker: boolean
  experimentalEmbeddedMedia: boolean
}

export interface UserSettings {
  publishLanguage: string
  preferences: Partial<PreferencesSettings>
  colorMode?: ColorMode
  fontSize: FontSize
  language: string
  disabledTranslationLanguages: string[]
  themeColors?: ThemeColors
}

export interface ThemeColors {
  '--theme-color-name': string

  '--c-primary': string
  '--c-primary-active': string
  '--c-primary-light': string
  '--c-primary-fade': string
  '--c-dark-primary': string
  '--c-dark-primary-active': string
  '--c-dark-primary-light': string
  '--c-dark-primary-fade': string

  '--rgb-primary': string
  '--rgb-dark-primary': string
}

export function getDefaultLanguage(languages: string[]) {
  if (import.meta.server)
    return 'en-US'
  return matchLanguages(languages, navigator.languages) || 'en-US'
}

export const DEFAULT__PREFERENCES_SETTINGS: PreferencesSettings = {
  replyVisibility: null,
  hideAltIndicatorOnPosts: false,
  hideGifIndicatorOnPosts: false,
  hideBoostCount: false,
  hideReplyCount: false,
  autoloadNewItems: false,
  hideReactCount: false,
  hideFollowerCount: false,
  hideTranslation: false,
  hideUsernameEmojis: false,
  hideAccountHoverCard: false,
  hideTagHoverCard: false,
  hideNews: false,
  grayscaleMode: false,
  enableAutoplay: true,
  unmuteVideos: false,
  optimizeForLowPerformanceDevice: false,
  enableDataSaving: false,
  enablePinchToZoom: false,
  zenMode: false,
  experimentalVirtualScroller: true,
  experimentalGitHubCards: true,
  experimentalUserPicker: true,
  experimentalEmbeddedMedia: false,
}

export function getDefaultUserSettings(locales: string[]): UserSettings {
  return {
    publishLanguage: getDefaultLanguage(locales),
    language: getDefaultLanguage(locales),
    fontSize: DEFAULT_FONT_SIZE,
    disabledTranslationLanguages: [],
    preferences: DEFAULT__PREFERENCES_SETTINGS,
  }
}
