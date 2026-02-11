import fs from 'fs';
import path from 'path';
import type { Framework } from '../types.js';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export async function detectFramework(rootDir: string): Promise<Framework> {
  const packageJsonPath = path.join(rootDir, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('No package.json found. Is this a JavaScript/TypeScript project?');
  }

  const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  // Check for frameworks in order of specificity
  if (allDeps['next']) {
    return 'nextjs';
  }

  if (allDeps['nuxt'] || allDeps['nuxt3']) {
    return 'nuxt';
  }

  if (allDeps['vue']) {
    return 'vue';
  }

  if (allDeps['@angular/core']) {
    return 'angular';
  }

  if (allDeps['react']) {
    return 'react';
  }

  throw new Error(
    'Could not detect framework. Supported frameworks: Next.js, React, Vue, Nuxt, Angular'
  );
}

export function getFrameworkDisplayName(framework: Framework): string {
  const names: Record<Framework, string> = {
    nextjs: 'Next.js',
    react: 'React',
    vue: 'Vue.js',
    nuxt: 'Nuxt',
    angular: 'Angular',
    unknown: 'Unknown',
  };
  return names[framework] || framework;
}
