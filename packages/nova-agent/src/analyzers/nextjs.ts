import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import * as parser from '@babel/parser';
import traverseModule from '@babel/traverse';
import type {
  Framework,
  AnalysisResult,
  PageInfo,
  ComponentInfo,
  DiscoveredFeature,
  FeatureType,
} from '../types.js';

// Handle ESM/CJS interop for @babel/traverse
const traverse = (traverseModule as any).default || traverseModule;

export async function analyzeNextJs(
  rootDir: string,
  framework: Framework
): Promise<AnalysisResult> {
  // Check if this is a React Router project (has App.jsx with react-router-dom)
  const appFile = await findAppFile(rootDir);
  if (appFile && framework === 'react') {
    const appContent = fs.readFileSync(appFile, 'utf-8');
    if (appContent.includes('react-router-dom') || appContent.includes('react-router')) {
      return analyzeReactRouter(rootDir, appFile);
    }
  }

  const pages: PageInfo[] = [];
  const features: DiscoveredFeature[] = [];

  // Discover pages - App Router
  const appRouterPages = await glob('app/**/page.{tsx,jsx,ts,js}', {
    cwd: rootDir,
    ignore: ['**/node_modules/**', '**/.next/**'],
  });

  // Discover pages - Pages Router
  const pagesRouterPages = await glob('pages/**/*.{tsx,jsx,ts,js}', {
    cwd: rootDir,
    ignore: ['**/node_modules/**', '**/.next/**', 'pages/_*.{tsx,jsx,ts,js}', 'pages/api/**'],
  });

  // Process App Router pages
  for (const pagePath of appRouterPages) {
    const fullPath = path.join(rootDir, pagePath);
    const route = pagePathToRoute(pagePath, 'app');
    const featureId = routeToFeatureId(route);
    const name = featureIdToName(featureId);

    const pageInfo: PageInfo = {
      route,
      filePath: pagePath,
      featureId,
      name,
      components: [],
    };

    // Analyze the page component
    const componentInfo = await analyzeComponent(fullPath);
    pageInfo.components.push(componentInfo);

    pages.push(pageInfo);

    // Create page feature
    features.push({
      featureId,
      name,
      type: 'page',
      codeLocations: [{ filePath: pagePath }],
      tags: ['page', 'app-router'],
      interactions: componentInfo.interactions,
    });

    // Create child features from components
    const childFeatures = extractChildFeatures(componentInfo, featureId, pagePath);
    features.push(...childFeatures);
  }

  // Process Pages Router pages
  for (const pagePath of pagesRouterPages) {
    const fullPath = path.join(rootDir, pagePath);
    const route = pagePathToRoute(pagePath, 'pages');
    const featureId = routeToFeatureId(route);
    const name = featureIdToName(featureId);

    const pageInfo: PageInfo = {
      route,
      filePath: pagePath,
      featureId,
      name,
      components: [],
    };

    const componentInfo = await analyzeComponent(fullPath);
    pageInfo.components.push(componentInfo);

    pages.push(pageInfo);

    // Create page feature (skip if already from app router)
    if (!features.some((f) => f.featureId === featureId)) {
      features.push({
        featureId,
        name,
        type: 'page',
        codeLocations: [{ filePath: pagePath }],
        tags: ['page', 'pages-router'],
        interactions: componentInfo.interactions,
      });

      const childFeatures = extractChildFeatures(componentInfo, featureId, pagePath);
      features.push(...childFeatures);
    }
  }

  // Calculate stats
  const stats = {
    totalPages: pages.length,
    totalComponents: pages.reduce((sum, p) => sum + p.components.length, 0),
    totalFeatures: features.length,
    totalInteractions: features.reduce((sum, f) => sum + f.interactions.length, 0),
  };

  return {
    framework,
    rootDir,
    pages,
    features,
    stats,
  };
}

