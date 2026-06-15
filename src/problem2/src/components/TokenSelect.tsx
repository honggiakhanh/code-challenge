import type { Token } from '@/lib/tokens'
import { TokenIcon } from '@/components/TokenIcon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TokenSelectProps = {
  tokens: Token[]
  value: string
  onChange: (currency: string) => void
  disabled?: boolean
}

export function TokenSelect({
  tokens,
  value,
  onChange,
  disabled,
}: TokenSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="min-w-[132px] bg-background/80">
        <SelectValue placeholder="Token" />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.currency} value={token.currency}>
            <span className="flex items-center gap-2">
              <TokenIcon currency={token.currency} />
              <span>{token.currency}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
