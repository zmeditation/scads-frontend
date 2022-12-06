import React, { useState, useCallback } from 'react'
import { useKonamiCheatCode } from '@scads/uikit'

const EasterEgg: React.FC = (props) => {
  const [show, setShow] = useState(false)
  const startFalling = useCallback(() => setShow(true), [setShow])
  useKonamiCheatCode(startFalling)

  if (show) {
    return (
      <div onAnimationEnd={() => setShow(false)}>
        {/* <FallingBunnies {...props} /> */}
      </div>
    )
  }
  return null
}

export default React.memo(EasterEgg)
