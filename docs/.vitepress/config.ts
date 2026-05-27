import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'FAC',
	titleTemplate: ':title — FAC Docs',
	description: 'Open-source AI assistant for ERP — MCP tools, OAuth, and an extensible plugin system.',
	lang: 'en-US',
	cleanUrls: true,
	lastUpdated: true,

	// Migrated docs reference legacy uppercase paths and source files.
	// Set to `true` while link cleanup is in flight; tighten to a regex list later.
	ignoreDeadLinks: true,

	base: '/',

	head: [
		['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
		['meta', { name: 'theme-color', content: '#0981E3' }],
		['meta', { property: 'og:title', content: 'FAC Docs' }],
		['meta', { property: 'og:description', content: 'Open-source AI assistant for ERP.' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'https://docs.assistantcore.cloud' }],
	],

	themeConfig: {
		logo: '/FAC_mark.svg',
		siteTitle: 'FAC',

		nav: [
			{ text: 'Guide', link: '/getting-started/installation' },
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

		footer: {
			message: 'Released under the AGPL-3.0 License.',
			copyright: 'Copyright © 2025 — present, Paul Clinton',
		},

		editLink: {
			pattern: 'https://github.com/buildswithpaul/fac-docs/edit/main/docs/:path',
			text: 'Edit this page on GitHub',
		},

		outline: { level: [2, 3], label: 'On this page' },
	},
})
