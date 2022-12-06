import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, JSBI, Token, Trade, TokenAmount } from '@scads/sdk'
import { Button, Box, Text } from '@scads/uikit'
import { ethers, utils, BigNumber } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import Column, { AutoColumn } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import { Wrapper } from './components/styleds'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { Field } from '../../state/swap/actions'
import { useCaratBuyBackInfo, useScadsBuyBackInfo, useSwapActionHandlers, useSwapState, tryParseAmount,useCaratSellPermission } from '../../state/swap/hooks'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'
import useCaratMint from './hooks/useCaratMint'
import { FooterCard } from '../../components/Card'

export default function CaratBuyBackCard() {
  const { t } = useTranslation()
  const allowCaratSell = useCaratSellPermission();
  const { account } = useActiveWeb3React();
  // carat amount
  const [amountInput, setAmountInput] = useState<string>();
  // scads amount
  const [amountOutput, setAmountOutput] = useState<string>();

  const parsedCaratTokenAmount = new TokenAmount(
    tokens.carat,
    amountInput ? JSBI.multiply(JSBI.BigInt(utils.parseEther(amountInput)), JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)) : '0',
  )

  const parsedScadsTokenAmount = new TokenAmount(
    tokens.cake,
    amountOutput ? JSBI.multiply(JSBI.BigInt(utils.parseEther(amountOutput)), JSBI.BigInt(DEFAULT_TOKEN_DECIMAL)) : '0',
  )

  const {
    currencyBalances,
    redeemScadsAmount,
    inputError: swapInputError,
  } = useCaratBuyBackInfo(parsedCaratTokenAmount, tokens.cake)

  // const scadsAmountInCarat = useScadsAmountInCaratContract()

  const caratBalance = currencyBalances[Field.INPUT]?.toSignificant()
  const scadsBalance = currencyBalances[Field.OUTPUT]?.toSignificant()

  const {
    redeemCaratAmount
  } = useScadsBuyBackInfo(parsedScadsTokenAmount, tokens.carat)

  const isValid = !swapInputError

  // input carat amount on carat input
  const handleAmountInput = useCallback((value: string) => {
    setAmountInput(value)
    setAmountOutput('0.0')
  }, [])

  const handleAmountOutput = useCallback((value: string) => {
    setAmountInput('0.0')
    setAmountOutput(value)
  }, [])

  const { caratRedeem } = useCaratMint()
  const handleSwap = async () => {
    if(allowCaratSell[0].lt(BigNumber.from(utils.parseEther('10000000')))){
      window.alert('Carat amount less than 10M in market')
    }else if(amountInput === '0.0') {
      const res = redeemCaratAmount?.toExact()
      await caratRedeem(res.toString())
    }else if(amountInput !== '0.0') {
      const res = utils.parseEther(amountInput)
      await caratRedeem(res.toString())
    }
  }

  const handleMaxInput = () => {
    setAmountInput(caratBalance)
    setAmountOutput('0.0')
  }

  return (
    <StyledSwapContainer $isChartExpanded={false}>
      <StyledInputCurrencyWrapper>
        <AppBody>
          <CurrencyInputHeader title={t('Carat Sell')} subtitle="Buy Scads with Carat" token={tokens.carat} />
          <Wrapper id="swap-page">
            <AutoColumn gap="md">
              <CurrencyInputPanel
                label={t('From (estimated)')}
                value={amountInput === '0.0' ? utils.formatEther(redeemCaratAmount?.toExact()) : amountInput}
                showMaxButton={!false}
                currency={tokens.carat}
                onUserInput={handleAmountInput}
                onMax={()=>handleMaxInput()}
                onCurrencySelect={() => console.log('input currency select')}
                otherCurrency={tokens.cake}
                disableCurrencySelect={!false}
                onlyInteger={false}
                id="swap-currency-input"/>

              <CurrencyInputPanel
                value={amountOutput === '0.0' ? utils.formatEther(redeemScadsAmount?.toExact()) : amountOutput}
                onUserInput={handleAmountOutput}
                label={t('To')}
                showMaxButton={false}
                currency={tokens.cake}
                onCurrencySelect={() => console.log('output currency select')}
                otherCurrency={tokens.carat}
                disableCurrencySelect={!false}
                id="swap-currency-output"/>
            </AutoColumn>
            <Box mt="1rem">
              {!account ? (
                <ConnectWalletButton width="100%" />
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
                  {t('Sell')}
                </Button>
              )}
            </Box>
          </Wrapper>
          <FooterCard>
            <Text fontSize="14px" style={{ textAlign: 'center' }}>
              <span role="img" aria-label="pancake-icon">
                🥞
              </span>{' '}
              {t('You can only claim WHOLE carat not partial. 10% claim fees')}
            </Text>
          </FooterCard>
        </AppBody>
      </StyledInputCurrencyWrapper>
    </StyledSwapContainer>
  )
}
