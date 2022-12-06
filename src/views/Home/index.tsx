import React from 'react'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import { earnSectionData } from './components/SalesSection/data'
import SalesSection from './components/SalesSection'
import { useFetchPublicPoolsData } from '../../state/pools/hooks'
import { usePollFarmsPublicData } from '../../state/farms/hooks'

const Home: React.FC = () => {
  usePollFarmsPublicData()
  useFetchPublicPoolsData()

  const HomeSectionContainerStyles = { margin: '0', padding: '5%', width: '100%', maxWidth: '100%' }

  return (
    <>
      <PageMeta />
      <PageSection innerProps={{ style: HomeSectionContainerStyles }} index={2} hasCurvedDivider={false}>
        <SalesSection {...earnSectionData} />
        {/* <FarmsPoolsRow /> */}
      </PageSection>
    </>
  )
}

export default Home
