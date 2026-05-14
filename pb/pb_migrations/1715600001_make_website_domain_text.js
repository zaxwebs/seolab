migrate((app) => {
	const collection = app.findCollectionByNameOrId("websites");
	collection.fields.removeByName("domain");
	collection.fields.add(
		new TextField({
			name: "domain",
			required: true,
			min: 1,
			max: 180,
		}),
	);
	app.save(collection);
}, (app) => {
	const collection = app.findCollectionByNameOrId("websites");
	collection.fields.removeByName("domain");
	collection.fields.add(
		new URLField({
			name: "domain",
			required: true,
		}),
	);
	app.save(collection);
});
