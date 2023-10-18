export function router_matcbh(pathname) {
  if (pathname.match(/^\/$/)) return 'home'
  if (pathname.match(/^\/homepage$/)) return 'homeB'

  if (pathname.match(/^\/campaign/)) return 'campaign'

  if (pathname.match(/^\/brand\//)) return 'brand'
  if (pathname.match(/^\/brand\/$/)) return 'brand'

  if (pathname.match(/^\/hot/)) return 'hot'
  if (pathname.match(/^\/search/)) return 'search'

  if (pathname.match(/^\/product/)) return 'product'

  if (pathname.match(/^\/category/)) return 'category'

  return 'other'
}

export function pageType(param) {
  let url = param
  if (url.match(/^http/)) {
    url = url.split('//')[1]
  }
  const a = url.indexOf('/')
  const b = url.indexOf('?')
  const pathname = url.search('sephora') > 0 ? url.slice(a, b) : url
  return router_matcbh_v2(pathname)
}
export function router_matcbh_v2(pathname) {

  if (pathname.match(/^\/$/)) return 'home'

  if (pathname.match(/^\/homepage/)) return 'homeB'

  if (pathname.match(/^\/exclusive/)) return 'List-page'
  if (pathname.match(/^\/function/)) return 'List-page'
  if (pathname.match(/^\/gift_set/)) return 'List-page'

  if (pathname.match(/^\/campaign/)) return 'Campaign-page'
  if (pathname.match(/^\/weeklyspecials/)) return 'Campaign-page'
  if (pathname.match(/^\/AllNavigation/)) return 'Function-page'
  if (pathname.match(/^\/myAccount/)) return 'Function-page'


  if (pathname.match(/^\/brand\//)) return 'List-page'
  if (pathname.match(/^\/brand\/story$/)) return 'Campaign-page'

  if (pathname.match(/^\/hot/)) return 'List-page'
  if (pathname.match(/^\/search/)) return 'List-page'

  if (pathname.match(/^\/product/)) return 'Product-detail-page'

  if (pathname.match(/^\/category/)) return 'List-page'

  return 'other'
}
export function router_matcbh_v3(url) {
  const a = url.indexOf('/')
  const b = url.indexOf('?')
  const pathname = url.search('sephora') > 0 ? url.slice(a, b) : url

  if (pathname.indexOf(/\/exclusive/) > 0) return 'List-page'
  if (pathname.indexOf(/\/function/) > 0) return 'List-page'
  if (pathname.indexOf(/\/gift_set/) > 0) return 'List-page'

  if (pathname.indexOf(/\/campaign/) > 0) return 'Campaign-page'
  if (pathname.indexOf(/\/weeklyspecials/) > 0) return 'Campaign-page'

  if (pathname.indexOf(/\/brand\//) > 0) return 'List-page'
  if (pathname.indexOf(/\/brand\/story$/) > 0) return 'Campaign-page'

  if (pathname.indexOf(/\/hot/) > 0) return 'List-page'
  if (pathname.indexOf(/\/search/) > 0) return 'List-page'

  if (pathname.indexOf(/\/product/) > 0) return 'Product-detail-page'

  if (pathname.indexOf(/\/category/) > 0) return 'List-page'

  return 'other'
}
