export type PriceRow = {
  currency: string
  date: string
  price: number
}

export type Token = {
  currency: string
  price: number
  date: string
}

export function normalizePrices(rows: PriceRow[]): Token[] {
  const latestByCurrency = new Map<string, Token>()

  for (const row of rows) {
    const existing = latestByCurrency.get(row.currency)
    if (!existing || new Date(row.date) > new Date(existing.date)) {
      latestByCurrency.set(row.currency, {
        currency: row.currency,
        price: row.price,
        date: row.date,
      })
    }
  }

  return Array.from(latestByCurrency.values()).sort((a, b) =>
    a.currency.localeCompare(b.currency),
  )
}

export function buildPriceMap(tokens: Token[]): Record<string, number> {
  return Object.fromEntries(tokens.map((token) => [token.currency, token.price]))
}

export function getExchangeRate(
  from: string,
  to: string,
  prices: Record<string, number>,
): number | null {
  const fromPrice = prices[from]
  const toPrice = prices[to]

  if (fromPrice == null || toPrice == null || toPrice === 0) {
    return null
  }

  return fromPrice / toPrice
}
