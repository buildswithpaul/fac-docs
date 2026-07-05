import { defineConfig } from 'vitepress'

const SITE = 'https://docs.assistantcore.cloud'
const OG_DESCRIPTION =
	'Talk to your ERP. FAC (Frappe Assistant Core) is the open-source AI assistant for Frappe and ERPNext — an MCP server with OAuth, 24 tools, and a full audit trail.'

// Entity graph: teaches search engines that "FAC" and "Frappe Assistant Core"
// are the same thing, what it is, and where it lives.
const JSON_LD = JSON.stringify({
	'@context': 'https://schema.org',
	'@graph': [
		{
			'@type': 'WebSite',
			name: 'Frappe Assistant Core',
			alternateName: ['FAC', 'FAC Docs'],
			url: `${SITE}/`,
		},
		{
			'@type': 'SoftwareApplication',
			name: 'Frappe Assistant Core',
			alternateName: 'FAC',
			applicationCategory: 'BusinessApplication',
			operatingSystem: 'Linux',
			description: OG_DESCRIPTION,
			url: `${SITE}/`,
			downloadUrl: 'https://github.com/buildswithpaul/Frappe_Assistant_Core',
			softwareHelp: `${SITE}/getting-started/installation`,
			license: 'https://www.gnu.org/licenses/agpl-3.0.html',
			offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
			author: { '@type': 'Person', name: 'Paul Clinton' },
		},
	],
})

export default defineConfig({
	title: 'FAC',
	titleTemplate: ':title — FAC Docs',
	description: OG_DESCRIPTION,
	lang: 'en-US',
	cleanUrls: true,
	lastUpdated: true,

	// Migrated docs reference legacy uppercase paths and source files.
	// Set to `true` while link cleanup is in flight; tighten to a regex list later.
	ignoreDeadLinks: true,

	base: '/',

	sitemap: { hostname: SITE },

	// Per-page canonical URL (clean URLs, index.md → directory root).
	transformPageData(pageData) {
		const path = pageData.relativePath
			.replace(/index\.md$/, '')
			.replace(/\.md$/, '')
		const canonical = `${SITE}/${path}`
		pageData.frontmatter.head ??= []
		pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonical }])
	},

	head: [
		['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
		['meta', { name: 'theme-color', content: '#0981E3' }],
		['meta', { property: 'og:site_name', content: 'FAC — Frappe Assistant Core' }],
		['meta', { property: 'og:title', content: 'FAC — Talk to your ERP' }],
		['meta', { property: 'og:description', content: OG_DESCRIPTION }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: `${SITE}/` }],
		['meta', { property: 'og:image', content: `${SITE}/og-card.png` }],
		['meta', { property: 'og:image:width', content: '1200' }],
		['meta', { property: 'og:image:height', content: '630' }],
		['meta', { name: 'twitter:card', content: 'summary_large_image' }],
		['meta', { name: 'twitter:title', content: 'FAC — Talk to your ERP' }],
		['meta', { name: 'twitter:description', content: OG_DESCRIPTION }],
		['meta', { name: 'twitter:image', content: `${SITE}/og-card.png` }],
		['script', { type: 'application/ld+json' }, JSON_LD],
	],

	themeConfig: {
		logo: '/FAC_mark.svg',
		siteTitle: 'FAC',

		nav: [
			{ text: 'Guide', link: '/getting-started/installation' },
			{ text: 'FAC Chat', link: '/fac-chat/' },
			{ text: 'API', link: '/api/overview' },
			{
				text: 'Resources',
				items: [
					{ text: 'Changelog', link: '/reference/changelog' },
					{ text: 'GitHub', link: 'https://github.com/buildswithpaul/Frappe_Assistant_Core' },
					{ text: 'Report an issue', link: 'https://github.com/buildswithpaul/Frappe_Assistant_Core/issues' },
					{ text: 'Frappe Cloud Marketplace', link: 'https://cloud.frappe.io/marketplace/apps/frappe_assistant_core' },
					{ text: 'Sponsor FAC', link: 'https://github.com/sponsors/buildswithpaul' },
				],
			},
		],

		sidebar: {
			'/fac-chat/': [
				{
					text: 'FAC Chat',
					items: [
						{ text: 'Overview', link: '/fac-chat/' },
						{ text: 'Technical (client side)', link: '/fac-chat/technical' },
					],
				},
			],

			'/getting-started/': [
				{
					text: 'Getting Started',
					items: [
						{ text: 'Installation', link: '/getting-started/installation' },
						{ text: 'Quick Start', link: '/getting-started/quick-start' },
						{ text: 'Migration from STDIO', link: '/getting-started/migration' },
					],
				},
				{
					text: 'OAuth Setup',
					collapsed: false,
					items: [
						{ text: 'OAuth Quick Start', link: '/getting-started/oauth/quick-start' },
						{ text: 'OAuth Setup Guide', link: '/getting-started/oauth/setup-guide' },
						{ text: 'OAuth Changelog', link: '/getting-started/oauth/changelog' },
					],
				},
			],

			'/guides/': [
				{
					text: 'Guides',
					items: [
						{ text: 'Plugin Management', link: '/guides/plugin-management' },
						{ text: 'Tool Management', link: '/guides/tool-management' },
						{ text: 'Skills', link: '/guides/skills-user-guide' },
						{ text: 'Prompt Templates', link: '/guides/prompt-templates' },
						{ text: 'Python Code Orchestration', link: '/guides/python-code-orchestration' },
						{ text: 'Code Execution Security', link: '/guides/code-execution-security' },
					],
				},
			],

			'/api/': [
				{
					text: 'API',
					items: [
						{ text: 'Overview', link: '/api/overview' },
						{ text: 'API Reference', link: '/api/reference' },
						{ text: 'Tool Reference', link: '/api/tool-reference' },
					],
				},
			],

			'/internals/': [
				{
					text: 'Internals',
					items: [
						{ text: 'Architecture', link: '/internals/architecture' },
						{ text: 'MCP StreamableHTTP', link: '/internals/mcp-streamable-http' },
					],
				},
			],

			'/reference/': [
				{
					text: 'Reference',
					items: [
						{ text: 'Changelog', link: '/reference/changelog' },
					],
				},
			],
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/buildswithpaul/fac-docs' },
		],

		search: {
			provider: 'local',
		},

		// No themeConfig.footer: it only ever rendered on the landing page
		// (sidebar pages hide it), where the signed colophon already carries
		// the license + copyright line.

		editLink: {
			pattern: 'https://github.com/buildswithpaul/fac-docs/edit/main/docs/:path',
			text: 'Edit this page on GitHub',
		},

		outline: { level: [2, 3], label: 'On this page' },
	},
})
