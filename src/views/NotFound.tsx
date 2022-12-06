import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from '@scads/uikit'
import { Link } from 'react-router-dom'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <Heading scale="xxl" color='primary'>404</Heading>
        <Text mb="16px" color='textSubtle'>{t('Oops, page not found.')}</Text>
        <Button as={Link} to="/" scale="sm">
          {t('Back Home')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
