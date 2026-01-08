import { describe, expect, it } from 'vitest'
import { greet } from './example'

describe('greet', () => {
  it('returns informal greeting by default', () => {
    const result = greet({ name: 'World' })
    expect(result).toBe('Hello, World!')
  })

  it('returns formal greeting when formal option is true', () => {
    const result = greet({ name: 'Alice', formal: true })
    expect(result).toBe('Good day, Alice. How do you do?')
  })

  it('returns informal greeting when formal option is false', () => {
    const result = greet({ name: 'Bob', formal: false })
    expect(result).toBe('Hello, Bob!')
  })
})
