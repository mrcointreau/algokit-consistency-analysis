/**
 * Options for the greet function
 */
export interface GreetingOptions {
  /** The name to greet */
  name: string
  /** Whether to use formal greeting */
  formal?: boolean
}

/**
 * Returns a greeting message
 *
 * @param options - The greeting options
 * @returns A greeting string
 *
 * @example
 * ```typescript
 * import { greet } from '@algorandfoundation/typescript-library-reference-implementation'
 *
 * const message = greet({ name: 'World' })
 * console.log(message) // Hello, World!
 * ```
 */
export function greet(options: GreetingOptions): string {
  const { name, formal = false } = options

  if (formal) {
    return `Good day, ${name}. How do you do?`
  }

  return `Hello, ${name}!`
}
