import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text } from '@scads/uikit'
import { Token } from '@scads/sdk'
import { TokenImage } from 'components/TokenImage'

interface Props {
  title: string
  subtitle: string
  // noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  token: Token
}

const CurrencyInputContainer = styled(Flex)`
  align-items: center;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid transparent;
  border-image: ${({ theme }) => theme.colors.gradients.gold};
  border-image-slice: 1;
`

const CurrencyInputHeader: React.FC<Props> = ({ title, subtitle, setIsChartDisplayed, isChartDisplayed, token }) => {
  return (
    <CurrencyInputContainer>
      <Flex width="100%" alignItems="center" justifyContent="space-around">
        <TokenImage token={token} width={64} height={64}/>
        <Flex flexDirection="column" alignItems="center">
          <Heading as="h2" mb="8px">
            {title}
          </Heading>
          <Flex alignItems="center">
            { subtitle !== null &&  
              <Text color="textSubtle" fontSize="14px">
                {subtitle}
              </Text>
            }
          </Flex>
        </Flex>
      </Flex>
    </CurrencyInputContainer>
  )
}

export default CurrencyInputHeader
