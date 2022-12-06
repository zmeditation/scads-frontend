import React from 'react'
import styled from 'styled-components'
import { Button, Text, Box, Heading, Flex } from '@scads/uikit'
import { utils, BigNumber } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { AutoColumn } from '../../components/Layout/Column'
import { Wrapper } from './components/styleds'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import { useLatestBoughtData, useUserMintedCaratAmount } from '../../state/swap/hooks'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import useCaratMint from './hooks/useCaratMint'
import { FooterCard } from '../../components/Card'

export default function CaratClaimCard() {
  const { t } = useTranslation()
  const userMintedCaratAmount = useUserMintedCaratAmount();
  const latestBoughtData = useLatestBoughtData();
  const rate = BigNumber.from(6).div(1000000);
  const latestBoughtMintAmount = latestBoughtData && latestBoughtData[0];
  const latestBoughtMintDate = latestBoughtData && parseInt(latestBoughtData[1]?.toString());
  
  const currentTime = Math.floor(new Date().getTime()/1000);
  let diffTime = Math.floor((latestBoughtMintDate)/60);
  let rewardAmount = BigNumber.from(0);
  
  if(latestBoughtMintAmount!==undefined && !latestBoughtMintAmount.eq(BigNumber.from(0))){
    rewardAmount = latestBoughtMintAmount.mul(diffTime).mul(6).div(1000000);
  } else {
    diffTime = 0;
  }

  const remainTime = {
    days: Math.floor((diffTime / (60 * 60)) % 24),
    hours: Math.floor((diffTime / 60) % 60),
    minutes: Math.floor((diffTime) % 60)
  }

  const { account } = useActiveWeb3React()
  const { caratClaim } = useCaratMint()
  const handleClaim = async () => {
    await caratClaim();
  }
  return (
    <StyledSwapContainer $isChartExpanded={false}>
      <StyledInputCurrencyWrapper>
        <AppBody>
          <CurrencyInputHeader title={t('Carat Claim')} subtitle={t('Claim Carat in an instant')} token={tokens.carat} />
          <Wrapper id="swap-page">
            <AutoColumn>
              <Flex justifyContent="center">
                <Heading as="h2" mb="4px">Scads In Mint:</Heading>
                <Text color="textSubtle">
                  &nbsp;{latestBoughtMintAmount ? parseFloat(utils.formatEther(latestBoughtMintAmount?.toString())).toFixed(2) : 0} Scads
                </Text>
              </Flex>
              <Flex justifyContent="center">
                <Heading as="h2" mb="4px">Time:</Heading>
                <Text color="textSubtle">
                  &nbsp;{remainTime.days && remainTime.days >= 0 ? remainTime.days : 0} Days {remainTime.hours && remainTime.hours >= 0 ? remainTime.hours : 0} Hours {remainTime.minutes && remainTime.minutes >= 0 ? remainTime.minutes : 0} Minutes
                </Text>
              </Flex>
              <Flex justifyContent="center">
                <Heading as="h2" mb="4px">Carat Minted:</Heading>
                <Text color="textSubtle">
                  &nbsp;{userMintedCaratAmount && rewardAmount.gte(BigNumber.from('0')) ? parseFloat(utils.formatEther(userMintedCaratAmount.toString())) : 0} Carat
                </Text>
              </Flex>
              <Flex justifyContent="center">
                <Heading as="h2" mb="4px">Reward Amount:</Heading>
                <Text color="textSubtle">
                  &nbsp;{rewardAmount.gte(BigNumber.from('0')) ? parseFloat(utils.formatEther(rewardAmount.toString())) : 0} Carat
                </Text>
              </Flex>
            </AutoColumn>
            <Box mt="1rem">
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) :  (
              <Button
                variant="primary"
                id="swap-button"
                width="100%"
                onClick={() => {
                  handleClaim()
                }}>
                {t('Claim')}
                </Button>
              )}
            </Box>
          </Wrapper>
          <FooterCard>
            <Text fontSize="14px" style={{ textAlign: 'center' }}>
              <span role="img" aria-label="pancake-icon">
                🥞
              </span>{' '}
              {t('You can only claim WHOLE carat not partial.')}
            </Text>
          </FooterCard>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </StyledSwapContainer>
  )
}
