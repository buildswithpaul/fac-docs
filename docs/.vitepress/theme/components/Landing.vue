<script setup lang="ts">
import { withBase } from 'vitepress'

// The hand-drawn "fac" glyph from FAC_mark.svg, inlined so the ink can be
// mask-revealed as if the page is being signed. One path, calligraphic stroke.
const SIG_PATH = "M 424.76 657.47 C412.31,650.54 410.94,602.06 420.46,506.00 C421.25,498.02 422.20,488.03 422.56,483.79 L 423.23 476.08 L 417.36 473.46 C414.14,472.01 404.99,468.14 397.04,464.84 C382.00,458.60 377.70,456.17 375.98,452.96 C373.62,448.56 388.67,437.14 413.50,424.47 C421.20,420.54 428.06,417.14 428.75,416.91 C429.57,416.64 431.56,406.56 434.47,388.00 C457.98,238.06 480.94,146.01 499.45,127.49 C508.42,118.53 518.73,120.82 522.00,132.50 C523.55,138.03 522.34,140.00 517.38,140.00 C506.40,140.00 495.19,164.61 482.54,216.49 C477.04,239.08 472.54,260.13 469.07,279.50 C467.99,285.55 463.67,309.17 459.48,332.00 C448.68,390.74 445.70,408.04 446.30,408.63 C446.59,408.92 453.95,406.13 462.66,402.44 C511.28,381.82 578.89,362.43 609.00,360.48 C618.96,359.84 619.68,359.92 622.91,362.15 C627.07,365.02 629.72,368.49 630.89,372.62 C632.85,379.46 628.39,379.50 623.47,372.69 C619.50,367.21 616.53,366.92 606.33,371.00 C590.88,377.19 573.53,391.10 567.54,402.10 C561.66,412.90 568.32,411.66 599.92,396.04 C619.47,386.38 625.50,383.83 629.13,383.69 C636.78,383.39 638.51,386.46 635.51,394.96 C630.81,408.30 631.64,417.50 637.94,421.74 C644.35,426.06 651.02,427.32 660.65,426.04 C677.98,423.73 707.33,413.70 748.50,396.02 C786.72,379.60 797.89,374.33 803.32,370.15 C819.60,357.60 842.38,353.26 846.00,362.01 C847.95,366.72 846.32,367.82 838.24,367.26 C826.30,366.44 812.60,373.13 799.92,385.98 C792.02,393.98 787.00,403.22 787.00,409.76 C787.00,422.60 807.38,427.53 834.00,421.13 C857.00,415.60 896.24,399.45 950.18,373.30 C963.20,366.99 974.68,361.98 975.68,362.18 C979.62,362.94 977.60,366.43 970.50,371.15 C956.86,380.21 907.30,403.73 877.00,415.51 C845.68,427.70 825.12,432.98 808.91,432.99 C793.12,433.00 784.66,429.71 779.00,421.33 C776.90,418.22 776.51,416.50 776.56,410.55 C776.60,404.42 777.09,402.58 780.19,396.74 C782.16,393.03 783.67,390.00 783.55,390.00 C783.44,390.00 773.93,394.32 762.42,399.61 C728.00,415.42 695.08,428.31 675.50,433.64 C667.45,435.83 663.25,436.37 653.91,436.43 C642.59,436.50 642.18,436.42 635.45,433.00 C629.90,430.17 627.99,428.55 625.54,424.57 C622.56,419.74 622.50,419.38 622.62,407.39 L 622.74 395.15 L 620.29 396.08 C618.94,396.59 609.89,401.05 600.17,406.00 C581.53,415.47 572.69,419.00 567.59,419.00 C563.90,418.99 558.58,415.96 556.96,412.92 C553.91,407.23 560.54,392.64 570.53,383.04 L 576.90 376.93 L 573.20 377.60 C557.20,380.49 512.62,394.40 482.00,406.05 C450.49,418.03 444.71,420.55 443.95,422.63 C443.57,423.66 441.78,435.42 439.96,448.76 L 436.66 473.02 L 441.08 476.67 C459.92,492.23 473.50,513.00 479.06,534.73 C481.74,545.21 481.70,564.05 478.97,576.98 C469.52,621.76 439.81,665.86 424.76,657.47 ZM 438.64 640.76 C451.62,628.80 465.27,601.51 469.88,578.33 C472.79,563.74 473.31,555.43 472.00,544.47 C469.96,527.40 465.13,515.34 454.85,501.67 C450.04,495.26 439.03,485.00 436.97,485.00 C435.36,485.00 435.13,487.13 430.98,539.94 C425.55,608.95 426.26,645.00 433.05,645.00 C433.60,645.00 436.11,643.09 438.64,640.76 ZM 426.53 446.50 C427.62,436.33 428.42,428.00 428.30,428.00 C424.50,428.00 392.00,447.54 392.00,449.83 C392.00,450.25 395.94,452.29 400.75,454.37 C405.56,456.45 412.42,459.67 416.00,461.53 C419.58,463.38 422.96,464.92 423.52,464.95 C424.11,464.98 425.38,457.23 426.53,446.50 Z"