async function analyzeComponent(filePath: string): Promise<ComponentInfo> {
  const code = fs.readFileSync(filePath, 'utf-8');

  const info: ComponentInfo = {
    name: path.basename(filePath, path.extname(filePath)),
    filePath,
    exports: [],
    hooks: [],
    interactions: [],
    childComponents: [],
    hasForm: false,
  };

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      // Find exported function/component names
      ExportDefaultDeclaration(nodePath) {
        const decl = nodePath.node.declaration;
        if (decl.type === 'FunctionDeclaration' && decl.id) {
          info.name = decl.id.name;
          info.exports.push(decl.id.name);
        } else if (decl.type === 'Identifier') {
          info.name = decl.name;
          info.exports.push(decl.name);
        }
      },

      ExportNamedDeclaration(nodePath) {
        const decl = nodePath.node.declaration;
        if (decl?.type === 'FunctionDeclaration' && decl.id) {
          info.exports.push(decl.id.name);
        }
      },

      // Find hooks
      CallExpression(nodePath) {
        const callee = nodePath.node.callee;
        if (callee.type === 'Identifier' && callee.name.startsWith('use')) {
          if (!info.hooks.includes(callee.name)) {
            info.hooks.push(callee.name);
          }
        }
      },

      // Find interaction handlers (onClick, onSubmit, etc.)
      JSXAttribute(nodePath) {
        const name = nodePath.node.name;
        if (name.type === 'JSXIdentifier') {
          const attrName = name.name;
          if (attrName.startsWith('on') && attrName.length > 2) {
            const interaction = attrName.replace(/^on/, '').toLowerCase();
            if (!info.interactions.includes(interaction)) {
              info.interactions.push(interaction);
            }
          }
        }
      },

      // Find child components (capitalized JSX elements)
      JSXOpeningElement(nodePath) {
        const name = nodePath.node.name;
        if (name.type === 'JSXIdentifier') {
          const componentName = name.name;
          // Check if it's a component (starts with uppercase)
          if (/^[A-Z]/.test(componentName) && !info.childComponents.includes(componentName)) {
            info.childComponents.push(componentName);
          }
          // Check for form elements
          if (componentName.toLowerCase() === 'form') {
            info.hasForm = true;
          }
        }
      },

      // Check for <form> HTML element
      JSXElement(nodePath) {
        const opening = nodePath.node.openingElement;
        if (opening.name.type === 'JSXIdentifier' && opening.name.name === 'form') {
          info.hasForm = true;
        }
      },
    });
  } catch (error) {
    // Parsing failed, return basic info
    console.warn(`Warning: Could not parse ${filePath}`);
  }

  return info;
}

function extractChildFeatures(
  component: ComponentInfo,
  parentFeatureId: string,
  parentFilePath: string
): DiscoveredFeature[] {
  const features: DiscoveredFeature[] = [];

  // If has form, create a form feature
  if (component.hasForm || component.interactions.includes('submit')) {
    features.push({
      featureId: `${parentFeatureId}-form`,
      name: `${featureIdToName(parentFeatureId)} Form`,
      type: 'form',
      parentFeatureId,
      codeLocations: [{ filePath: parentFilePath }],
      tags: ['form'],
      interactions: component.interactions.filter((i) => ['submit', 'change', 'input'].includes(i)),
    });
  }

  // Create features for significant child components
  const significantComponents = component.childComponents.filter((name) =>
    // Filter for meaningful component names
    /^(Form|Modal|Dialog|Card|Section|Header|Footer|Nav|Menu|Button|Input|Table|List|Grid)/i.test(
      name
    )
  );

  for (const childName of significantComponents.slice(0, 5)) {
    const childFeatureId = `${parentFeatureId}-${camelToKebab(childName)}`;
    const type = inferFeatureType(childName);

    features.push({
      featureId: childFeatureId,
      name: splitCamelCase(childName),
      type,
      parentFeatureId,
      codeLocations: [{ filePath: parentFilePath }],
      tags: [type],
      interactions: [],
    });
  }

  return features;
}

function pagePathToRoute(pagePath: string, router: 'app' | 'pages'): string {
  let route = pagePath;

  if (router === 'app') {
    // app/checkout/page.tsx → /checkout
    route = route.replace(/^app/, '').replace(/\/page\.(tsx|jsx|ts|js)$/, '');
  } else {
    // pages/checkout/index.tsx → /checkout
    // pages/checkout.tsx → /checkout
    route = route
      .replace(/^pages/, '')
      .replace(/\/index\.(tsx|jsx|ts|js)$/, '')
      .replace(/\.(tsx|jsx|ts|js)$/, '');
  }

  // Handle dynamic routes: [id] → :id
  route = route.replace(/\[([^\]]+)\]/g, ':$1');

  // Ensure starts with /
  if (!route.startsWith('/')) {
    route = '/' + route;
  }

  // Handle root
  if (route === '/') {
    return '/';
  }

  return route;
}

