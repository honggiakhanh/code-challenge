import { useEffect, useMemo, useState } from 'react'
import {
  buildPriceMap,
  getExchangeRate,
  normalizePrices,
  type PriceRow,
  type Token,
} from '@/lib/tokens'

const PRICES_URL = 'https://interview.switcheo.com/prices.json'

type UsePricesResult = {
  tokens: Token[]
  prices: Record<string, number>
  loading: boolean
  error: string | null
  getRate: (from: string, to: string) => number | null
}

export function usePrices(): UsePricesResult {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPrices() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(PRICES_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Failed to fetch prices (${response.status})`)
        }

        const data = (await response.json()) as PriceRow[]
        setTokens(normalizePrices(data))
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        setError(err instanceof Error ? err.message : 'Failed to load prices')
        setTokens([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadPrices()

    return () => controller.abort()
  }, [])

  const prices = useMemo(() => buildPriceMap(tokens), [tokens])

  const getRate = useMemo(
    () => (from: string, to: string) => getExchangeRate(from, to, prices),
    [prices],
  )

  return { tokens, prices, loading, error, getRate }
}
