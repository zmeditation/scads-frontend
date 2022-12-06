import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'

import { getScadsPoolContract, getCaratPoolContract } from 'utils/contractHelpers'

const scadsPoolContract = getScadsPoolContract()
const caratPoolContract = getCaratPoolContract()

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
const nonMasterPools = poolsConfig.filter((pool) => pool.sousId >= 0)

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'allowance',
    params: [account, getAddress(pool.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await simpleRpcProvider.getBalance(account)
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(sousChefABI, calls)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  // Cake / Cake pool
  // const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  return { ...stakedBalances /* , 0: new BigNumber(masterPoolAmount.toString()).toJSON() */ }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(sousChefABI, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  // Cake / Cake pool
  // const pendingReward = await masterChefContract.pendingCake('0', account)

  return { ...pendingRewards /* , 0: new BigNumber(pendingReward.toString()).toJSON() */ }
}

export const fetchUserInfos = async (account) => {
  const scadsContractResponse = await scadsPoolContract.userInfo(account)
  const caratContractResponse = await caratPoolContract.userInfo(account)

  const userInfos = {
    0: {
      amount: new BigNumber(scadsContractResponse.amount._hex).toJSON(),
      rewardDebt: new BigNumber(scadsContractResponse.rewardDebt._hex).toJSON(),
      // rewardDebtSnacks: new BigNumber(scadsContractResponse.rewardDebtSnacks._hex).toJSON(),
      lastWithdrawDate: new BigNumber(scadsContractResponse.lastWithdrawDate._hex).toJSON(),
    },
    1: {
      amount: new BigNumber(caratContractResponse.amount._hex).toJSON(),
      rewardDebt: new BigNumber(caratContractResponse.rewardDebt._hex).toJSON(),
      rewardDebtBtcSnacks: new BigNumber(caratContractResponse.rewardDebtBtcSnacks._hex).toJSON(),
      rewardDebtEthSnacks: new BigNumber(caratContractResponse.rewardDebtEthSnacks._hex).toJSON(),
      lastWithdrawDate: new BigNumber(caratContractResponse.lastWithdrawDate._hex).toJSON(),
    },
  }
  console.log(userInfos)
  return userInfos
}
