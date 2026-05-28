module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/src/__tests__/fileMock.cjs',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '<rootDir>/src/**/*.(test|spec).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/tests/',
    '<rootDir>/test-results/',
    '<rootDir>/playwright-report/',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/jest.setup.cjs'],
};

