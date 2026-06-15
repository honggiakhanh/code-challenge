const TOKEN_ICON_BASE =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens'

export function getTokenIconUrl(currency: string): string {
  return `${TOKEN_ICON_BASE}/${currency}.svg`
}
