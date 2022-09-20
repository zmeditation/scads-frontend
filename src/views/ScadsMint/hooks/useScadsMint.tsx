import { useCallback } from 'react'
import { scadsMint } from 'utils/calls'
import { useScadsContract } from 'hooks/useContract'

const useScadsMint = () => {
  const scadsContract = useScadsContract()

  const handleMint = useCallback(
    async (amount: string, token: string) => {
      await scadsMint(scadsContract, amount, token)
    },
    [scadsContract],
  )

  return { scadsMint: handleMint }
}

export default useScadsMint
