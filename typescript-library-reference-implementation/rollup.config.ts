import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import MagicString from 'magic-string'
import type { LogLevel, LogOrStringHandler, Plugin, RollupLog, RollupOptions } from 'rollup'
import pkg from './package.json' with { type: 'json' }
import { multiInput } from './rollup-multi-plugin'

/**
 * Plugin to normalize ESM output by replacing __filename and __dirname
 * with ESM-compatible equivalents using import.meta.url
 */
const normaliseEsmOutput = (): Plugin => {
  const CJSFilenameRegex = /__filename/g
  const CJSDirnameRegex = /__dirname/g
  const filenameReplacement = "await import('url').then((url) => url.fileURLToPath(import.meta.url))"
  const dirnameReplacement = `await import('path').then(async (path) => path.dirname(${filenameReplacement}))`

  return {
    name: 'normaliseEsmOutput',
    renderChunk(code, _chunk, opts) {
      if (opts.format === 'es') {
        if (!CJSDirnameRegex.test(code) && !CJSFilenameRegex.test(code)) {
          return null
        }
        const s = new MagicString(code.replace(CJSDirnameRegex, dirnameReplacement).replace(CJSFilenameRegex, filenameReplacement))
        return {
          code: s.toString(),
          ...(opts.sourcemap !== false ? { map: s.generateMap({ hires: true }) } : {}),
        }
      }
      return null
    },
  }
}

const config: RollupOptions = {
  input: ['src/index.ts'],
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].js',
      preserveModules: true,
      sourcemap: true,
      dynamicImportInCjs: false,
    },
    {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      sourcemap: true,
    },
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    normaliseEsmOutput(),
    multiInput(),
  ],
  external: [...Object.keys(pkg.devDependencies || {})],
  onLog(level: LogLevel, log: RollupLog, handler: LogOrStringHandler) {
    if (log.code === 'CIRCULAR_DEPENDENCY') {
      handler('error', log)
    } else {
      handler(level, log)
    }
  },
}

export default config