function routeToFeatureId(route: string): string {
  if (route === '/') {
    return 'home';
  }

  return route
    .replace(/^\//, '') // Remove leading slash
    .replace(/\//g, '-') // Replace slashes with dashes
    .replace(/:/g, '') // Remove : from dynamic segments
    .replace(/-+/g, '-') // Collapse multiple dashes
    .toLowerCase();
}

function featureIdToName(featureId: string): string {
  if (featureId === 'home') {
    return 'Home Page';
  }

  return featureId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + ' Page';
}

function camelToKebab(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function splitCamelCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

function inferFeatureType(componentName: string): FeatureType {
  const lower = componentName.toLowerCase();

  if (/form/i.test(lower)) return 'form';
  if (/modal|dialog/i.test(lower)) return 'modal';
  if (/section|hero|header|footer/i.test(lower)) return 'section';
  if (/button|action|submit/i.test(lower)) return 'action';

  return 'component';
}

// ============================================================================
// REACT ROUTER SUPPORT
// ============================================================================

async function findAppFile(rootDir: string): Promise<string | null> {
  const patterns = [
    'src/App.jsx',
    'src/App.tsx',
    'src/App.js',
    'App.jsx',
    'App.tsx',
    'App.js',
  ];

  for (const pattern of patterns) {
    const fullPath = path.join(rootDir, pattern);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

interface RouteInfo {
  path: string;
  componentName: string;
  importPath: string;
}

async function analyzeReactRouter(
  rootDir: string,
  appFilePath: string
): Promise<AnalysisResult> {
  const pages: PageInfo[] = [];
  const features: DiscoveredFeature[] = [];

  // Parse App.jsx to extract routes and imports
  const appCode = fs.readFileSync(appFilePath, 'utf-8');
  const routes = extractRoutesFromApp(appCode);
  const imports = extractImportsFromApp(appCode, rootDir, appFilePath);

  for (const route of routes) {
    // Find the actual file path from imports
    const importInfo = imports.get(route.componentName);
    const filePath = importInfo?.resolvedPath || `src/pages/${route.componentName}.jsx`;
    const fullPath = path.join(rootDir, filePath);

    const featureId = routeToFeatureId(route.path);
    const name = featureIdToName(featureId);

    const pageInfo: PageInfo = {
      route: route.path,
      filePath,
      featureId,
      name,
      components: [],
    };

    // Analyze the page component if it exists
    if (fs.existsSync(fullPath)) {
      const componentInfo = await analyzeComponent(fullPath);
      pageInfo.components.push(componentInfo);

      features.push({
        featureId,
        name,
        type: 'page',
        codeLocations: [{ filePath }],
        tags: ['page', 'react-router'],
        interactions: componentInfo.interactions,
      });

      // Create child features from components
      const childFeatures = extractChildFeatures(componentInfo, featureId, filePath);
      features.push(...childFeatures);
    } else {
      // File doesn't exist but route is defined
      features.push({
        featureId,
        name,
        type: 'page',
        codeLocations: [{ filePath }],
        tags: ['page', 'react-router'],
        interactions: [],
      });
    }

    pages.push(pageInfo);
  }

  // Also scan components directory for significant components
  const componentFiles = await glob('src/components/**/*.{tsx,jsx}', {
    cwd: rootDir,
    ignore: ['**/node_modules/**'],
  });

  for (const compPath of componentFiles) {
    const fullPath = path.join(rootDir, compPath);
    const componentInfo = await analyzeComponent(fullPath);

    // Check if this is a significant component with interactions
    if (componentInfo.interactions.length > 0 || componentInfo.hasForm) {
      const parentFeatureId = inferParentFeatureId(compPath, features);
      const compFeatureId = generateComponentFeatureId(compPath, componentInfo.name);

      // Avoid duplicates
      if (!features.some((f) => f.featureId === compFeatureId)) {
        features.push({
          featureId: compFeatureId,
          name: splitCamelCase(componentInfo.name),
          type: inferFeatureType(componentInfo.name),
          parentFeatureId,
          codeLocations: [{ filePath: compPath }],
          tags: ['component'],
          interactions: componentInfo.interactions,
        });
      }
    }
  }

  const stats = {
    totalPages: pages.length,
    totalComponents: pages.reduce((sum, p) => sum + p.components.length, 0),
    totalFeatures: features.length,
    totalInteractions: features.reduce((sum, f) => sum + f.interactions.length, 0),
  };

  return {
    framework: 'react',
    rootDir,
    pages,
    features,
    stats,
  };
}

function extractRoutesFromApp(code: string): RouteInfo[] {
  const routes: RouteInfo[] = [];
  const wrapperComponents = ['ProtectedRoute', 'AdminRoute', 'AuthRoute', 'PrivateRoute', 'PublicRoute'];

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      JSXElement(nodePath) {
        const opening = nodePath.node.openingElement;
        if (opening.name.type !== 'JSXIdentifier' || opening.name.name !== 'Route') {
          return;
        }

        let routePath = '';
        let componentName = '';

        for (const attr of opening.attributes) {
          if (attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXIdentifier') {
            continue;
          }

          if (attr.name.name === 'path' && attr.value?.type === 'StringLiteral') {
            routePath = attr.value.value;
          }

          if (attr.name.name === 'element' && attr.value?.type === 'JSXExpressionContainer') {
            const expr = attr.value.expression;
            if (expr.type === 'JSXElement') {
              // Get the element name
              const elemName = expr.openingElement.name;
              if (elemName.type === 'JSXIdentifier') {
                const name = elemName.name;

                // Check if this is a wrapper component
                if (wrapperComponents.includes(name)) {
                  // Look for the child component inside the wrapper
                  const children = expr.children;
                  for (const child of children) {
                    if (child.type === 'JSXElement') {
                      const childName = child.openingElement.name;
                      if (childName.type === 'JSXIdentifier') {
                        componentName = childName.name;
                        break;
                      }
                    }
                  }
                } else {
                  componentName = name;
                }
              }
            }
          }
        }

        if (routePath && componentName) {
          routes.push({ path: routePath, componentName, importPath: '' });
        }
      },
    });
  } catch (error) {
    console.warn('Warning: Could not parse App file for routes:', error);
  }

  return routes;
}

function extractImportsFromApp(
  code: string,
  rootDir: string,
  appFilePath: string
): Map<string, { importPath: string; resolvedPath: string }> {
  const imports = new Map<string, { importPath: string; resolvedPath: string }>();
  const appDir = path.dirname(appFilePath);

  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      ImportDeclaration(nodePath) {
        const source = nodePath.node.source.value;

        for (const specifier of nodePath.node.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportSpecifier') {
            const localName = specifier.local.name;

            // Resolve the import path
            let resolvedPath = source;
            if (source.startsWith('./') || source.startsWith('../')) {
              resolvedPath = path.relative(
                rootDir,
                path.resolve(appDir, source)
              );

              // Try to find the actual file
              const extensions = ['.jsx', '.tsx', '.js', '.ts'];
              for (const ext of extensions) {
                const fullPath = path.join(rootDir, resolvedPath + ext);
                if (fs.existsSync(fullPath)) {
                  resolvedPath = resolvedPath + ext;
                  break;
                }
                const indexPath = path.join(rootDir, resolvedPath, `index${ext}`);
                if (fs.existsSync(indexPath)) {
                  resolvedPath = path.join(resolvedPath, `index${ext}`);
                  break;
                }
              }
            }

            imports.set(localName, { importPath: source, resolvedPath });
          }
        }
      },
    });
  } catch (error) {
    console.warn('Warning: Could not parse imports from App file');
  }

  return imports;
}

function inferParentFeatureId(
  componentPath: string,
  existingFeatures: DiscoveredFeature[]
): string | undefined {
  // Try to match component path to a page feature
  // e.g., src/components/admin/ContentList.jsx -> admin
  const parts = componentPath.split('/');

  for (let i = parts.length - 1; i >= 0; i--) {
    const segment = parts[i].toLowerCase();
    const matchingFeature = existingFeatures.find(
      (f) => f.type === 'page' && f.featureId.includes(segment)
    );
    if (matchingFeature) {
      return matchingFeature.featureId;
    }
  }

  return undefined;
}

function generateComponentFeatureId(filePath: string, componentName: string): string {
  // Extract meaningful path segments
  const parts = filePath
    .replace(/^src\/components\//, '')
    .replace(/\.(jsx|tsx|js|ts)$/, '')
    .split('/');

  // Use the folder structure + component name
  const segments = parts.filter((p) => !['index', componentName.toLowerCase()].includes(p.toLowerCase()));

  if (segments.length > 0) {
    return [...segments, camelToKebab(componentName)].join('-').toLowerCase();
  }

  return camelToKebab(componentName);
}
