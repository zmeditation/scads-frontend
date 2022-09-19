import { useCallback } from 'react'
import { caratBuy, caratRedeem } from 'utils/calls'
import { useCaratContract } from 'hooks/useContract'

const useCaratMint = () => {
  const caratContract = useCaratContract()

  const handleBuy = useCallback(
    async (amount: string) => {
      const txHash = await caratBuy(caratContract, amount)
      console.info(txHash)
    },
    [caratContract],
  )

  const handleRedeem = useCallback(
    async (amount: string) => {
      const txHash = await caratRedeem(caratContract, amount)
    },
    [caratContract],
  )

  return { caratBuy: handleBuy, caratRedeem: handleRedeem }
}

export default useCaratMint
