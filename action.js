const Jira = require("./common/net/Jira");
const AgileClient = require("./common/net/AgileClient");

module.exports = class {
	constructor({ githubEvent, argv, config }) {
		this.Jira = new Jira({
			baseUrl: config.baseUrl,
			token: config.token,
			email: config.email,
		});
		this.agileClient = new AgileClient(
			config.baseUrl,
			config.token,
			config.email
		);

		this.config = config;
		this.argv = argv;
		this.githubEvent = githubEvent;
	}

	async execute() {
		const { argv } = this;
		const projectKey = argv.project;
		const issuetypeName = argv.issuetype;
		const activeSprint =
			argv.boardId && (await this.agileClient.getActiveSprint(argv.boardId));

		// map custom fields
		const { projects } = await this.Jira.getCreateMeta({
			expand: "projects.issuetypes.fields",
			projectKeys: projectKey,
			issuetypeNames: issuetypeName,
		});

		if (projects.length === 0) {
			console.error(`project '${projectKey}' not found`);

			return;
		}

		const [project] = projects;

		if (project.issuetypes.length === 0) {
			console.error(`issuetype '${issuetypeName}' not found`);

			return;
		}

		let providedFields = [
			{
				key: "project",
				value: {
					key: projectKey,
				},
			},
			{
				key: "issuetype",
				value: {
					name: issuetypeName,
				},
			},
			{
				key: "summary",
				value: argv.summary,
			},
		];

		if (activeSprint) {
			providedFields.push({
				key: "customfield_10020",
				value: activeSprint.id,
			});
		}

		if (argv.description) {
			providedFields.push({
				key: "description",
				value: argv.description,
			});
		}

		if (argv.fields) {
			providedFields = [
				...providedFields,
				...this.transformFields(argv.fields),
			];
		}

		const payload = providedFields.reduce(
			(acc, field) => {
				acc.fields[field.key] = field.value;

				return acc;
			},
			{
				fields: {},
			}
		);

		const issue = await this.Jira.createIssue(payload);

		return { issue: issue.key };
	}

	transformFields(fieldsString) {
		const fields = JSON.parse(fieldsString);

		return Object.keys(fields).map((fieldKey) => ({
			key: fieldKey,
			value: fields[fieldKey],
		}));
	}
};
