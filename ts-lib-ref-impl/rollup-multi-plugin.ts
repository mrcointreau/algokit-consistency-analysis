import type FastGlob from 'fast-glob'
import fastGlob from 'fast-glob'
import path from 'path'
import type { Plugin } from 'rollup'

// This plugin enables multiple entry points and preserves directory structure in dist

const pluginName = 'rollup-plugin-multi-input'

const isString = (value: unknown): value is string => typeof value === 'string'

const defaultOptions = {
  relative: `src${path.sep}`,
}

const outputFileName = (filePath: string) => filePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/')

export type MultiInputOptions = {
  glob?: FastGlob.Options
  relative?: string
  transformOutputPath?: (path: string, fileName: string) => string
}

export const multiInput = (options: MultiInputOptions = defaultOptions): Plugin => {
  const { glob: globOptions, relative = defaultOptions.relative, transformOutputPath } = options
  return {
    name: pluginName,
    options(conf) {
      const inputs = [conf.input].flat()
      const globs = inputs.filter(isString)
      const others = inputs.filter((value) => !isString(value))
      const normalizedGlobs = globs.map((glob) => glob.replace(/\\/g, '/'))
      const entries = fastGlob.sync(normalizedGlobs, globOptions).map((name) => {
        const filePath = path.relative(relative, name)
        const isRelative = !filePath.startsWith(`..${path.sep}`)
        const relativeFilePath = isRelative ? filePath : path.relative(`.${path.sep}`, name)
        if (transformOutputPath) {
          return [outputFileName(transformOutputPath(relativeFilePath, name)), name]
        }
        return [outputFileName(relativeFilePath), name]
      })
      const input = Object.assign({}, Object.fromEntries(entries), ...others)
      return {
        ...conf,
        input,
      }
    },
  }
}
