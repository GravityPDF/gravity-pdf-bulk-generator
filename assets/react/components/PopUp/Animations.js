/* Dependencies */
import posed from 'react-pose'

/**
 * @package     Gravity PDF Bulk Generator
 * @copyright   Copyright (c) 2020, Blue Liquid Designs
 * @license     http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since       1.0
 */

/**
 * Fade
 *
 * @type { <PoseElementProps> }
 *
 * @since 1.0
 */
export const Fade = posed.div({
  enter: {
    opacity: 1,
    transition: {
      duration: 150
    }
  },
  exit: {opacity: 0}
})

/**
 * SlideDown
 *
 * @type { <PoseElementProps> }
 *
 * @since 1.0
 */
export const SlideDown = posed.div({
  enter: {
    y: 0,
    transition: {
      duration: 750,
      ease: [0.215, 0.61, 0.355, 1],
    }
  },
  exit: {
    y: '-100%',
    transition: {
      duration: 350,
      ease: [0.215, 0.61, 0.355, 1],
    }
  }
})
