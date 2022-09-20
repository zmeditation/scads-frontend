import React from 'react'
import styled from 'styled-components'
import { Flex } from '@scads/uikit'
// import { RouteComponentProps } from 'react-router-dom'
import Page from '../Page'
import CaratBuyCard from './caratBuyCard'
import CaratBuyBackCard from './caratBuyBackCard'

const StyledFlex = styled(Flex)`
  flex-direction: row;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`

export default function CaratMint() {
  return (
    <Page>
      <Flex width="100%" justifyContent="center" position="relative">
        <StyledFlex>
          <CaratBuyCard />
          <CaratBuyBackCard />
        </StyledFlex>
      </Flex>
    </Page>
  )
}
