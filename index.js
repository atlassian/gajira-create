const fs = require("fs");
const YAML = require("yaml");
const core = require("@actions/core");

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`;
const configPath = `${process.env.HOME}/jira/config.yml`;
const Action = require("./action");

// eslint-disable-next-line import/no-dynamic-require
const githubEvent = '' //require(process.env.GITHUB_EVENT_PATH);
const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

async function exec() {
	try {
		const result = await new Action({
			githubEvent,
			argv: parseArgs(),
			config,
		}).execute();

		if (result) {
			// result.issue is the issue key
			console.log(`Created issue: ${result.issue}`);
			console.log(`Saving ${result.issue} to ${cliConfigPath}`);
			console.log(`Saving ${result.issue} to ${configPath}`);

			// Expose created issue's key as an output
			core.setOutput("issue", result.issue);

			const yamledResult = YAML.stringify(result);
			const extendedConfig = Object.assign({}, config, result);

			fs.writeFileSync(configPath, YAML.stringify(extendedConfig));

			return fs.appendFileSync(cliConfigPath, yamledResult);
		}

		console.log("Failed to create issue.");
		process.exit(78);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

function parseArgs() {
	return {
	  project: core.getInput('project'),
	  issuetype: core.getInput('issuetype'),
	  summary: core.getInput('summary'),
	  description: core.getInput('description'),
	  fields: core.getInput('fields'),
	}
}

exec();
