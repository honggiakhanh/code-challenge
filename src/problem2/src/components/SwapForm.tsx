import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowDownUp, CheckCircle2, Loader2 } from 'lucide-react'
import { usePrices } from '@/hook/usePrices'
import { TokenSelect } from '@/components/TokenSelect'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { formatAmount, formatUsd, parseAmount } from '@/lib/format'
import { cn } from '@/lib/utils'

function findDefaultTokens(currencies: string[]) {
  const preferredFrom = ['ETH', 'ATOM', 'WBTC']
  const preferredTo = ['USDC', 'USD', 'BUSD']

  const from =
    preferredFrom.find((symbol) => currencies.includes(symbol)) ?? currencies[0]
  const to =
    preferredTo.find(
      (symbol) => currencies.includes(symbol) && symbol !== from,
    ) ??
    currencies.find((symbol) => symbol !== from) ??
    from

  return { from, to }
}

type SwapFieldProps = {
  label: string
  amount: string
  onAmountChange?: (value: string) => void
  token: string
  tokens: ReturnType<typeof usePrices>['tokens']
  onTokenChange: (currency: string) => void
  usdValue: number | null
  amountReadOnly?: boolean
  error?: string
}

function SwapField({
  label,
  amount,
  onAmountChange,
  token,
  tokens,
  onTokenChange,
  usdValue,
  amountReadOnly,
  error,
}: SwapFieldProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </Label>
        {usdValue != null && (
          <span className="text-xs text-muted-foreground">
            ≈ {formatUsd(usdValue)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={
            onAmountChange
              ? (event) => onAmountChange(event.target.value)
              : undefined
          }
          readOnly={amountReadOnly}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-11 flex-1 rounded-lg border border-border/60 bg-background/80 px-3 text-2xl font-semibold',
            amountReadOnly && 'cursor-default',
          )}
        />
        <TokenSelect
          tokens={tokens}
          value={token}
          onChange={onTokenChange}
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function SwapForm() {
  const { tokens, prices, loading, error, getRate } = usePrices()
  const [fromToken, setFromToken] = useState('')
  const [toToken, setToToken] = useState('')
  const [fromAmount, setFromAmount] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const CONFIRM_LOADING_MS = 1000
  const CONFIRM_DISMISS_MS = 4000

  useEffect(() => {
    if (!confirming) {
      return
    }

    const timer = window.setTimeout(() => {
      setConfirming(false)
      setSubmitted(true)
    }, CONFIRM_LOADING_MS)

    return () => window.clearTimeout(timer)
  }, [confirming])

  useEffect(() => {
    if (!submitted) {
      return
    }

    const timer = window.setTimeout(() => {
      setSubmitted(false)
    }, CONFIRM_DISMISS_MS)

    return () => window.clearTimeout(timer)
  }, [submitted])

  useEffect(() => {
    if (tokens.length === 0 || (fromToken && toToken)) {
      return
    }

    const currencies = tokens.map((token) => token.currency)
    const defaults = findDefaultTokens(currencies)
    setFromToken(defaults.from)
    setToToken(defaults.to)
  }, [tokens, fromToken, toToken])

  const parsedAmount = useMemo(() => parseAmount(fromAmount), [fromAmount])
  const rate = fromToken && toToken ? getRate(fromToken, toToken) : null

  const toAmount = useMemo(() => {
    if (parsedAmount == null || rate == null) {
      return ''
    }

    return formatAmount(parsedAmount * rate)
  }, [parsedAmount, rate])

  const fromUsd =
    parsedAmount != null && prices[fromToken] != null
      ? parsedAmount * prices[fromToken]
      : null

  const toUsd =
    parsedAmount != null && rate != null && prices[toToken] != null
      ? parsedAmount * rate * prices[toToken]
      : null

  const validationError = useMemo(() => {
    if (!fromAmount.trim()) {
      return 'Enter an amount to swap.'
    }

    if (parsedAmount == null) {
      return 'Amount must be a valid number.'
    }

    if (parsedAmount <= 0) {
      return 'Amount must be greater than zero.'
    }

    if (fromToken === toToken) {
      return 'Choose two different tokens.'
    }

    if (rate == null) {
      return 'Exchange rate unavailable for this pair.'
    }

    return null
  }, [fromAmount, parsedAmount, fromToken, toToken, rate])

  const canSubmit = !loading && !error && validationError == null && !confirming

  function resetConfirmState() {
    setConfirming(false)
    setSubmitted(false)
  }

  function handleFlip() {
    setFromToken(toToken)
    setToToken(fromToken)
    resetConfirmState()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || confirming) {
      return
    }

    setSubmitted(false)
    setConfirming(true)
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur">
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-md">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Swap</CardTitle>
        <CardDescription>
          Trade tokens instantly at live market rates.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <SwapField
            label="You pay"
            amount={fromAmount}
            onAmountChange={(value) => {
              setFromAmount(value)
              resetConfirmState()
            }}
            token={fromToken}
            tokens={tokens}
            onTokenChange={(currency) => {
              setFromToken(currency)
              resetConfirmState()
            }}
            usdValue={fromUsd}
            error={fromAmount ? validationError ?? undefined : undefined}
          />

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full border-border/80 bg-background shadow-sm"
              onClick={handleFlip}
              aria-label="Flip tokens"
            >
              <ArrowDownUp className="size-4" />
            </Button>
          </div>

          <SwapField
            label="You receive"
            amount={toAmount}
            token={toToken}
            tokens={tokens}
            onTokenChange={(currency) => {
              setToToken(currency)
              resetConfirmState()
            }}
            usdValue={toUsd}
            amountReadOnly
          />

          {rate != null && fromToken && toToken && (
            <p className="px-1 text-center text-xs text-muted-foreground">
              1 {fromToken} ≈ {formatAmount(rate)} {toToken}
            </p>
          )}

          <Button
            type="submit"
            className="h-11 w-full text-sm font-semibold"
            disabled={!canSubmit || confirming}
          >
            {confirming ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Confirming swap...
              </>
            ) : (
              'Confirm swap'
            )}
          </Button>

          {submitted && canSubmit && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10">
              <CheckCircle2 className="text-emerald-500" />
              <AlertDescription className="text-emerald-700 dark:text-emerald-300">
                Swap confirmed: {fromAmount} {fromToken} → {toAmount} {toToken}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
