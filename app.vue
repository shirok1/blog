<template>
  <AppLayout>
    <NuxtPage />
  </AppLayout>
</template>

<style lang="scss">
@import '@fontsource/ibm-plex-sans/latin';
@import '@fontsource/ibm-plex-mono/latin-italic';
@import '@fontsource/ibm-plex-mono/latin';
@import '@fontsource/ibm-plex-mono/latin-italic';

html {
  font-family: var(--font-sans);
}

code,
kbd,
samp,
pre {
  font-family: var(--font-mono);
}

header .logo a.router-link-active {
  display: none;
}

header li .logo a.router-link-active {
  display: flex;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.document-driven-page {
  flex-grow: 1;
}
</style>
