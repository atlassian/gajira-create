module.exports = {
    "testEnvironment": "node",
    "testPathIgnorePatterns": [
        "helpers/",
        "node_modules/"
    ],
    transformIgnorePatterns: [
        "node_modules/"
    ],
    "coveragePathIgnorePatterns": [
        "node_modules/"
    ],
    "coverageReporters": [
        "lcov",
        "text",
        "clover"
    ],
    "coverageDirectory": "../test-results"
}