
const nock = require('nock')
const Action = require('../action')

const auth = { email: 'test@email.com', token: 'tokentoken' }
const baseUrl = 'https://example.com'
const config = {
  ...auth,
  baseUrl,
}

const projectKey = 'TESTPROJECT'
const issuetypeName = 'TESTISSUETYPE'

const { mocks } = require('./helpers')

test(`Should create issue with customfield`, async () => {
  const action = new Action({
    argv: {
      project: projectKey,
      issuetype: issuetypeName,
      summary: 'This is summary ref/head/blah',
      description: 'This is description ref/head/blah',
      fields: '{"customfield_10171" : "test"}',
    },
    config,
  })

  const createMetaRequest = nock(baseUrl)
    .get('/rest/api/2/issue/createmeta')
    .query({
      expand: 'projects.issuetypes.fields',
      projectKeys: 'TESTPROJECT',
      issuetypeNames: 'TESTISSUETYPE',
    })
    .reply(200, mocks.jira.responses.createMeta)

  let createIssueRequestBody = {}
  const createIssueRequest = nock(baseUrl)
    .post('/rest/api/2/issue')
    .reply(200, (url, body) => {
      createIssueRequestBody = body

      return {
        key: 'TESTPROJECT-2',
      }
    })

  await createMetaRequest
  await createIssueRequest

  const result = await action.execute()

  expect(createIssueRequestBody).toEqual({
    fields: {
      project: {
        key: projectKey,
      },
      issuetype: {
        name: issuetypeName,
      },
      summary: 'This is summary ref/head/blah',
      description: 'This is description ref/head/blah',
      customfield_10171: 'test',
    },
  })

  expect(result).toEqual({
    issue: 'TESTPROJECT-2',
  })
})

test(`Should create simple issue without customfield`, async () => {
  const action = new Action({
    argv: {
      project: projectKey,
      issuetype: issuetypeName,
      summary: 'This is summary ref/head/blah',
      description: 'This is description ref/head/blah',
    },
    config,
  })

  const createMetaRequest = nock(baseUrl)
    .get('/rest/api/2/issue/createmeta')
    .query({
      expand: 'projects.issuetypes.fields',
      projectKeys: 'TESTPROJECT',
      issuetypeNames: 'TESTISSUETYPE',
    })
    .reply(200, mocks.jira.responses.createMeta)

  let createIssueRequestBody = {}
  const createIssueRequest = nock(baseUrl)
    .post('/rest/api/2/issue')
    .reply(200, (url, body) => {
      createIssueRequestBody = body

      return {
        key: 'TESTPROJECT-2',
      }
    })

  await createMetaRequest
  await createIssueRequest

  const result = await action.execute()

  expect(createIssueRequestBody).toEqual({
    fields: {
      project: {
        key: projectKey,
      },
      issuetype: {
        name: issuetypeName,
      },
      summary: 'This is summary ref/head/blah',
      description: 'This is description ref/head/blah',
    },
  })

  expect(result).toEqual({
    issue: 'TESTPROJECT-2',
  })
})
