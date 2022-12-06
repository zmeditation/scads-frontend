import { useCallback } from 'react'
import { scadsMint } from 'utils/calls'
import { useScadsContract } from 'hooks/useContract'
import {utils} from 'ethers'

const useScadsMint = () => {
  const scadsContract = useScadsContract()

  const handleMint = useCallback(
    async (amount: string, token: string) => {
      const txHash = await scadsMint(scadsContract, utils.parseEther(amount), token)
    },
    [scadsContract],
  )

  return { scadsMint: handleMint }
}

export default useScadsMint
