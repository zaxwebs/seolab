const API = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";

const websites = [
	{
		name: "Northstar Analytics",
		domain: "northstar.example",
		market: "US B2B SaaS",
		description: "Analytics platform focused on SaaS reporting and revenue operations.",
	},
	{
		name: "Lumen Coffee",
		domain: "lumencoffee.example",
		market: "US Local",
		description: "Specialty coffee shop with local SEO pages and subscription content.",
	},
	{
		name: "Arc Legal",
		domain: "arclegal.example",
		market: "UK Legal",
		description: "Boutique legal services website with practice-area content.",
	},
	{
		name: "Orbit Homes",
		domain: "orbithomes.example",
		market: "Australia Real Estate",
		description: "Real estate marketplace with suburb guides and listing templates.",
	},
	{
		name: "BrightPath Learning",
		domain: "brightpath.example",
		market: "India EdTech",
		description: "Online learning platform with course, blog, and comparison pages.",
	},
];

const experimentTemplates = [
	{
		title: "Rewrite title tags for buying intent",
		experiment_type: "Title tag change",
		status: "Won",
		primary_metric: "Organic CTR",
		secondary_metrics: ["Organic clicks", "Impressions", "Average position"],
		tags: ["ctr", "title-tags", "commercial-intent"],
	},
	{
		title: "Expand thin informational content",
		experiment_type: "Content expansion",
		status: "Running",
		primary_metric: "Organic clicks",
		secondary_metrics: ["Impressions", "Engaged sessions"],
		tags: ["content", "refresh", "informational"],
	},
	{
		title: "Add internal links from supporting pages",
		experiment_type: "Internal linking",
		status: "Monitoring",
		primary_metric: "Organic clicks",
		secondary_metrics: ["Average position", "Indexed pages"],
		tags: ["internal-linking", "cluster", "authority"],
	},
];

function daysAgo(days) {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date.toISOString().slice(0, 10);
}

function daysFromNow(days) {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date.toISOString().slice(0, 10);
}

async function request(path, options = {}) {
	const response = await fetch(`${API}${path}`, {
		headers: { "content-type": "application/json", ...(options.headers || {}) },
		...options,
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`${response.status} ${response.statusText}: ${body}`);
	}
	return response.json();
}

async function createRecord(collection, payload) {
	return request(`/api/collections/${collection}/records`, {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

async function main() {
	const createdWebsites = [];

	for (const website of websites) {
		const created = await createRecord("websites", { ...website, archived: false });
		createdWebsites.push(created);
	}

	for (const [siteIndex, website] of createdWebsites.entries()) {
		for (const [experimentIndex, template] of experimentTemplates.entries()) {
			const startOffset = 35 - siteIndex * 3 - experimentIndex * 4;
			const targetSlug = template.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
			const experiment = await createRecord("experiments", {
				website: website.id,
				title: `${template.title} - ${website.name}`,
				hypothesis: `If I ${template.title.toLowerCase()} on ${website.name}'s priority pages, then ${template.primary_metric.toLowerCase()} should improve within 28 days because the pages will better match searcher intent and crawl paths.`,
				experiment_type: template.experiment_type,
				status: template.status,
				target_urls: [
					`https://${website.domain}/${targetSlug}`,
					`https://${website.domain}/${targetSlug}-guide`,
				],
				control_urls: [`https://${website.domain}/control-${experimentIndex + 1}`],
				primary_metric: template.primary_metric,
				secondary_metrics: template.secondary_metrics,
				start_date: daysAgo(startOffset),
				expected_review_date: template.status === "Won" ? daysAgo(5) : daysFromNow(8 + experimentIndex),
				end_date: template.status === "Won" ? daysAgo(4) : null,
				baseline_notes: `Baseline captured before launch. Priority URLs had stable rankings and no major technical changes in the prior two weeks.`,
				implementation_notes: `Implemented changes for ${website.name} and left control URL unchanged.`,
				result_summary: template.status === "Won" ? "CTR and clicks improved while control pages stayed broadly flat." : "",
				confidence: template.status === "Won" ? "Medium" : null,
				learnings: template.status === "Won" ? "Intent-aligned copy helped earn more clicks without requiring large ranking movement." : "",
				next_action: template.status === "Won" ? "Roll out to a second batch of pages with a fresh control group." : "Keep monitoring until review date.",
				tags: template.tags,
			});

			await createRecord("experiment_logs", {
				experiment: experiment.id,
				log_type: "Implementation",
				log_date: daysAgo(startOffset),
				note: `Launched the ${template.experiment_type.toLowerCase()} experiment on ${website.name}. Documented target and control URLs before making changes.`,
				metric_snapshot: {
					"Organic clicks": String(180 + siteIndex * 24 + experimentIndex * 18),
					CTR: `${(2.1 + siteIndex * 0.2 + experimentIndex * 0.15).toFixed(1)}%`,
					"Average position": String((7.8 - experimentIndex * 0.5).toFixed(1)),
				},
				source_url: `https://${website.domain}/`,
			});

			await createRecord("experiment_logs", {
				experiment: experiment.id,
				log_type: template.status === "Won" ? "Decision" : "Observation",
				log_date: template.status === "Won" ? daysAgo(4) : daysAgo(Math.max(2, startOffset - 14)),
				note:
					template.status === "Won"
						? "Reviewed the experiment and marked it as won. The target URLs improved more clearly than controls."
						: "Early movement is visible, but not enough time has passed to close the loop. Continue monitoring.",
				metric_snapshot: {
					"Organic clicks": String(220 + siteIndex * 28 + experimentIndex * 21),
					CTR: `${(2.8 + siteIndex * 0.2 + experimentIndex * 0.2).toFixed(1)}%`,
				},
				source_url: `https://${website.domain}/`,
			});
		}
	}

	console.log(`Seeded ${createdWebsites.length} websites, ${createdWebsites.length * 3} experiments, and ${createdWebsites.length * 6} logs.`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
