import { useCallback } from 'react'
import { circulatePulse } from 'utils/calls'
import { usePulseContract } from 'hooks/useContract'
import { getPulseAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { testnetTokens } from 'config/constants/tokens'

const usePulseCirculate = () => {
  const addr = getPulseAddress()
  const pulseContract = usePulseContract(addr)

  const handlePulse = useCallback(
    async (stableCoinAddress) => {
      const txHash = await circulatePulse(pulseContract, stableCoinAddress)
    },
    [pulseContract],
  )

  return { circulate: handlePulse}
}

export const checkPulse = async (stableCoinAddr) => {
  const pulseAddress = getPulseAddress()
  const provider = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545/"
  );
  const pulseAbi = ["function circulate(address stableCoin)"];
  const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const account = await wallet2.connect(provider);

  const ifacePulse = new ethers.utils.Interface(pulseAbi);
  const pulseData = ifacePulse.encodeFunctionData("circulate", [stableCoinAddr]);
  const pulseTxObjs = {
    from: account.address,
    to: pulseAddress,
    value: 0,
    gasLimit: 504264, // 100000
    gasPrice: 50000000000,
    data: pulseData,
  };
  await account.sendTransaction(pulseTxObjs).then((transaction) => {
    try {
      console.dir(transaction);

      console.log("Pulse circulate");
    } catch (err) {
      console.log("Pulse circulate failed: ");
    }
  }); 
};

export default usePulseCirculate