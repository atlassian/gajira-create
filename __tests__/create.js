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

test(`Should create version`, async () => {
  const action = new Action({
    argv: {
      project: projectKey,
			name: "test",
    },
    config,
  })

  const createMetaRequest = nock(baseUrl)
    .get('/rest/api/2/issue/createmeta')
    .query({
      projectKeys: 'TESTPROJECT',
    })
    .reply(200, mocks.jira.responses.createMeta)

  let createIssueRequestBody = {}
  const createVersionRequest = nock(baseUrl)
    .post('/rest/api/2/version')
    .reply(200, (url, body) => {
      createIssueRequestBody = body

      return {
        id: 1234,
      }
    })

  await createMetaRequest
  await createVersionRequest

  const result = await action.execute()

  expect(createIssueRequestBody).toEqual({
		"name": "test",
		"project": "TESTPROJECT"
	})

  expect(result).toEqual({
		release: 1234,
  })
})
