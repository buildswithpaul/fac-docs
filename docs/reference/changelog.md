---
title: Changelog
description: Release history of Frappe Assistant Core (FAC), generated automatically from GitHub releases at build time.
---

<script setup>
import { data } from './changelog.data'
</script>

# Changelog

Generated from the project's [GitHub releases](https://github.com/buildswithpaul/Frappe_Assistant_Core/releases)
at build time — what ships is what you see here.

<div v-if="data.releases.length === 0" class="changelog-fallback">

> Release information could not be fetched when this page was last built.
> See the [releases on GitHub](https://github.com/buildswithpaul/Frappe_Assistant_Core/releases)
> for the authoritative list.

</div>

<section v-for="r in data.releases" :key="r.tag" class="release">
	<div class="release-head">
		<h2 :id="r.tag" class="release-title">
			<a class="release-tag" :href="r.url" target="_blank" rel="noreferrer">{{ r.tag }}</a>
		</h2>
		<span v-if="r.prerelease" class="release-pre">pre-release</span>
		<span class="release-date">{{ r.date }}</span>
	</div>
	<div class="release-body" v-html="r.bodyHtml"></div>
</section>

<p class="changelog-tail">
	Older versions: <a href="https://github.com/buildswithpaul/Frappe_Assistant_Core/releases">all releases on GitHub →</a>
</p>

<style scoped>
.release-head {
	display: flex;
	align-items: baseline;
	gap: 12px;
	flex-wrap: wrap;
	border-top: 1px solid var(--fac-rule);
	margin-top: 2.4rem;
}
.release-title {
	border: 0;
	margin: 0;
	padding-top: 1.2rem;
}
.release-tag {
	font-family: var(--fac-mono);
	font-weight: 600;
	text-decoration: none;
}
.release-pre {
	font-family: var(--fac-mono);
	font-size: 10.5px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	border: 1px solid var(--fac-ink);
	color: var(--fac-ink);
	border-radius: 4px;
	padding: 2px 8px;
}
.release-date {
	margin-left: auto;
	font-family: var(--fac-mono);
	font-size: 13px;
	font-variant-numeric: tabular-nums;
	color: var(--vp-c-text-2);
	font-weight: 400;
}
.release-body :deep(h1),
.release-body :deep(h2) {
	font-size: 1.05rem;
	border: 0;
	padding-top: 0.5rem;
}
.release-body :deep(h3) {
	font-size: 0.95rem;
}
.changelog-tail {
	margin-top: 2.5rem;
	padding-top: 1.25rem;
	border-top: 1px solid var(--fac-rule);
}
</style>
