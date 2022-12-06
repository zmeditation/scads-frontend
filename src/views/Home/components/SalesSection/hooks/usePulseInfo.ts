import { useState } from 'react'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade } from '@scads/sdk'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { useTokenBalances, useCurrencyBalances } from 'state/wallet/hooks'
import tokens from 'config/constants/tokens'
import { getPulseAddress } from 'utils/addressHelpers'
import { useCaratBuyBackInfo, tryParseAmount } from 'state/swap/hooks'
import { useCaratBuyAmount, useCaratBuyBackAmount } from 'hooks/useCaratTrade'
import { usePools } from 'state/pools/hooks'
import { useFarmFromPid } from 'state/farms/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'

// from the current swap inputs, compute the best trade and return it.
export function usePulseInfo() {
  const addr = getPulseAddress()

  const relevantTokenBalances = useTokenBalances(addr, [tokens.cake, tokens.carat])

  const scadsBalance = relevantTokenBalances[tokens.cake.address]
  const caratBalance = relevantTokenBalances[tokens.carat.address]

  const caratConvertAmount = new TokenAmount(
    tokens.carat,
    JSBI.divide(caratBalance?.raw ?? JSBI.BigInt(0), JSBI.BigInt(10)),
  )

  const scadsConvertAmount = new TokenAmount(
    tokens.cake,
    JSBI.divide(scadsBalance?.raw ?? JSBI.BigInt(0), JSBI.BigInt(10)),
  )

  const { redeemScadsAmount: redeemPartAmount } = useCaratBuyBackInfo(caratConvertAmount, tokens.cake)

  const { redeemScadsAmount: redeemTotalAmount } = useCaratBuyBackInfo(caratConvertAmount, tokens.cake)
  const pulsePartAmount =
    parseFloat(scadsConvertAmount?.toExact() ?? '0') + parseFloat(redeemPartAmount?.toExact() ?? '0')

  const pulseTotalAmount = parseFloat(scadsBalance?.toExact() ?? '0') + parseFloat(redeemTotalAmount?.toExact() ?? '0')

  const parsedPartAmount = tryParseAmount(pulsePartAmount.toString(), tokens.cake)
  const parsedTotalAmount = tryParseAmount(pulseTotalAmount.toString(), tokens.cake)

  const bestTradePartExactIn = useTradeExactIn(parsedPartAmount, tokens.busd)
  const bestTradeTotalExactIn = useTradeExactIn(parsedTotalAmount, tokens.busd)

  const scadsAmount = tryParseAmount('1', tokens.cake)
  const scadsPrice = useTradeExactIn(scadsAmount, tokens.busd)

  // TVL
  const scadsBusdFarm = useFarmFromPid(1)

  const totalLiquidity = new BigNumber(scadsBusdFarm.lpTotalInQuoteToken).times(scadsBusdFarm.quoteTokenPriceBusd)

  const { pools } = usePools()

  const caratPoolAmount = useCaratBuyBackAmount(
    new TokenAmount(tokens.carat, JSBI.BigInt(pools[1]?.totalStaked.gt(0) ? pools[1]?.totalStaked : 0)),
    tokens.cake,
  )

  const totalStakedUSD =
    (getBalanceNumber(
      pools[0].totalStaked.gt(0) ? pools[0].totalStaked : new BigNumber(0),
      pools[0].stakingToken.decimals,
    ) +
      parseFloat(caratPoolAmount?.toExact() ?? '0')) *
      parseFloat(scadsPrice?.outputAmount?.toExact() ?? '0') +
    (totalLiquidity.gt(0) ? totalLiquidity.toNumber() : 0)

  return {
    nextPulsePartAmount: bestTradePartExactIn,
    nextPulseTotalAmount: bestTradeTotalExactIn,
    totalStakedUSD,
  }
}