const READ_TOOLS = [
	'get_document', 'list_documents', 'search', 'search_documents', 'search_doctype',
	'search_link', 'fetch', 'get_doctype_info', 'report_list', 'report_requirements',
	'get_pending_approvals', 'list_user_dashboards',
]
const WRITE_TOOLS = ['create_document', 'update_document', 'delete_document', 'submit_document', 'run_workflow']
const ANALYZE_TOOLS = ['generate_report', 'run_python_code', 'run_database_query', 'analyze_business_data', 'extract_file_content']
const DASH_TOOLS = ['create_dashboard', 'create_dashboard_chart']
</script>

<template>
	<div class="fac-landing">
		<!-- ================= HERO: the sheet being signed ================= -->
		<section class="sheet hero">
			<div class="margin-rule" aria-hidden="true"></div>
			<div class="hero-grid">
				<div class="hero-copy">
					<!-- The signature signs the page -->
					<div class="sig-wrap" aria-hidden="true">
						<svg class="sig" viewBox="345 88 665 604">
							<defs>
								<mask id="sig-reveal">
									<rect class="sig-wipe" x="345" y="88" width="665" height="604" fill="#fff" />
								</mask>
							</defs>
							<g mask="url(#sig-reveal)" fill="currentColor">
								<path :d="SIG_PATH" />
							</g>
						</svg>
					</div>
					<p class="sig-caption">Signed: FAC — every action on the record</p>

					<h1 class="headline">
						<span class="hl-line">Talk to your ERP.</span>
						<svg class="flourish" viewBox="0 0 420 14" aria-hidden="true" preserveAspectRatio="none">
							<path pathLength="1" d="M2 9 C 80 3, 180 13, 300 7 S 400 5, 418 8"
								fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
						</svg>
						<span class="hl-line hl-2">It writes back — <em>in your books</em>, on the record.</span>
					</h1>

					<p class="sub">
						FAC is an open-source MCP server for Frappe and ERPNext. Point Claude, Cursor,
						or ChatGPT at your ERP — 24 tools, OAuth-scoped, every action journaled.
					</p>

					<div class="cta-row">
						<a class="btn-ink" :href="withBase('/getting-started/installation')">Get started</a>
						<a class="btn-ghost" href="https://github.com/buildswithpaul/Frappe_Assistant_Core">GitHub</a>
						<a class="link-ink" :href="withBase('/fac-chat/')">FAC Chat →</a>
					</div>
				</div>

				<!-- The Posting: a slip laid on the sheet -->
				<div class="posting" aria-hidden="true">
					<div class="post-head">
						<span>Date</span><span>Particulars</span><span class="num">Days</span><span class="num">Amount</span>
					</div>
					<div class="post-query">
						<span class="q-text">&gt; which customers are overdue past 60 days?</span><span class="caret"></span>
					</div>
					<div class="post-row r1">
						<span class="mono dim">07-05</span><span>Meridian Traders <span class="mono dim">SINV-2026-00311</span></span><span class="num mono">94</span><span class="num mono">₹4,82,500</span>
					</div>
					<div class="post-row r2">
						<span class="mono dim">07-05</span><span>Northline Exports <span class="mono dim">SINV-2026-00287</span></span><span class="num mono">81</span><span class="num mono">₹2,74,300</span>
					</div>
					<div class="post-row r3">
						<span class="mono dim">07-05</span><span>Kavya Textiles <span class="mono dim">SINV-2026-00252</span></span><span class="num mono">73</span><span class="num mono">₹1,58,600</span>
					</div>
					<div class="post-row r4">
						<span class="mono dim">07-05</span><span>Orbit Hardware <span class="mono dim">SINV-2026-00198</span></span><span class="num mono">65</span><span class="num mono">₹68,500</span>
					</div>
					<div class="post-total">
						<span></span><span>4 invoices overdue</span><span></span><span class="num mono">₹9,83,900</span>
					</div>
					<div class="stamp">
						LOGGED #AT-88213 · run_report · 2 tools · 0 writes · scope: read · 2026-07-05 14:32 IST
					</div>
				</div>
			</div>
		</section>

		<!-- ================= TWO WAYS IN: facing pages ================= -->
		<section class="spread">
			<p class="overline">Two ways in</p>
			<div class="pages">
				<div class="page">
					<p class="page-tag">The free MCP server</p>
					<h2>Bring your own LLM</h2>
					<p class="page-sub">
						Self-hosted, free forever. Connect any MCP-ready client to your Frappe data —
						you bring the model, nothing leaves your stack.
					</p>
					<div class="config">
						<div class="config-name">claude_desktop_config.json</div>
						<pre>{
  "mcpServers": {
    "erpnext": { "url": "https://your-site.com/mcp" }
  }
}</pre>
					</div>
					<a class="link-ink" :href="withBase('/getting-started/quick-start')">Connect a client →</a>
				</div>
				<div class="page page-right">
					<div class="soon-stamp" aria-hidden="true">FAC 3.0 — Coming soon</div>
					<p class="page-tag">FAC Chat + FAC Cloud</p>
					<h2>Chat, inside Frappe</h2>
					<p class="page-sub">
						A chat widget on every Desk page and a full-screen SPA at
						<code>/copilot</code> — streaming, memory, RAG and workflows on one managed
						FAC Cloud subscription. Ships disabled by default.
					</p>
					<div class="mini-post">
						<div class="mini-row"><span class="mono dim">widget</span><span>every Desk page</span></div>
						<div class="mini-row"><span class="mono dim">/copilot</span><span>full-screen chat</span></div>
						<div class="mini-row"><span class="mono dim">billing</span><span>one subscription, all models</span></div>
					</div>
					<a class="link-ink" :href="withBase('/fac-chat/')">Read about FAC Chat →</a>
				</div>
			</div>
		</section>

		<!-- ================= THE TOOL INDEX: 24 entries, one journal ================= -->
		<section class="sheet index">
			<div class="index-inner">
				<p class="overline">24 tools, one journal</p>
				<h2 class="index-title">Everything posts through the same ledger.</h2>
				<p class="index-sub">
					Every call runs as the signed-in user, inside their roles and permissions,
					and lands in the <b>Assistant Audit Log</b>. Writes can require approval.
				</p>
				<div class="tool-grid">
					<div class="tool-group">
						<p class="tool-head">Read</p>
						<div v-for="(t, i) in READ_TOOLS" :key="t" class="tool-row">
							<span class="tool-no mono">{{ String(i + 1).padStart(2, '0') }}</span>
							<span class="tool-name mono">{{ t }}</span>
						</div>
					</div>
					<div class="tool-col2">
						<div class="tool-group">
							<p class="tool-head">Write</p>
							<div v-for="(t, i) in WRITE_TOOLS" :key="t" class="tool-row">
								<span class="tool-no mono">{{ String(i + 13).padStart(2, '0') }}</span>
								<span class="tool-name mono">{{ t }}</span>
								<span class="approve-tag">requires approval</span>
							</div>
						</div>
						<div class="tool-group">
							<p class="tool-head">Reports &amp; analysis</p>
							<div v-for="(t, i) in ANALYZE_TOOLS" :key="t" class="tool-row">
								<span class="tool-no mono">{{ String(i + 18).padStart(2, '0') }}</span>
								<span class="tool-name mono">{{ t }}</span>
							</div>
						</div>
						<div class="tool-group">
							<p class="tool-head">Dashboards</p>
							<div v-for="(t, i) in DASH_TOOLS" :key="t" class="tool-row">
								<span class="tool-no mono">{{ String(i + 23).padStart(2, '0') }}</span>
								<span class="tool-name mono">{{ t }}</span>
								<span class="approve-tag">requires approval</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ================= TRUST: how the books stay clean ================= -->
		<section class="trust">
			<p class="overline">How the books stay clean</p>
			<div class="trust-row">
				<div class="trust-cell">
					<p class="trust-k mono">OAuth 2.0 + PKCE</p>
					<p>The model signs in as a real user — Authorization Code flow, dynamic client registration, automatic token refresh.</p>
				</div>
				<div class="trust-cell">
					<p class="trust-k mono">Your roles, your rows</p>
					<p>Every tool call is scoped to that user's Frappe and ERPNext permissions. Can't see it in the Desk? Can't see it through FAC.</p>
				</div>
				<div class="trust-cell">
					<p class="trust-k mono">Assistant Audit Log</p>
					<p>Caller, tool, arguments, result — every call posted to the record. The books balance because nothing skips the journal.</p>
				</div>
			</div>
			<div class="cloud-line">
				<span>Hosted on Frappe Cloud? One-click install from the marketplace, free of cost.</span>
				<a class="link-ink" href="https://cloud.frappe.io/marketplace/apps/frappe_assistant_core">Install on Frappe Cloud →</a>
			</div>
		</section>

		<!-- ================= COLOPHON: countersigned ================= -->
		<footer class="colophon">
			<div class="colo-inner">
				<div class="countersign" aria-hidden="true">
					<svg class="sig sig-small" viewBox="345 88 665 604">
						<g fill="currentColor">
							<path :d="SIG_PATH" />
						</g>
					</svg>
				</div>
				<div class="colo-text">
					<p class="colo-line">Signed, <b>Paul Clinton</b> — free and open source under AGPL-3.0. © 2025–present.</p>
					<p class="colo-links">
						<a href="https://github.com/buildswithpaul/Frappe_Assistant_Core">GitHub</a>
						<a href="https://github.com/buildswithpaul/Frappe_Assistant_Core/issues">Report an issue</a>
						<a href="https://github.com/sponsors/buildswithpaul">Sponsor</a>
						<a :href="withBase('/getting-started/installation')">Docs</a>
					</p>
				</div>
			</div>
		</footer>
	</div>
