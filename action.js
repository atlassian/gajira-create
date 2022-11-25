const Jira = require('./common/net/Jira')

module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const { argv } = this
    const projectKey = argv.project
		const name = argv.name

    // map custom fields
    const { projects } = await this.Jira.getCreateMeta({
      projectKeys: projectKey,
    })

    if (projects.length === 0) {
      console.error(`project '${projectKey}' not found`)

      return
    }

		const [project] = projects

		const payload = {
			project: projectKey,
			projectId: project.id,
			name,
		}

    const version = await this.Jira.createVersion(payload)

    return { release: version.id }
  }

  transformFields (fieldsString) {
    const fields = JSON.parse(fieldsString)

    return Object.keys(fields).map(fieldKey => ({
      key: fieldKey,
      value: fields[fieldKey],
    }))
  }
}
