import { Token, TokenAmount } from '@scads/sdk'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useCaratTokenContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import tokens from '../config/constants/tokens'
/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
function getTokenRate(address: string) {
  let rate = new BigNumber(1)
  switch (address) {
    case tokens.carat.address:
      rate = rate.times(1000000)
      break
    case tokens.ethsnacks.address:
      rate = rate.times(100000000)
      break
    case tokens.btcsnacks.address:
      rate = rate.times(100000000)
      break
    default:
      break
  }

  return rate
}
export function useCaratBuyAmount(tokenAmount: TokenAmount, token1: Token): TokenAmount | null {
  const inputTokenAddress = tokenAmount?.token?.address
  const contract = useCaratTokenContract(inputTokenAddress, false)

  const value = new BigNumber(tokenAmount?.toFixed(0)).toString()
  const inputs = [value]
  const { result } = useSingleCallResult(contract, 'calculateBuyAmount', inputs)
  return useMemo(() => {
    const requireAmount =
      new BigNumber(result?.toString() ?? 0).times(DEFAULT_TOKEN_DECIMAL).div(getTokenRate(inputTokenAddress)) ?? 0
    return requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined
  }, [token1, result, inputTokenAddress])
}

export function useCaratBuyBackAmount(tokenAmount: TokenAmount, token1: Token): TokenAmount | null {
  const inputTokenAddress = tokenAmount?.token?.address
  const contract = useCaratTokenContract(inputTokenAddress, false)

  const value = new BigNumber(tokenAmount?.toFixed(0)).toString()

  const inputs = [value]
  const { result } = useSingleCallResult(contract, 'calculateRedeemAmount', inputs)
  return useMemo(() => {
    const requireAmount =
      new BigNumber(result?.toString() ?? 0).times(DEFAULT_TOKEN_DECIMAL).div(getTokenRate(inputTokenAddress)) ?? 0
    return requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined
  }, [token1, result, inputTokenAddress])
}