</template>

<style scoped>
/* ============ THE SHEET ============ */
.fac-landing {
	--maxw: 1180px;
	--rhythm: 44px;
	font-family: var(--fac-body);
	color: var(--fac-ink-text);
	background: var(--fac-paper);
	overflow: hidden;
}
.mono { font-family: var(--fac-mono); font-variant-numeric: tabular-nums; }
.dim { color: color-mix(in srgb, var(--fac-ink-text) 45%, transparent); font-size: 0.85em; }
.overline {
	font-family: var(--fac-body); font-weight: 600; font-size: 11px;
	text-transform: uppercase; letter-spacing: 0.08em;
	color: var(--fac-ink); margin: 0 0 18px;
}
.link-ink { color: var(--fac-ink); font-weight: 600; text-decoration: none; font-size: 15px; }
.link-ink:hover { text-decoration: underline; text-underline-offset: 3px; }

/* Ruled sheet sections */
.sheet {
	position: relative;
	background:
		repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--rhythm) - 1px), var(--fac-rule) calc(var(--rhythm) - 1px), var(--fac-rule) var(--rhythm));
	background-position: 0 12px;
}
.margin-rule {
	position: absolute; top: 0; bottom: 0; left: 72px; width: 1px;
	background: var(--fac-red); opacity: 0.4;
}

