import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import {utils} from 'ethers'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const caratBuy = async (caratContract, amount) => {
  const gasPrice = getGasPrice()

  const value = amount
  const tx = await caratContract.caratMint(value, { ...options, gasPrice })
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

export const caratClaim = async (caratContract) => {
  const gasPrice = getGasPrice()
  const tx = await caratContract.claimRewardCarat({ ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

