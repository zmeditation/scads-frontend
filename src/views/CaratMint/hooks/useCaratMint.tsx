import { useCallback } from 'react'
import { caratBuy, caratRedeem, caratClaim } from 'utils/calls'
import { useCaratContract } from 'hooks/useContract'

const useCaratMint = () => {
  const caratContract = useCaratContract()

  const handleBuy = useCallback(
    async (amount: string) => {
      const txHash = await caratBuy(caratContract, amount)
    },
    [caratContract],
  )

  const handleRedeem = useCallback(
    async (amount: string) => {
      const txHash = await caratRedeem(caratContract, amount)
    },
    [caratContract],
  )

  const handleClaim = useCallback(
    async () => {
      const txHash = await caratClaim(caratContract)
    },
    [caratContract],
  )

  return { caratBuy: handleBuy, caratRedeem: handleRedeem, caratClaim: handleClaim }
}

export default useCaratMint
