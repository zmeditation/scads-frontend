import React from 'react'
import { Flex, Button, Heading } from '@scads/uikit'
import { useWeb3React } from '@web3-react/core'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import PriceInfos from './priceInfos'

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
}

const SalesSection: React.FC<SalesSectionProps> = (props) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { headingText, bodyText, reverse } = props

  const headingTranslatedText = t(headingText)
  const bodyTranslatedText = t(bodyText)

  return (
    <Flex flexDirection="column">
      <Flex
        flexDirection={['column-reverse', null, null, reverse ? 'row-reverse' : 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <Flex
          flexDirection="column"
          flex="1"
          ml={[null, null, null, reverse && '64px']}
          mr={[null, null, null, !reverse && '64px']}
          alignSelf={['flex-start', null, null, 'center']}
        >
          <Heading as="h1" scale="xxl" color="overlay" mb="24px">
            {headingTranslatedText}
          </Heading>
          <Heading scale="md" color="overlay">
            {bodyTranslatedText}
          </Heading>
          <Flex flexDirection="row" flex="1" alignSelf={['flex-start', null, null, null]} mt="8px">
            {!account && <ConnectWalletButton mr="8px"/>}
            <RouterLink to="/mint/scads">
              <Button color="primary">{t('Mint')}</Button>
            </RouterLink>
          </Flex>
        </Flex>
        <Flex
          height={['auto', null, null, '100%']}
          width={['100%', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}>
          <PriceInfos />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SalesSection
