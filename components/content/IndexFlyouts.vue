<template>
  <div class="big-flyouts">
    <div class="srk">
      <span>shirok1</span>
    </div>
    <div class="dot-dev">
      <span class="dot">dot</span>
      <span class="space">&nbsp;</span>
      <span class="dev">dev</span>
    </div>
  </div>

  <div class="slogan">
    Stupid quotes about ambitions here.
  </div>
</template>


<style scoped lang="ts">
css({
  '@keyframes fade-in-left': {
    from: {
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)',
    },
    to: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    },
  },
  '@keyframes fade-in-right': {
    from: {
      opacity: 0,
      transform: 'translate3d(100%, 0, 0)',
    },
    to: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    },
  },
  '@keyframes fade-in': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },


  '.big-flyouts': {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflowX: 'clip',
    fontStyle: 'italic',
    lineHeight: '1',
    overflow: 'visible',
    '.srk': {
      '@sm': {
        paddingRight: '12rem',
      },
      '@md': {
        paddingRight: '12rem',
      },
      span: {
        fontSize: '7rem',
        '@sm': {
          fontSize: '8rem',
        },
        fontWeight: 'bold',
      },
      animation: 'fade-in-left 1s cubic-bezier(0.4, 0, 0.2, 1) 1',
    },
    '.dot-dev': {
      paddingLeft: '6rem',
      '@sm': {
        paddingLeft: '9rem',
      },
      '@md': {
        paddingLeft: '12rem',
      },
      marginTop: '-4rem',
      animation: 'fade-in-right 1s cubic-bezier(0.4, 0, 0.2, 1) 1',
      '.dot': {
        fontSize: '5rem',
        '@sm': {
          fontSize: '6rem',
        },
        fontWeight: '600',
        color: 'var(--color-gray-600)',
        '.dark &&': {
          color: 'var(--color-gray-400)',
        },
      },
      '.space': {
        fontSize: '5rem',
        '@sm': {
          fontSize: '6rem',
        },
        fontWeight: '600',
      },
      '.dev': {
        fontSize: '7rem',
        '@sm': {
          fontSize: '8rem',
        },
        fontWeight: 'bold',
      },
    },
  },
  '.slogan': {
    margin: '2rem',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '2rem',
    animation: 'fade-in 1s cubic-bezier(0.4, 0, 0.2, 1) 1',
  },
})
</style>
