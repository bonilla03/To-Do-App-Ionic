import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const envFile = resolve(projectRoot, '.env.local');
const environmentsDir = resolve(projectRoot, 'src', 'environments');
const devOutput = resolve(environmentsDir, 'environment.local.ts');
const prodOutput = resolve(environmentsDir, 'environment.local.prod.ts');

function parseEnvFile(contents) {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf('=');

      if (separatorIndex === -1) {
        return acc;
      }

      const key = line.slice(0, separatorIndex).trim();
      const rawValue = line.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/g, '');

      acc[key] = value;
      return acc;
    }, {});
}

function toNumber(value, fallbackValue) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
}

function escapeString(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildEnvironmentFile({ production, values, fetchInterval }) {
  return `export const environment = {
  production: ${production},
  firebase: {
    apiKey: '${escapeString(values.FIREBASE_API_KEY)}',
    authDomain: '${escapeString(values.FIREBASE_AUTH_DOMAIN)}',
    projectId: '${escapeString(values.FIREBASE_PROJECT_ID)}',
    storageBucket: '${escapeString(values.FIREBASE_STORAGE_BUCKET)}',
    messagingSenderId: '${escapeString(values.FIREBASE_MESSAGING_SENDER_ID)}',
    appId: '${escapeString(values.FIREBASE_APP_ID)}',
    measurementId: '${escapeString(values.FIREBASE_MEASUREMENT_ID)}',
  },
  remoteConfig: {
    minimumFetchIntervalMillis: ${fetchInterval},
  },
};
`;
}

const values = existsSync(envFile)
  ? parseEnvFile(readFileSync(envFile, 'utf8'))
  : {};

mkdirSync(environmentsDir, { recursive: true });

writeFileSync(
  devOutput,
  buildEnvironmentFile({
    production: false,
    values,
    fetchInterval: toNumber(values.REMOTE_CONFIG_MIN_FETCH_DEV, 60_000),
  }),
  'utf8'
);

writeFileSync(
  prodOutput,
  buildEnvironmentFile({
    production: true,
    values,
    fetchInterval: toNumber(values.REMOTE_CONFIG_MIN_FETCH_PROD, 3_600_000),
  }),
  'utf8'
);

if (existsSync(envFile)) {
  console.log(`Local environment files generated from ${envFile}`);
} else {
  console.warn(`No .env.local file found at ${envFile}. Generated empty local environment files.`);
}
