/**
 * Resolver hook so Node's type-stripping can load the app's `.ts` data files
 * directly: it teaches Node the two things Vite normally handles — the `@/`
 * alias, and extensionless relative imports.
 *
 * Used only by `scripts/generate-seed.mjs`; it never runs in the browser build.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const srcDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src')

/** Adds `.ts`/`.tsx`, or an `/index.ts`, when the bare path does not exist. */
function withExtension(filePath) {
  if (existsSync(filePath) && path.extname(filePath)) return filePath
  for (const candidate of [
    `${filePath}.ts`,
    `${filePath}.tsx`,
    path.join(filePath, 'index.ts'),
    path.join(filePath, 'index.tsx'),
  ]) {
    if (existsSync(candidate)) return candidate
  }
  return filePath
}

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const resolved = withExtension(path.join(srcDir, specifier.slice(2)))
    return { url: pathToFileURL(resolved).href, shortCircuit: true }
  }

  if (specifier.startsWith('.') && context.parentURL) {
    const parentDir = path.dirname(fileURLToPath(context.parentURL))
    const resolved = withExtension(path.resolve(parentDir, specifier))
    if (existsSync(resolved)) {
      return { url: pathToFileURL(resolved).href, shortCircuit: true }
    }
  }

  return nextResolve(specifier, context)
}
