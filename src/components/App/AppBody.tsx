import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 20px;
  max-width: 436px;
  width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
