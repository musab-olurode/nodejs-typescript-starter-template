export default {
	testEnvironment: 'jest-environment-node',
	clearMocks: true,
	coverageProvider: 'v8',
	moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
	// roots: ['<rootDir>/src'],
	testMatch: ['**/tests/**/?(*.)+(spec|test).[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	globalTeardown: './tests/teardownTests.ts',
};
