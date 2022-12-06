import React from 'react'
import styled from 'styled-components'
import { Text, Flex, IconButton } from '@scads/uikit'
import { RouteComponentProps } from 'react-router-dom'
import Page from '../Page'
import CaratBuyCard from './caratBuyCard'
import CaratClaimCard from './caratClaimCard'
import CaratBuyBackCard from './caratBuyBackCard'

const StyledFlex = styled(Flex)`
  flex-direction: row;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`

export default function CaratMint({ history }: RouteComponentProps) {
  return (
    <Page>
      <Flex width="100%" justifyContent="center" position="relative">
        <StyledFlex>
          <CaratBuyCard />
          <CaratClaimCard />
          <CaratBuyBackCard />
        </StyledFlex>
      </Flex>
    </Page>
  )
}
