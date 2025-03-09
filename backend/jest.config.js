export default {
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!src/infrastructure/**/*.js'
    ],
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    watchman: false, 
    clearMocks: true,
    verbose: true,
};