/* ============ HERO ============ */
.hero { padding: clamp(40px, 6vw, 88px) 24px clamp(48px, 7vw, 96px); }
.hero-grid {
	max-width: var(--maxw); margin: 0 auto;
	display: grid; grid-template-columns: 58fr 42fr;
	gap: clamp(36px, 5vw, 64px); align-items: start;
	padding-left: 48px;
}
.hero-grid > * { min-width: 0; }

/* The signature — hero-scale, drawn on load */
.sig-wrap { width: clamp(240px, 30vw, 400px); margin-bottom: -18px; }
.sig { display: block; width: 100%; height: auto; color: var(--fac-ink); }
.dark .sig-wrap .sig { filter: drop-shadow(0 0 12px rgba(9, 129, 227, 0.35)); }
.sig-wipe {
	transform-box: fill-box; transform-origin: left center;
	animation: sig-write 1.4s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both;
}
@keyframes sig-write { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.sig-caption {
	font-family: var(--fac-mono); font-size: 12px; text-transform: uppercase;
	letter-spacing: 0.06em; color: color-mix(in srgb, var(--fac-ink-text) 55%, transparent);
	margin: 0 0 26px;
}

.headline {
	font-family: var(--fac-display); font-weight: 700;
	font-size: clamp(2.4rem, 5.2vw, 4.2rem);
	line-height: 1.05; letter-spacing: -0.025em;
	margin: 0 0 24px;
}
.hl-line { display: block; }
.hl-2 { font-size: 0.52em; font-weight: 500; margin-top: 16px; letter-spacing: -0.015em; }
.hl-2 em { font-style: normal; color: var(--fac-ink); }
.flourish {
	display: block; width: min(420px, 78%); height: 14px;
	color: var(--fac-ink); margin-top: 6px;
}
.flourish path {
	stroke-dasharray: 1; stroke-dashoffset: 0;
	animation: flourish-draw 0.6s cubic-bezier(0.65, 0, 0.35, 1) 1.5s both;
}
@keyframes flourish-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }

