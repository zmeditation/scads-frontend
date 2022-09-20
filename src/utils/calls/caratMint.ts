import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT } from 'config'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const caratBuy = async (caratContract, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).toString()

  const tx = await caratContract.buy(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const caratRedeem = async (caratContract, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).toString()

  const tx = await caratContract.redeem(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}
