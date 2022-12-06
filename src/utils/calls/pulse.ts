import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const circulatePulse = async (pulseContract, stableCoinAddress) => {
  const gasPrice = getGasPrice()
  const tx = await pulseContract.circulate(stableCoinAddress, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}