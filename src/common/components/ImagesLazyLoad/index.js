/*
 *
 * Producer -- Alvin 
 * Time -- 2018/1/10
 * Function -- Common module for Button
 *
 */
import React from 'react'
import PropTypes from 'prop-types'

import ProductImage from './ProductImage'
import PlaceholderImage from './PlaceholderImage'
const IMAGES = {
  product: ProductImage,
  placeholderImage: PlaceholderImage
}

const Image = ({
  type,
  ...props
}) => {
  const CMP = IMAGES[type]

  return <CMP {...props} />
}

Image.defaultProps = {
  type: 'product',
}

Image.propTypes = {
  type: PropTypes.string,
}

export default Image
