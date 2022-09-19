import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'ScadsSwap',
  description:
    'The most popular AMM on BSC by user count! Earn Scads through yield farming or win it in the Lottery, then stake it in Scads Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by ScadsSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://pancakeswap.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('ScadsSwap')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('ScadsSwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('ScadsSwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('ScadsSwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('ScadsSwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('ScadsSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('ScadsSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('ScadsSwap')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('ScadsSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('ScadsSwap')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('ScadsSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('ScadsSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('ScadsSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('ScadsSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('ScadsSwap')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('ScadsSwap')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('ScadsSwap')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('ScadsSwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('ScadsSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('ScadsSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('ScadsSwap Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('ScadsSwap')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('ScadsSwap')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('ScadsSwap')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('ScadsSwap')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Scads Squad')} | ${t('ScadsSwap')}`,
      }
    default:
      return null
  }
}
