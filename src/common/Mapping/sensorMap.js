import * as router from './router'

export function sensor_router_match(pathname) {
  if (!pathname) return ''
  let routerMatch = router.router_matcbh(pathname)
  // business logic
  if (routerMatch === 'hot') routerMatch = 'search'
  if (routerMatch === 'product') routerMatch = 'pdp'

  // add suffix
  if (routerMatch === 'search' && routerMatch === 'brand' && routerMatch === 'category') routerMatch += '-search';
  return routerMatch
}
export function sensor_router_type(pathname) {
  if (!pathname) return ''
  let routerMatch = router.pageType(pathname) || 'other'
  return routerMatch
}
