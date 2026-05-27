import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'Frappe Assistant Core',
	description: 'Open-source AI assistant for Frappe — MCP tools, chat widget, OAuth, and an extensible plugin system.',
	lang: 'en-US',
	cleanUrls: true,
	lastUpdated: true,

	// Migrated docs reference legacy uppercase paths and source files.
	// Set to `true` while link cleanup is in flight; tighten to a regex list later.
	ignoreDeadLinks: true,

	// Set this to the GitHub Pages base path if hosting at a project page
	// (e.g. '/fac-docs/'). For a custom domain via CNAME, keep '/'.
	base: '/',

	head: [
		['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
		['meta', { name: 'theme-color', content: '#0ea5e9' }],
		['meta', { property: 'og:title', content: 'Frappe Assistant Core Docs' }],
		['meta', { property: 'og:description', content: 'Open-source AI assistant for Frappe.' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'https://docs.assistantcore.cloud' }],
	],

	themeConfig: {
		logo: '/logo.svg',

		nav: [
			{ text: 'Guide', link: '/getting-started/introduction' },
			{ text: 'API', link: '/api/overview' },
			{ text: 'Skills', link: '/skills/overview' },
			{
				text: 'Resources',
				items: [
					{ text: 'Changelog', link: '/reference/changelog' },
					{ text: 'GitHub', link: 'https://github.com/buildswithpaul/fac-docs' },
				],
			},
		],

		sidebar: {
			'/getting-started/': [
				{
					text: 'Getting Started',
					items: [
						{ text: 'Introduction', link: '/getting-started/introduction' },
						{ text: 'Installation', link: '/getting-started/installation' },
						{ text: 'Quick Start', link: '/getting-started/quick-start' },
						{ text: 'Migration Guide', link: '/getting-started/migration' },
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
						{ text: 'Skills (User Guide)', link: '/guides/skills-user-guide' },
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

			'/skills/': [
				{
					text: 'Skills',
					items: [
						{ text: 'Overview', link: '/skills/overview' },
						{ text: 'Document Skills', collapsed: true, items: [
							{ text: 'create_document', link: '/skills/create-document' },
							{ text: 'get_document', link: '/skills/get-document' },
							{ text: 'update_document', link: '/skills/update-document' },
							{ text: 'submit_document', link: '/skills/submit-document' },
							{ text: 'delete_document', link: '/skills/delete-document' },
							{ text: 'list_documents', link: '/skills/list-documents' },
							{ text: 'search_documents', link: '/skills/search-documents' },
						]},
						{ text: 'Search', collapsed: true, items: [
							{ text: 'search_doctype', link: '/skills/search-doctype' },
							{ text: 'search_link', link: '/skills/search-link' },
							{ text: 'search_vector', link: '/skills/search-vector' },
							{ text: 'get_doctype_info', link: '/skills/get-doctype-info' },
						]},
						{ text: 'Code & Reports', collapsed: true, items: [
							{ text: 'run_python_code', link: '/skills/run-python-code' },
							{ text: 'run_database_query', link: '/skills/run-database-query' },
							{ text: 'generate_report', link: '/skills/generate-report' },
							{ text: 'analyze_business_data', link: '/skills/analyze-business-data' },
							{ text: 'extract_file_content', link: '/skills/extract-file-content' },
						]},
						{ text: 'Dashboards', collapsed: true, items: [
							{ text: 'list_user_dashboards', link: '/skills/list-user-dashboards' },
							{ text: 'create_dashboard_chart', link: '/skills/create-dashboard-chart' },
							{ text: 'insight_v3_skill', link: '/skills/insight-v3' },
						]},
						{ text: 'Workflow', collapsed: true, items: [
							{ text: 'run_workflow', link: '/skills/run-workflow' },
						]},
					],
				},
			],

			'/development/': [
				{
					text: 'Development',
					items: [
						{ text: 'Development Guide', link: '/development/development-guide' },
						{ text: 'Plugin Development', link: '/development/plugin-development' },
						{ text: 'Skills Developer Guide', link: '/development/skills-developer-guide' },
						{ text: 'External App Development', link: '/development/external-app-development' },
						{ text: 'Test Case Creation', link: '/development/test-case-creation' },
						{ text: 'OAuth/CORS Configuration', link: '/development/oauth-cors' },
						{ text: 'Pre-commit Setup', link: '/development/pre-commit' },
						{ text: 'Release Guide', link: '/development/release-guide' },
					],
				},
			],

			'/internals/': [
				{
					text: 'Internals',
					items: [
						{ text: 'Architecture', link: '/internals/architecture' },
						{ text: 'Technical Documentation', link: '/internals/technical' },
						{ text: 'Performance', link: '/internals/performance' },
						{ text: 'MCP StreamableHTTP', link: '/internals/mcp-streamable-http' },
					],
				},
			],

			'/reference/': [
				{
					text: 'Reference',
					items: [
						{ text: 'Changelog', link: '/reference/changelog' },
						{ text: 'Capabilities Report', link: '/reference/capabilities' },
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
