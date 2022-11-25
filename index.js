const fs = require('fs')
const YAML = require('yaml')
const core = require('@actions/core')

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`
const configPath = `${process.env.HOME}/jira/config.yml`
const Action = require('./action')

// eslint-disable-next-line import/no-dynamic-require
const githubEvent = require(process.env.GITHUB_EVENT_PATH)
const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

async function exec () {
  try {
    const result = await new Action({
      githubEvent,
      argv: parseArgs(),
      config,
    }).execute()

    if (result) {
      // result.release is the release key
      console.log(`Created release: ${result.release}`)
      console.log(`Saving ${result.release} to ${cliConfigPath}`)
      console.log(`Saving ${result.release} to ${configPath}`)

      // Expose created release's key as an output
      core.setOutput('release', result.release)

      const yamledResult = YAML.stringify(result)
      const extendedConfig = Object.assign({}, config, result)

      fs.writeFileSync(configPath, YAML.stringify(extendedConfig))

      return fs.appendFileSync(cliConfigPath, yamledResult)
    }

    console.log('Failed to create release.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

function parseArgs () {
  return {
    project: core.getInput('project'),
		name: core.getInput('name'),
  }
}

exec()
