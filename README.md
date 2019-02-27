# Jira Create
Create new issue

For examples on how to use this, check out the [gajira-demo](https://github.com/atlassian/gajira-demo) repository
> ##### Only supports Jira Cloud. Does not support Jira Server (hosted)

## Usage

> ##### Note: this action requires [Jira Login Action](https://github.com/marketplace/actions/jira-login)

```
action "Jira Create" {
  uses = "atlassian/gajira-create@master"
  needs = ["Jira Login"]
  args = "--project=GA --issuetype=Build --summary=\"Build completed for $GITHUB_REPOSITORY\" --description=\"[Compare branch|{{event.compare}}] \" "
}
```

----
## Action Spec:

### Environment variables
- None

### Arguments
- `--project=<project key>` - Key of the project
- `--issuetype=<issue type>` - Type of the issue to be created. Example: 'Incident'
- `--summary=<text>` - Issue summary
- `--description=<text>` - Issue description
- `--fields.customfield_<number>.id=<custom field id>` - ID of the custom field. Example `--fields.customfield_10021.id=10001`

### Reads fields from config file at $HOME/jira/config.yml
- `project`
- `issuetype`
- `summary`
- `description`

### Writes fields to config file at $HOME/jira/config.yml
- `issue` - a key of a newly created issue

### Writes fields to CLI config file at $HOME/.jira.d/config.yml
- `issue` - a key of a newly created issue