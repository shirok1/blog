<script setup lang="ts">
defineProps<{
  // URL parameters
  aid?: string
  bvid?: string
  p?: number
  highQuality?: boolean
  autoplay?: boolean
  muted?: boolean
  t?: number
  asWide?: boolean
  // iframe attributes
  width: string
  aspectRatio?: string
}>()

</script>
<template>
  <iframe loading="lazy" :src="`//player.bilibili.com/player.html?` + Object.entries({
    aid, bvid, p, high_quality: highQuality ? 1 : 0, autoplay: autoplay ? 1 : 0, muted, t, as_wide: asWide ? 1 : 0
  }).map(([k, v]) => `${k}=${v}`).join('&')" scrolling="no" border="0" frameborder="no" framespacing="0"
    allowfullscreen="true" :style="{ width, aspectRatio: aspectRatio ?? '16/9', maxWidth: '100%' }" />
</template>