.sub {
	font-size: 17.5px; line-height: 1.65; max-width: 52ch;
	color: color-mix(in srgb, var(--fac-ink-text) 78%, transparent);
	margin: 0 0 30px;
}
.cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; }
.btn-ink, .btn-ghost {
	display: inline-flex; align-items: center;
	font-weight: 600; font-size: 15px; padding: 13px 24px;
	border-radius: 4px; text-decoration: none;
	transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
.btn-ink { background: var(--fac-ink); color: #fff; }
.btn-ink:hover { background: var(--fac-ink-deep); }
.dark .btn-ink { color: #0c141e; }
.btn-ghost { border: 1.5px solid var(--fac-ink-text); color: var(--fac-ink-text); }
.btn-ghost:hover { border-color: var(--fac-ink); color: var(--fac-ink); }

/* The Posting card — a slip on the sheet */
.posting {
	background: var(--fac-card);
	border: 2px solid var(--fac-ink-text);
	border-radius: 4px;
	padding: 18px 20px 16px;
	font-size: 14px;
	margin-top: var(--rhythm);
}
.post-head, .post-row, .post-total {
	display: grid; grid-template-columns: 46px 1fr 44px 92px;
	gap: 10px; align-items: baseline; padding: 8px 2px;
}
.post-head {
	font-weight: 600; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em;
	color: color-mix(in srgb, var(--fac-ink-text) 55%, transparent);
	border-bottom: 1px solid var(--fac-rule);
}
.num { text-align: right; }
.post-query {
	font-family: var(--fac-mono); font-size: 13px; padding: 12px 2px 10px;
	border-bottom: 1px solid var(--fac-rule); color: var(--fac-ink);
	white-space: nowrap; overflow: hidden;
}
.q-text {
	display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap;
	max-width: 100%;
	animation: type 1.1s steps(30, end) 0.6s both;
}
@keyframes type { from { max-width: 0; } to { max-width: 100%; } }
.caret {
	display: inline-block; width: 7px; height: 15px; margin-left: 2px;
	background: var(--fac-ink); vertical-align: text-bottom;
	animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }
.post-row { border-bottom: 1px solid var(--fac-rule); animation: post 0.45s ease-out both; }
.post-row .mono { font-size: 12.5px; }
.post-row span:nth-child(2) .mono.dim { display: block; font-size: 11px; margin-top: 1px; }
.r1 { animation-delay: 1.8s; } .r2 { animation-delay: 1.92s; }
.r3 { animation-delay: 2.04s; } .r4 { animation-delay: 2.16s; }
@keyframes post { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.post-total {
	font-weight: 600; border-top: 3px double var(--fac-ink-text);
	margin-top: -1px; animation: post 0.45s ease-out 2.3s both;
}
.stamp {
	margin: 14px 2px 2px; padding: 7px 10px;
	border: 1.5px solid var(--fac-ink); border-radius: 6px;
	color: var(--fac-ink);
	font-family: var(--fac-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em;
	transform: rotate(-3deg); transform-origin: left center;
	width: fit-content; max-width: 100%;
	animation: stamp-thump 0.2s ease-out 2.5s both;
}
@keyframes stamp-thump { from { opacity: 0; transform: rotate(-3deg) scale(1.15); } to { opacity: 1; transform: rotate(-3deg) scale(1); } }

/* ============ TWO WAYS: facing pages ============ */
.spread { padding: clamp(48px, 7vw, 88px) 24px; max-width: calc(var(--maxw) + 48px); margin: 0 auto; }
.pages {
	display: grid; grid-template-columns: 1fr 1fr;
	border: 1px solid var(--fac-rule); border-radius: 4px;
	background: var(--fac-card);
	position: relative;
}
/* grid items default to min-width:auto — an unbreakable <pre> line would
   blow the column past the viewport instead of scrolling inside it */
.pages > * { min-width: 0; }
.pages::before {
	/* the gutter between facing pages — doubled feint rule */
	content: ''; position: absolute; top: 0; bottom: 0; left: 50%;
	width: 3px; border-left: 1px solid var(--fac-rule); border-right: 1px solid var(--fac-rule);
	transform: translateX(-50%);
}
.page { padding: clamp(28px, 4vw, 44px); position: relative; }
.page h2 {
	font-family: var(--fac-display); font-size: clamp(22px, 2.4vw, 28px);
	letter-spacing: -0.02em; margin: 6px 0 12px; border: 0; padding: 0;
}
.page-tag {
	font-family: var(--fac-mono); font-size: 11.5px; text-transform: uppercase;
	letter-spacing: 0.06em; color: var(--fac-ink); margin: 0;
}
.page-sub { color: color-mix(in srgb, var(--fac-ink-text) 75%, transparent); font-size: 15px; line-height: 1.65; margin: 0 0 18px; }
.config { border: 1px solid var(--fac-rule); border-radius: 4px; overflow: hidden; margin-bottom: 18px; }
.config-name {
	font-family: var(--fac-mono); font-size: 11px; padding: 7px 12px;
	background: var(--fac-fill); border-bottom: 1px solid var(--fac-rule);
	color: color-mix(in srgb, var(--fac-ink-text) 60%, transparent);
}
.config pre {
	margin: 0; padding: 14px; font-family: var(--fac-mono); font-size: 12.5px;
	line-height: 1.6; color: var(--fac-ink-text); overflow-x: auto;
}
.soon-stamp {
	position: absolute; top: 22px; right: 20px;
	border: 1.5px solid var(--fac-red); color: var(--fac-red); border-radius: 6px;
	font-family: var(--fac-mono); font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em;
	padding: 6px 10px; transform: rotate(3deg);
	opacity: 0.85;
}
.mini-post { border-top: 1px solid var(--fac-rule); margin-bottom: 18px; }
.mini-row {
	display: grid; grid-template-columns: 90px 1fr; gap: 12px;
	padding: 9px 2px; font-size: 14px; border-bottom: 1px solid var(--fac-rule);
}
.mini-row .mono { font-size: 12.5px; }

/* ============ TOOL INDEX ============ */
.index { padding: clamp(48px, 7vw, 88px) 24px; }
.index-inner { max-width: var(--maxw); margin: 0 auto; padding-left: 48px; }
.index-title {
	font-family: var(--fac-display); font-size: clamp(26px, 3.2vw, 38px);
	letter-spacing: -0.025em; margin: 0 0 10px; border: 0; padding: 0;
}
.index-sub { color: color-mix(in srgb, var(--fac-ink-text) 75%, transparent); max-width: 60ch; margin: 0 0 34px; font-size: 15.5px; line-height: 1.6; }
.tool-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 clamp(24px, 4vw, 56px); }
.tool-grid > * { min-width: 0; }
.tool-group { margin-bottom: 22px; }
.tool-head {
	font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em;
	color: color-mix(in srgb, var(--fac-ink-text) 55%, transparent);
	border-bottom: 1px solid var(--fac-ink-text);
	padding-bottom: 6px; margin: 0 0 4px;
}
.tool-row {
	display: flex; align-items: baseline; gap: 12px;
	padding: 7px 6px; border-bottom: 1px solid var(--fac-rule);
	transition: background 0.15s ease;
}
.tool-row:hover { background: var(--fac-fill); }
.tool-no { font-size: 11px; color: color-mix(in srgb, var(--fac-ink-text) 40%, transparent); }
.tool-name { font-size: 13.5px; }
.approve-tag {
	margin-left: auto; font-family: var(--fac-mono); font-size: 9.5px;
	text-transform: uppercase; letter-spacing: 0.04em;
	border: 1px solid var(--fac-ink); color: var(--fac-ink);
	border-radius: 4px; padding: 2px 7px; white-space: nowrap;
}

/* ============ TRUST ============ */
.trust { padding: clamp(48px, 7vw, 80px) 24px; max-width: calc(var(--maxw) + 48px); margin: 0 auto; }
.trust-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.trust-cell {
	border: 1px solid var(--fac-rule); border-radius: 4px;
	background: var(--fac-card); padding: 24px;
}
.trust-k { font-size: 13px; font-weight: 600; color: var(--fac-ink); margin: 0 0 10px; }
.trust-cell p:last-child { margin: 0; font-size: 14.5px; line-height: 1.65; color: color-mix(in srgb, var(--fac-ink-text) 78%, transparent); }
.cloud-line {
	display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
	border-top: 1px solid var(--fac-rule); margin-top: 28px; padding-top: 22px;
	font-size: 15px; color: color-mix(in srgb, var(--fac-ink-text) 80%, transparent);
}

/* ============ COLOPHON ============ */
.colophon { border-top: 1px solid var(--fac-rule); background: var(--vp-c-bg-alt); padding: 36px 24px; }
.colo-inner {
	max-width: var(--maxw); margin: 0 auto;
	display: flex; align-items: center; gap: 26px; flex-wrap: wrap;
}
.countersign { width: 96px; flex: none; color: var(--fac-ink); }
.sig-small { width: 100%; height: auto; display: block; }
/* hover-replay: the countersign re-signs itself */
.countersign:hover .sig-small path {
	animation: resign 0.7s cubic-bezier(0.65, 0, 0.35, 1);
}
@keyframes resign { from { opacity: 0; } 30% { opacity: 1; } }
.colo-line { margin: 0 0 6px; font-size: 15px; }
.colo-links { display: flex; gap: 18px; margin: 0; flex-wrap: wrap; }
.colo-links a { color: color-mix(in srgb, var(--fac-ink-text) 60%, transparent); text-decoration: none; font-size: 13.5px; }
.colo-links a:hover { color: var(--fac-ink); }

/* ============ RESPONSIVE ============ */
@media (max-width: 960px) {
	.hero-grid { grid-template-columns: 1fr; padding-left: 24px; }
	.index-inner { padding-left: 24px; }
	.margin-rule { left: 40px; }
	.pages { grid-template-columns: 1fr; }
	.pages::before { display: none; }
	.page-right { border-top: 1px solid var(--fac-rule); }
	.trust-row { grid-template-columns: 1fr; }
	.tool-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
	.fac-landing { --rhythm: 0px; }
	.soon-stamp {
		position: static; display: inline-block;
		margin-bottom: 12px; transform: rotate(-1.5deg);
	}
	.tool-row { flex-wrap: wrap; }
	.approve-tag { margin-left: 34px; }
	.sheet { background: var(--fac-paper); }
	.margin-rule { display: none; }
	.cta-row .btn-ink, .cta-row .btn-ghost { flex: 1 1 auto; justify-content: center; }
	.stamp { transform: none; }
	@keyframes stamp-thump { from { opacity: 0; transform: scale(1.15); } to { opacity: 1; transform: scale(1); } }
	.post-head, .post-row, .post-total { grid-template-columns: 1fr 44px 88px; }
	.post-head span:first-child, .post-row .mono.dim:first-child, .post-total span:first-child { display: none; }
	/* let the question wrap instead of typing — nowrap would force overflow */
	.post-query { white-space: normal; }
	.q-text { animation: none; max-width: none; white-space: normal; display: inline; }
}

/* ============ REDUCED MOTION: the completed state ============ */
@media (prefers-reduced-motion: reduce) {
	.sig-wipe, .flourish path, .q-text, .post-row, .post-total, .stamp { animation: none !important; }
	
	/* the blinking caret is the one permitted motion */
}
</style>
