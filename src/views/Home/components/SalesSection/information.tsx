import { useCaratPrice } from 'hooks/useBUSDPrice'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@scads/uikit'
import { testnetTokens } from 'config/constants/tokens'
import Timer from '../Timer'
import { usePulseInfo } from './hooks/usePulseInfo'
import usePulseCirculate, { checkPulse } from './hooks/usePulseCirculate'
import PriceInfos from './priceInfos'

const TimerLabelWrapper = styled.div`
  order: 3;
  width: 100%;
  color: white;
  font-size: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    order: 1;
    width: 100%;
  }
`

const StyledLabelValue = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradients.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const InfoDiv = styled.div`
  padding: 30px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 20px;
  margin-bottom: 20px;
`

const SplitDiv = styled.div`
  padding: 20px;
  text-align: center;
  width: 50%;
`

const SplitGradientDiv = styled(SplitDiv)`
  border-left: 1px solid transparent;
  border-image: ${({ theme }) => theme.colors.gradients.gold};
  border-image-slice: 1;
`

const Informations = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 10000)
  })

  function calculateTimeLeft() {
    const nextPulseTime = new Date()
    nextPulseTime.setUTCHours(1, 0, 0)
    let difference = nextPulseTime.getTime() - new Date().getTime()

    if (difference < 0) difference += 12 * 60 * 60 * 1000
    if (difference < 0) difference += 12 * 60 * 60 * 1000

    const remainTime = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }

    return remainTime
  }

  const { nextPulsePartAmount, nextPulseTotalAmount, totalStakedUSD } = usePulseInfo()

  const stableCoin = testnetTokens.busd;
  const startCirculate = async() => {
    try {
        await checkPulse(stableCoin.address);
    } catch (e) {
      console.log(e)
    }
  }

  if(timeLeft.seconds === 0 && timeLeft.minutes === 0 && timeLeft.hours === 0) {
    startCirculate()
  }

  return (
    <>
      <TimerLabelWrapper>
        {/* <InfoDiv>
          <LabelValue
            style={{
              fontSize: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'end',
              marginBottom: '30px',
              color: '#cccccc',
            }}>
            Next Pulse in &nbsp;
            <Timer
              wrapperClassName="custom-timer"
              seconds={timeLeft.seconds}
              minutes={timeLeft.minutes}
              hours={timeLeft.hours}
            />
          </LabelValue>
          <LabelValue style={{color: '#cccccc' }}>Next Pulse Amount is $ {nextPulsePartAmount?.outputAmount?.toSignificant(6)}</LabelValue>
          </InfoDiv> */}
        <InfoDiv style={{ display: 'flex', justifyContent: 'center' }}>
          <SplitDiv>
            <StyledLabelValue>TOTAL LOCKED</StyledLabelValue>
            <StyledLabelValue>$ {nextPulseTotalAmount?.outputAmount?.toSignificant(6)}</StyledLabelValue>
          </SplitDiv>
          <SplitGradientDiv>
            <StyledLabelValue>TVL</StyledLabelValue>
            <StyledLabelValue>$ {totalStakedUSD.toFixed(6)}</StyledLabelValue>
          </SplitGradientDiv>
        </InfoDiv>
        <PriceInfos />
      </TimerLabelWrapper>
    </>
  )
}

export default Informations
