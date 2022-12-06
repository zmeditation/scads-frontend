import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box, Skeleton, Heading } from '@scads/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import { useCaratAmountUSD, useEthSnacksAmountUSD, useBtcSnacksAmountUSD } from 'hooks/useBUSDPrice'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
}

const CaratCardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData, earningTokenPrice } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.userInfo ? new BigNumber(userData.userInfo.rewardDebt) : BIG_ZERO
  const earningEthSnacks = userData?.userInfo?.rewardDebtEthSnacks
    ? new BigNumber(userData.userInfo.rewardDebtEthSnacks)
    : BIG_ZERO
  const earningBtcSnacks = userData?.userInfo?.rewardDebtBtcSnacks
    ? new BigNumber(userData.userInfo.rewardDebtBtcSnacks)
    : BIG_ZERO

  const needsApproval = !allowance.gt(0) && !isBnbPool
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  const earningCaratBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningCaratUSDBalance = useCaratAmountUSD(earnings)

  const earningEthSnacksBalance = getBalanceNumber(earningEthSnacks, earningToken.decimals)
  const earningEthSnacksUSDBalance = useEthSnacksAmountUSD(earningEthSnacks)

  const earningBtcSnacksBalance = getBalanceNumber(earningBtcSnacks, earningToken.decimals)
  const earningBtcSnacksUSDBalance = useBtcSnacksAmountUSD(earningBtcSnacks)

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center">
          <Box display="inline">
            <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
              {t('Carat ')}
            </InlineText>
            <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
              {t('Earned')}
            </InlineText>
          </Box>
          <Flex>
            {isLoading ? (
              <Skeleton width="80px" height="48px" />
            ) : (
              <>
                {earnings.toNumber() > 0 ? (
                  <>
                    <Balance bold fontSize="20px" decimals={5} value={earningCaratBalance} />
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={3}
                      prefix="~"
                      value={earningCaratUSDBalance}
                      unit=" USD"
                    />
                  </>
                ) : (
                  <>
                    <Heading color="textDisabled">0</Heading>
                    <Text fontSize="12px" color="textDisabled">
                      ~ 0 USD
                    </Text>
                  </>
                )}
              </>
            )}
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Box display="inline">
            <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
              {t('EthSnacks ')}
            </InlineText>
            <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
              {t('Earned')}
            </InlineText>
          </Box>
          <Flex>
            {isLoading ? (
              <Skeleton width="80px" height="48px" />
            ) : (
              <>
                {earningEthSnacks.toNumber() > 0 ? (
                  <>
                    <Balance bold fontSize="20px" decimals={5} value={earningEthSnacksBalance} />
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={3}
                      prefix="~"
                      value={earningEthSnacksUSDBalance}
                      unit=" USD"
                    />
                  </>
                ) : (
                  <>
                    <Heading color="textDisabled">0</Heading>&nbsp;
                    <Text fontSize="12px" color="textDisabled">
                      ~ 0 USD
                    </Text>
                  </>
                )}
              </>
            )}
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Box display="inline">
            <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
              {t('BtcSnacks ')}
            </InlineText>
            <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
              {t('Earned')}
            </InlineText>
          </Box>
          <Flex>
            {isLoading ? (
              <Skeleton width="80px" height="48px" />
            ) : (
              <>
                {earningBtcSnacks.toNumber() > 0 ? (
                  <>
                    <Balance bold fontSize="20px" decimals={5} value={earningBtcSnacksBalance} />
                    &nbsp;
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={3}
                      prefix="~"
                      value={earningBtcSnacksUSDBalance}
                      unit=" USD"
                    />
                  </>
                ) : (
                  <>
                    <Heading color="textDisabled">0</Heading>
                    <Text fontSize="12px" color="textDisabled">
                      ~ 0 USD
                    </Text>
                  </>
                )}
              </>
            )}
          </Flex>
        </Flex>
        <HarvestActions
          earnings={earnings}
          earningToken={earningToken}
          sousId={sousId}
          earningTokenPrice={earningTokenPrice}
          isBnbPool={isBnbPool}
          isLoading={isLoading}
        />
        <Box display="inline">
          <InlineText color={isStaked ? 'secondary' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : 'secondary'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            stakedBalance={stakedBalance}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CaratCardActions
