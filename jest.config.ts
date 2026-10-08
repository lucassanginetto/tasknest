import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';

// Path aliases (e.g. the ones added by `nest g library`) live in tsconfig.json,
// so they are read from there instead of being duplicated here.
const { config: tsconfig } = ts.readConfigFile(
  './tsconfig.json',
  ts.sys.readFile,
);
const paths = tsconfig?.compilerOptions?.paths ?? {};

// Nest v12 ships as ESM-only (no CommonJS build), so the suites have to run as
// real ES modules. ts-jest would otherwise emit CJS (this project has no
// "type": "module", since `nest build` targets CommonJS) and the resulting
// `require()` of @nestjs/* fails.
const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { useESM: true, tsconfig: 'tsconfig.spec.json' }],
  },
  moduleNameMapper: {
    // Generated sources (e.g. the Prisma client) use ESM-style relative
    // specifiers such as `./internal/class.js` that point at `.ts` files on
    // disk. `nest build` emits real `.js` next to them, Jest does not.
    // Anchored to relative specifiers so package imports are left untouched.
    '^(\\.{1,2}/.*)\\.js$': '$1',
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  },
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    'libs/**/*.(t|j)s',
    'apps/**/*.(t|j)s',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

export default config;
