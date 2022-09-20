// import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const scadsMint = async (scadsContract, amount, token) => {
  const gasPrice = getGasPrice()
  const tx = await scadsContract.scadsMint(amount, token, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}
