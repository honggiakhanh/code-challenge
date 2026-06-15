import type { Token } from '@/lib/tokens'
import { TokenIcon } from '@/components/TokenIcon'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { InputGroupAddon } from '@/components/ui/input-group'

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
  const currencies = tokens.map((token) => token.currency)

  return (
    <Combobox
      items={currencies}
      value={value || null}
      onValueChange={(currency) => {
        if (currency) {
          onChange(currency)
        }
      }}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder="Token"
        disabled={disabled}
        className="h-11 min-w-[160px] bg-background/80"
      >
        {value ? (
          <InputGroupAddon>
            <TokenIcon currency={value} />
          </InputGroupAddon>
        ) : null}
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No token found.</ComboboxEmpty>
        <ComboboxList className="max-h-60">
          {(currency) => (
            <ComboboxItem key={currency} value={currency}>
              <span className="flex items-center gap-2">
                <TokenIcon currency={currency} />
                <span>{currency}</span>
              </span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
