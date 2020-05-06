/* Dependencies */
import React from 'react'
/* Components */
import LoadingDots from './LoadingDots'
/* Helpers */
import language from '../../helpers/language'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.1
 */

/**
 * Display LoadingSuspense UI
 *
 * @returns { LoadingSuspense: component }
 *
 * @since 1.1
 */
const LoadingSuspense = () => (
  <h2 data-test='component-LoadingSuspense' className='loading-suspense'>
    {language.loadingSuspense}<LoadingDots />
  </h2>
)

export default LoadingSuspense
