import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getTokenIconUrl } from '@/lib/token-icons'

type TokenIconProps = {
  currency: string
  className?: string
}

export function TokenIcon({ currency, className }: TokenIconProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground',
          className,
        )}
      >
        {currency.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    <img
      src={getTokenIconUrl(currency)}
      alt=""
      className={cn('size-6 shrink-0 rounded-full', className)}
      onError={() => setFailed(true)}
    />
  )
}
