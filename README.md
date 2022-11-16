# Jira Create
Create new issue

> ##### Only supports Jira Cloud. Does not support Jira Server (hosted)

## Usage

> ##### Note: this action requires [Jira Login Action](https://github.com/marketplace/actions/jira-login)

```yaml
- name: Create
  id: create
  uses: atlassian/gajira-create@master
  with:
    project: GA
    issuetype: Build
    summary: Build completed for ${{ github.repository }}
    description: Compare branch
    fields: '{"customfield_10171": "test"}'

- name: Log created issue
  run: echo "Issue ${{ steps.create.outputs.issue }} was created"
```

----
## Action Spec:

### Environment variables
- None

### Inputs
- `project` (required) - Key of the project
- `issuetype` (required) - Type of the issue to be created. Example: 'Incident'
- `summary` (required) - Issue summary
- `description` - Issue description
- `fields` - Additional fields in JSON format

### Outputs
- `issue` - Key of the newly created issue

### Reads fields from config file at $HOME/jira/config.yml
- `project`
- `issuetype`
- `summary`
- `description`

### Writes fields to config file at $HOME/jira/config.yml
- `issue` - a key of a newly created issue

### Writes fields to CLI config file at $HOME/.jira.d/config.yml
- `issue` - a key of a newly created issue