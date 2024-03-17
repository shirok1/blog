// https://github.com/nuxt-themes/alpine/blob/main/nuxt.schema.ts
export default defineAppConfig({
  alpine: {
    title: 'shirok1.dev',
    description: 'shirok1\'s life as a developer',
    header: {
      position: 'left', // possible value are : | 'left' | 'center' | 'right'
      logo: false,
    },
    footer: {
      credits: {
        enabled: false, // possible value are : true | false
        repository: 'https://www.github.com/nuxt-themes/alpine' // our github repository
      },
      navigation: false, // possible value are : true | false
      alignment: 'right', // possible value are : 'none' | 'left' | 'center' | 'right'
      message: '' // string that will be displayed in the footer (leave empty or delete to disable)
    },
    socials: {
      x: {
        icon: 'simple-icons:x',
        label: 'X',
        href: 'https://x.com/imshirok1'
      },
      bilibili: {
        icon: 'simple-icons:bilibili',
        label: 'Bilibili',
        href: 'https://www.linkedin.com/company/nuxtlabs'
      },
      gh: {
        icon: 'simple-icons:github',
        label: 'GitHub',
        href: 'https://github.com/shirok1'
      }
    },
    form: {
      successMessage: 'Message sent. Thank you!'
    }
  }
})
