import { useCallback } from 'react'
import { caratBuy, caratRedeem } from 'utils/calls'
import { useCaratContract } from 'hooks/useContract'

const useCaratMint = () => {
  const caratContract = useCaratContract()

  const handleBuy = useCallback(
    async (amount: string) => {
      await caratBuy(caratContract, amount)
    },
    [caratContract],
  )

  const handleRedeem = useCallback(
    async (amount: string) => {
      await caratRedeem(caratContract, amount)
    },
    [caratContract],
  )

  return { caratBuy: handleBuy, caratRedeem: handleRedeem }
}

export default useCaratMint
