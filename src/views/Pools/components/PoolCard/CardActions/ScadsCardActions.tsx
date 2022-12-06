import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box, Skeleton, Heading } from '@scads/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import { useCaratAmountUSD } from 'hooks/useBUSDPrice'
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

const ScadsCardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData, earningTokenPrice } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningCarat = userData?.userInfo?.rewardDebtCarat ? new BigNumber(userData.userInfo.rewardDebtCarat) : BIG_ZERO
  const needsApproval = !allowance.gt(0) && !isBnbPool
  const isStaked = stakedBalance.gt(0)
  const isLoading = !userData

  const earningScadsBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningScadsUSDBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const earningCaratBalance = getBalanceNumber(earningCarat, earningToken.decimals)
  const earningCaratUSDBalance = useCaratAmountUSD(earningCarat)

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center">
          <Box display="inline">
            <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
              {t('AVO ')}
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
                    <Balance bold fontSize="20px" decimals={5} value={earningScadsBalance} />
                    &nbsp;
                    {earningTokenPrice > 0 && (
                      <Balance
                        display="inline"
                        fontSize="12px"
                        color="textSubtle"
                        decimals={3}
                        prefix="~"
                        value={earningScadsUSDBalance}
                        unit=" USD"
                      />
                    )}
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

export default ScadsCardActions
