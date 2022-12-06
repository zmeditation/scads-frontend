import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade, TokenAmount } from '@scads/sdk'
import { Button, Text, ArrowDownIcon, Box, useModal, Flex, IconButton, ArrowUpDownIcon } from '@scads/uikit'
import { ethers, utils } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import Column, { AutoColumn } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { Field } from '../../state/swap/actions'
import { useCaratBuyInfo, useScadsBuyInfo } from '../../state/swap/hooks'
import CircleLoader from '../../components/Loader/CircleLoader'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import useCaratMint from './hooks/useCaratMint'
import { FooterCard } from '../../components/Card'

export default function CaratBuyCard() {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()
  const [amountOutput, setAmountOutput] = useState<string>()
  const [amountInput, setAmountInput] = useState<any>()

  const parsedCaratTokenAmount = new TokenAmount(
    tokens.carat,
    amountOutput ? JSBI.multiply(JSBI.BigInt(utils.parseEther(amountOutput)), JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)) : '0',
  )

  const parsedScadsTokenAmount = new TokenAmount(
    tokens.cake,
    amountInput ? JSBI.multiply(JSBI.BigInt(utils.parseEther(amountInput)), JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)) : '0',
  )

  const {
    currencyBalances,
    requiredScadsAmount,
    inputError: swapInputError,
  } = useCaratBuyInfo(parsedCaratTokenAmount, tokens.cake)
  const scadsBalance = currencyBalances[Field.OUTPUT]?.toSignificant()
  const {
    requiredCaratAmount
  } = useScadsBuyInfo(parsedScadsTokenAmount, tokens.carat)

  const isValid = !swapInputError

  const handleAmountInput = useCallback((value: string) => {
    setAmountInput(value) 
    setAmountOutput('0.0')
  }, [])

  const handleAmountOutput = useCallback((value: string) => {
    setAmountInput('0.0') 
    setAmountOutput(value)
  }, [])

  const handleMaxInput = () => {
    setAmountInput(scadsBalance) 
    setAmountOutput('0.0')
  }

  const requiredScadsAmountInput = new TokenAmount(
    tokens.cake,
    amountInput !== '0.0' && amountInput ? JSBI.multiply(JSBI.BigInt(parseInt(amountInput)), JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)) : '0',
  )
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(amountInput === '0.0' ? requiredScadsAmount : requiredScadsAmountInput, tokens.carat.address)
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const { caratBuy } = useCaratMint()
  const handleSwap = async () => {
    if(amountOutput === '0.0'){
      const res = utils.parseEther(requiredCaratAmount?.toExact())
      await caratBuy(res.toString())
    }else {
      const res = utils.parseEther(amountOutput)
      await caratBuy(res.toString())
    }
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    approval === ApprovalState.NOT_APPROVED ||
    approval === ApprovalState.PENDING ||
    (approvalSubmitted && approval === ApprovalState.APPROVED)

  // useEffect(()=>{
  //   setAmountInput(requiredScadsAmount?.toExact())
  // },[requiredScadsAmount])

  // useEffect(()=>{
  //   setAmountOutput(requiredCaratAmount?.toExact())
  // },[requiredCaratAmount])

  return (
    <StyledSwapContainer $isChartExpanded={false}>
      <StyledInputCurrencyWrapper>
        <AppBody>
          <CurrencyInputHeader title={t('Carat Mint')} subtitle={t('Buy Carat in an instant')} token={tokens.carat} />
          <Wrapper id="swap-page">
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label={t('From (estimated)')}
                value={amountInput === '0.0' ? requiredScadsAmount?.toExact() : amountInput}
                showMaxButton={!false}
                currency={tokens.cake}
                onUserInput={handleAmountInput}
                onMax={()=>handleMaxInput()}
                onCurrencySelect={() => console.log('input currency select')}
                otherCurrency={tokens.carat}
                disableCurrencySelect={!false}
                onlyInteger={false}
                id="swap-currency-input"/>

              {/* <CurrencyInputPanel
                value={amountOutput === '0.0' ? requiredCaratAmount?.toExact() : amountOutput}
                onUserInput={handleAmountOutput}
                label={t('To')}
                showMaxButton={false}
                currency={tokens.carat}
                onCurrencySelect={() => console.log('output currency select')}
                otherCurrency={tokens.cake}
                disableCurrencySelect={!false}
                onlyInteger={false}
                id="swap-currency-output"/> */}
            </AutoColumn>
            <Box mt="1rem">
              {!account ? (
                <ConnectWalletButton width="100%" />
              ) : showApproveFlow ? (
                <RowBetween>
                  <Button
                    variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                    onClick={approveCallback}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    width="48%"
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        {t('Enabling')} <CircleLoader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      t('Enabled')
                    ) : (
                      t('Enable %asset%', { asset: tokens.cake.symbol ?? '' })
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleSwap()
                    }}
                    width="48%"
                    id="swap-button"
                    disabled={!isValid || approval !== ApprovalState.APPROVED}>
                    {t('Mint')}
                  </Button>
                </RowBetween>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleSwap()
                  }}
                  id="swap-button"
                  width="100%"
                  disabled={!isValid}
                >
                  {t('Mint')}
                </Button>
              )}
              {showApproveFlow && (
                <Column style={{ marginTop: '1rem' }}>
                  <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                </Column>
              )}
            </Box>
          </Wrapper>
          <FooterCard>
            <Text fontSize="14px" style={{ textAlign: 'center' }}>
              <span role="img" aria-label="pancake-icon">
                🥞
              </span>{' '}
              {t('You can only mint WHOLE carat not partial. 10% mint fees')}
            </Text>
          </FooterCard>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </StyledSwapContainer>
  )
}
