import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'

// Self-hosted display + mono faces (Inter body ships with VitePress).
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'

import './fac.css'
import Landing from './components/Landing.vue'

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		// Registered globally so index.md (layout: page) can drop it in as <Landing />
		app.component('Landing', Landing)
	},
} satisfies Theme
