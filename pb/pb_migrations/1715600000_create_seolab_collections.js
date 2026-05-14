migrate((app) => {
	const websites = new Collection({
		name: "websites",
		type: "base",
		listRule: "",
		viewRule: "",
		createRule: "",
		updateRule: "",
		deleteRule: "",
		fields: [
			{
				name: "name",
				type: "text",
				required: true,
				min: 1,
				max: 160,
			},
			{
				name: "domain",
				type: "text",
				required: true,
				min: 1,
				max: 180,
			},
			{
				name: "description",
				type: "editor",
				required: false,
			},
			{
				name: "market",
				type: "text",
				required: false,
				max: 120,
			},
			{
				name: "archived",
				type: "bool",
				required: false,
			},
		],
		indexes: ["CREATE INDEX idx_websites_archived ON websites (archived)"],
	});

	app.save(websites);

	const experiments = new Collection({
		name: "experiments",
		type: "base",
		listRule: "",
		viewRule: "",
		createRule: "",
		updateRule: "",
		deleteRule: "",
		fields: [
			{
				name: "website",
				type: "relation",
				required: true,
				collectionId: websites.id,
				cascadeDelete: true,
				maxSelect: 1,
				displayFields: ["name", "domain"],
			},
			{
				name: "title",
				type: "text",
				required: true,
				min: 1,
				max: 220,
			},
			{
				name: "hypothesis",
				type: "editor",
				required: true,
			},
			{
				name: "experiment_type",
				type: "select",
				required: true,
				maxSelect: 1,
				values: [
					"Title tag change",
					"Meta description change",
					"Content expansion",
					"Content pruning",
					"Internal linking",
					"Schema markup",
					"Page template change",
					"Programmatic page generation",
					"Technical SEO change",
					"CTR optimization",
					"Search intent rewrite",
					"Other",
				],
			},
			{
				name: "status",
				type: "select",
				required: true,
				maxSelect: 1,
				values: ["Planned", "Running", "Monitoring", "Won", "Lost", "Inconclusive", "Abandoned"],
			},
			{ name: "target_urls", type: "json", required: false },
			{ name: "control_urls", type: "json", required: false },
			{
				name: "primary_metric",
				type: "text",
				required: true,
				min: 1,
				max: 160,
			},
			{ name: "secondary_metrics", type: "json", required: false },
			{ name: "start_date", type: "date", required: false },
			{ name: "expected_review_date", type: "date", required: false },
			{ name: "end_date", type: "date", required: false },
			{ name: "baseline_notes", type: "editor", required: false },
			{ name: "implementation_notes", type: "editor", required: false },
			{ name: "result_summary", type: "editor", required: false },
			{
				name: "confidence",
				type: "select",
				required: false,
				maxSelect: 1,
				values: ["Low", "Medium", "High"],
			},
			{ name: "learnings", type: "editor", required: false },
			{ name: "next_action", type: "editor", required: false },
			{ name: "tags", type: "json", required: false },
		],
		indexes: [
			"CREATE INDEX idx_experiments_website ON experiments (website)",
			"CREATE INDEX idx_experiments_status ON experiments (status)",
			"CREATE INDEX idx_experiments_review ON experiments (expected_review_date)",
		],
	});

	app.save(experiments);

	const logs = new Collection({
		name: "experiment_logs",
		type: "base",
		listRule: "",
		viewRule: "",
		createRule: "",
		updateRule: "",
		deleteRule: "",
		fields: [
			{
				name: "experiment",
				type: "relation",
				required: true,
				collectionId: experiments.id,
				cascadeDelete: true,
				maxSelect: 1,
				displayFields: ["title", "status"],
			},
			{
				name: "log_type",
				type: "select",
				required: true,
				maxSelect: 1,
				values: ["Implementation", "Observation", "Metric update", "Issue", "External event", "Decision", "Note"],
			},
			{ name: "log_date", type: "date", required: true },
			{ name: "note", type: "editor", required: true },
			{ name: "metric_snapshot", type: "json", required: false },
			{
				name: "source_url",
				type: "url",
				required: false,
			},
		],
		indexes: [
			"CREATE INDEX idx_logs_experiment ON experiment_logs (experiment)",
			"CREATE INDEX idx_logs_date ON experiment_logs (log_date)",
		],
	});

	app.save(logs);
}, (app) => {
	for (const name of ["experiment_logs", "experiments", "websites"]) {
		const collection = app.findCollectionByNameOrId(name);
		if (collection) {
			app.delete(collection);
		}
	}
});
