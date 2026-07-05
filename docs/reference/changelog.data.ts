import { defineLoader, createMarkdownRenderer } from 'vitepress'

/**
 * Build-time loader: pulls real releases from GitHub so the changelog can
 * never drift from what's actually shipped. Fails SOFT — an unreachable API
 * yields { releases: [] } and the page renders a fallback link instead of
 * breaking the build.
 */

const REPO = 'buildswithpaul/Frappe_Assistant_Core'

export interface Release {
	tag: string
	name: string
	date: string
	prerelease: boolean
	url: string
	bodyHtml: string
}

declare const data: { releases: Release[]; fetchedAt: string }
export { data }

/** Drop the leading "# [2.5.0](compare-url)" heading semantic-release puts
 *  first — the page renders its own version heading. */
function stripLeadingVersionHeading(body: string): string {
	const lines = body.split('\n')
	const i = lines.findIndex((l) => l.trim() !== '')
	if (i >= 0 && /^#{1,6}\s+\[?v?\d+\.\d+\.\d+/.test(lines[i].trim())) {
		lines.splice(i, 1)
	}
	return lines.join('\n').trim()
}

export default defineLoader({
	async load() {
		try {
			const headers: Record<string, string> = {
				accept: 'application/vnd.github+json',
				'user-agent': 'fac-docs-build',
			}
			// CI passes the ambient token for rate-limit headroom; local builds work anonymously.
			if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`

			const res = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, { headers })
			if (!res.ok) throw new Error(`GitHub API ${res.status}`)
			const raw = (await res.json()) as any[]

			const md = await createMarkdownRenderer('')
			const releases: Release[] = raw
				.filter((r) => !r.draft)
				.map((r) => ({
					tag: r.tag_name,
					name: r.name || r.tag_name,
					date: (r.published_at || r.created_at || '').slice(0, 10),
					prerelease: !!r.prerelease,
					url: r.html_url,
					bodyHtml: md.render(stripLeadingVersionHeading(r.body || '')),
				}))

			return { releases, fetchedAt: new Date().toISOString().slice(0, 10) }
		} catch (e) {
			console.warn(`[changelog.data] release fetch failed, rendering fallback: ${e}`)
			return { releases: [], fetchedAt: '' }
		}
	},
})
