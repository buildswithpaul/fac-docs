import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'

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
	setup() {
		// Click-to-zoom for content images (screenshots). medium-zoom is the
		// same lib the Vue/Vite docs use — tiny, no dependencies.
		const route = useRoute()
		let zoom: Zoom | undefined

		const initZoom = () => {
			// Re-scan on every route change; detach() clears stale handlers first
			// so SPA navigation doesn't leave dangling listeners.
			zoom?.detach()
			zoom = mediumZoom('.vp-doc img', {
				background: 'var(--vp-c-bg)',
				margin: 24,
			})
		}

		onMounted(() => {
			initZoom()
			watch(
				() => route.path,
				() => nextTick(initZoom),
			)
		})
	},
} satisfies Theme
