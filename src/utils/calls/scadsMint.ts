import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const scadsMint = async (scadsContract, amount, token) => {
  const gasPrice = getGasPrice()
  console.log(amount)
  console.log(token)
  const tx = await scadsContract.scadsMint(amount, token, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}
