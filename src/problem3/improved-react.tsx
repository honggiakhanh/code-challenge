import { useMemo } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // messy code use blockchain but type miss it
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

// pure lookup map — no switch, no fn recreating each render
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const DEFAULT_PRIORITY = -99;

// module scope — stable ref, not new fn every render, correctly typed with string instead of any
function getPriority(blockchain: string): number {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;
}

type Props = BoxProps; // empty `extends BoxProps {}` add nothing — alias enough

const WalletPage = ({ children: _children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // one memo pipeline: filter → sort → format → usd
  // messy code: double map, dead formattedBalances, rows read balance.formatted that not exist
  const formattedBalances = useMemo((): FormattedWalletBalance[] => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        // fix lhsPriority typo (undefined → all filtered out)
        // fix inverted logic: keep supported chain + positive amount, not zero/negative
        return priority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .map((balance) => ({
        ...balance,
        priority: getPriority(balance.blockchain), // cache priority once — sort no repeat call
      }))
      .sort((lhs, rhs) => rhs.priority - lhs.priority) // numeric compare, ties return 0 — messy sort return undefined on tie
      .map(({ priority: _priority, ...balance }) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        usdValue: (prices[balance.currency] ?? 0) * balance.amount, // guard missing price — no NaN
      }));
  }, [balances, prices]); // prices belong here (usd calc). messy sortedBalances memo list prices but never use — false rerun

  return (
    <div {...rest}>
      {formattedBalances.map((balance) => (
        <WalletRow
          key={balance.currency} // stable key with currency, not with index
          className={classes.row}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
