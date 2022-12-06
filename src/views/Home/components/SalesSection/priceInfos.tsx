import { useCaratPrice } from 'hooks/useBUSDPrice'
import React from 'react'
import { Flex } from '@scads/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { usePulseInfo } from './hooks/usePulseInfo'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from '../StatCardContent'

const BorderDiv = styled.div`
  display: flex;
  justifyContent: center;
  padding: 30px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 20px;
  margin-right: 16px;
  margin-bottom: 16px;
`

const PriceInfos = () => {
  const { theme } = useTheme()

  const { t } = useTranslation()

  const { caratPrice, ethsnacksPrice, btcsnacksPrice } = useCaratPrice()

  const { nextPulsePartAmount, nextPulseTotalAmount, totalStakedUSD } = usePulseInfo()

  return (
    <>
      <Flex flexDirection={['column', null, null, 'row']} justifyContent="center" marginTop="20px">
        <BorderDiv>
          <StatCardContent
            headingText="TOTAL LOCKED"
            bodyText={t('$%nextPulse%', { nextPulse: nextPulseTotalAmount?.outputAmount?.toSignificant(6) || "" })}
            highlightColor={theme.colors.secondary}
          />
        </BorderDiv>
        <BorderDiv>
          <StatCardContent
            headingText="TVL"
            bodyText={t('$%totalStakedUSD%', { totalStakedUSD: totalStakedUSD.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </BorderDiv>
        <BorderDiv>
          <StatCardContent
            headingText="Carat Price"
            bodyText={t('$%carat%', { carat: caratPrice.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </BorderDiv>
        {/* <IconCard icon={<div />} >
          <StatCardContent
            headingText="Carat Price"
            bodyText={t('$%carat%', { carat: caratPrice.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard icon={<div />} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText="EthSnacks Price"
            bodyText={t('$%carat%', { carat: ethsnacksPrice.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard icon={<div />} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText="BtcSnacks Price"
            bodyText={t('$%carat%', { carat: btcsnacksPrice.toFixed(6).toString() })}
            highlightColor={theme.colors.secondary}
          />
        </IconCard> */}
      </Flex>
    </>
  )
}

export default PriceInfos
