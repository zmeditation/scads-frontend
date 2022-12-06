import { Token, TokenAmount, CurrencyAmount } from '@scads/sdk'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useCaratTokenContract, useScadsContract, useCaratContract } from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'
import tokens from '../config/constants/tokens'
import useActiveWeb3React from './useActiveWeb3React'
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
  const result = useSingleCallResult(contract, 'calculateBuyAmount', inputs).result
  return useMemo(() => {
    const requireAmount =
      new BigNumber(result?.toString() ?? 0) ?? 0
    return requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined
  }, [token1, result])
}

export function useScadsBuyAmount(tokenAmount: TokenAmount, token1: Token): TokenAmount | null {
  const inputTokenAddress = tokenAmount?.token?.address
  const contract = useScadsContract()

  const value = new BigNumber(tokenAmount?.toFixed(0)).toString()
  const inputs = [value]
  const result = useSingleCallResult(contract, 'calculateBuyAmount', inputs).result
  return useMemo(() => {
    const requireAmount =
      new BigNumber(result?.toString() ?? 0) ?? 0
    return requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined
  }, [token1, result])
}

export function useCaratBuyBackAmount(tokenAmount: TokenAmount, token1: Token): TokenAmount | null {
  const inputTokenAddress = tokenAmount?.token?.address
  const contract = useCaratTokenContract(inputTokenAddress, false)

  const value = new BigNumber(tokenAmount?.toFixed(0)).toString()

  const inputs = [value]
  const result = useSingleCallResult(contract, 'calculateRedeemAmount', inputs).result
  return useMemo(() => {
    const requireAmount =
      new BigNumber(result?.toString() ?? 0).times(DEFAULT_TOKEN_DECIMAL) ?? 0
    return requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined
  }, [token1, result])
}

export function useScadsBuyBackAmount(tokenAmount: TokenAmount, token1: Token): TokenAmount | null {
  const contract = useScadsContract()

  const value = new BigNumber(tokenAmount?.toFixed(0)).toString()

  const inputs = [value]
  const result = useSingleCallResult(contract, 'calculateBuyAmount', inputs).result
  return useMemo(() => {
    const requireAmount =
      new BigNumber(result?.toString() ?? 0).times(DEFAULT_TOKEN_DECIMAL) ?? 0
    return requireAmount ? new TokenAmount(token1, requireAmount.toString()) : undefined
  }, [token1, result])
}

export function useCaratTotalSupply() {
  const contract = useCaratContract();
  const result = useSingleCallResult(contract, 'totalSupply', []).result
  return result;
}

export function useScadsLatestMintInfo() {
  const { account } = useActiveWeb3React()
  const contract = useScadsContract();
  const result = useSingleCallResult(contract, '_lastestMintInfo', [account]).result
  return result;
}

export function useLatestBoughtInfo() {
  const { account } = useActiveWeb3React()
  const contract = useCaratContract();
  const result = useSingleCallResult(contract, 'getLatestCaratMint', [account]).result
  return result;
}

export function useMintedCaratAmount() {
  const { account } = useActiveWeb3React()
  const contract = useCaratContract();
  const result = useSingleCallResult(contract, 'userMintedCaratAmount', [account]).result
  return result;
}