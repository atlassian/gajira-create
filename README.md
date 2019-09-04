# Jira Create
Create new issue

For examples on how to use this, check out the [gajira-demo](https://github.com/atlassian/gajira-demo) repository
> ##### Only supports Jira Cloud. Does not support Jira Server (hosted)

## Usage

> ##### Note: this action requires [Jira Login Action](https://github.com/marketplace/actions/jira-login)

```yaml
- name: Login
  uses: atlassian/gajira-login@master
  env:
    JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
    JIRA_USER_EMAIL: ${{ secrets.JIRA_USER_EMAIL }}
    JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}

- name: Create
  id: create
  uses: ./atlassian/gajira-create
  with:
    project: GA
    issuetype: Build
    summary: |
      Build completed for ${{ github.repository }}
    description: |
      Compare branch

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