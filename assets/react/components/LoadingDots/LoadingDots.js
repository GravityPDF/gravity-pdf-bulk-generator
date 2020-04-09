/* Dependencies */
import React from 'react'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Display LoadingDots UI
 *
 * @returns { LoadingDots: component }
 *
 * @since 1.0
 */
const LoadingDots = () => (
  <span className='gfpdf-loading-dots'>
    <span>.</span><span>.</span><span>.</span>
  </span>
)

export default LoadingDots
