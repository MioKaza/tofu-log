const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const pak = require('../package.json');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// Ensure React/React Native (and everything else) resolves from the example app,
// even when importing the library source from the workspace root.
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (_target, name) => {
      if (typeof name !== 'string') return undefined;
      return path.join(projectRoot, 'node_modules', name);
    },
  }
);

module.exports = config;
