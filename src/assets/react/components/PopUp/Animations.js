import posed from 'react-pose'

export const Fade = posed.div({
  enter: {
    opacity: 1,
    transition: {
      duration: 150
    }
  },
  exit: {opacity: 0}
})

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
