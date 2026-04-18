<script setup lang="ts">
import type { HomeFooterData } from '~/composables/useHomepageContent'

const currentYear = new Date().getFullYear()

defineProps<{
  data: HomeFooterData
}>()
</script>

<template>
  <footer class="landing-footer">
    <div class="landing-footer__brand" data-reveal>
      <p class="landing-kicker">Footer</p>
      <h2>{{ data.title }}</h2>
      <p>{{ data.address }}</p>

      <div class="landing-footer__badges">
        <span v-if="data.established">Tashkil topgan: {{ data.established }}</span>
        <span>Rasmiy institut sayti</span>
      </div>
    </div>

    <div class="landing-footer__grid">
      <section class="landing-footer__column" data-reveal>
        <p class="landing-card-label">Bog'lanish</p>
        <a v-for="phone in data.phones" :key="phone" :href="`tel:${phone.replace(/[^\d+]/g, '')}`">{{ phone }}</a>
        <a v-for="email in data.emails" :key="email" :href="`mailto:${email}`">{{ email }}</a>
      </section>

      <section class="landing-footer__column" data-reveal>
        <p class="landing-card-label">Ijtimoiy tarmoqlar</p>
        <a
          v-for="item in data.socials"
          :key="item.id"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noreferrer' : undefined"
        >
          <span>{{ item.badge }}</span>
          <strong>{{ item.label }}</strong>
        </a>
      </section>

      <section class="landing-footer__column" data-reveal>
        <p class="landing-card-label">Navigatsiya</p>
        <a href="#top">Boshiga qaytish</a>
        <a href="#faculties">Fakultetlar</a>
        <a href="#news">Yangiliklar</a>
        <a
          v-for="item in data.links.slice(0, 3)"
          :key="item.id"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noreferrer' : undefined"
        >
          {{ item.title }}
        </a>
      </section>
    </div>

    <div class="landing-footer__bottom">
      <p>© {{ currentYear }} {{ data.title }}. Barcha huquqlar himoyalangan.</p>
      <span>Accessible, responsive, production-ready homepage</span>
    </div>
  </footer>
</template>
