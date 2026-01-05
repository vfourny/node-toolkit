import { describe, expect, it } from 'vitest'

import { kebabCase, lowerCaseFirstLetter } from '@/index.js'

describe('kebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(kebabCase('helloWorld')).toBe('hello-world')
    expect(kebabCase('myVariableName')).toBe('my-variable-name')
  })

  it('should convert PascalCase to kebab-case', () => {
    expect(kebabCase('HelloWorld')).toBe('hello-world')
    expect(kebabCase('MyComponentName')).toBe('my-component-name')
  })

  it('should convert snake_case to kebab-case', () => {
    expect(kebabCase('hello_world')).toBe('hello-world')
    expect(kebabCase('my_variable_name')).toBe('my-variable-name')
  })

  it('should convert spaces to kebab-case', () => {
    expect(kebabCase('hello world')).toBe('hello-world')
    expect(kebabCase('my variable name')).toBe('my-variable-name')
  })

  it('should handle mixed formats', () => {
    expect(kebabCase('helloWorld_test')).toBe('hello-world-test')
    expect(kebabCase('MyComponent Name')).toBe('my-component-name')
  })

  it('should handle already kebab-case strings', () => {
    expect(kebabCase('hello-world')).toBe('hello-world')
    expect(kebabCase('my-variable-name')).toBe('my-variable-name')
  })

  it('should handle single words', () => {
    expect(kebabCase('hello')).toBe('hello')
    expect(kebabCase('Hello')).toBe('hello')
  })

  it('should handle empty strings', () => {
    expect(kebabCase('')).toBe('')
  })

  it('should handle consecutive uppercase letters', () => {
    // Note: The current implementation treats consecutive uppercase letters as a single word
    expect(kebabCase('XMLParser')).toBe('xmlparser')
    expect(kebabCase('HTTPSConnection')).toBe('httpsconnection')
  })

  it('should handle multiple underscores or spaces', () => {
    expect(kebabCase('hello__world')).toBe('hello-world')
    expect(kebabCase('hello  world')).toBe('hello-world')
  })
})

describe('lowerCaseFirstLetter', () => {
  it('should convert first letter to lowercase', () => {
    expect(lowerCaseFirstLetter('Hello')).toBe('hello')
    expect(lowerCaseFirstLetter('World')).toBe('world')
  })

  it('should handle strings that already start with lowercase', () => {
    expect(lowerCaseFirstLetter('hello')).toBe('hello')
    expect(lowerCaseFirstLetter('world')).toBe('world')
  })

  it('should handle single character strings', () => {
    expect(lowerCaseFirstLetter('H')).toBe('h')
    expect(lowerCaseFirstLetter('h')).toBe('h')
  })

  it('should handle empty strings', () => {
    expect(lowerCaseFirstLetter('')).toBe('')
  })

  it('should only affect the first letter', () => {
    expect(lowerCaseFirstLetter('HelloWorld')).toBe('helloWorld')
    expect(lowerCaseFirstLetter('HELLO')).toBe('hELLO')
  })

  it('should handle strings with special characters', () => {
    expect(lowerCaseFirstLetter('Hello-World')).toBe('hello-World')
    expect(lowerCaseFirstLetter('Hello_world')).toBe('hello_world')
  })

  it('should handle strings with numbers', () => {
    expect(lowerCaseFirstLetter('Hello123')).toBe('hello123')
    expect(lowerCaseFirstLetter('123Hello')).toBe('123Hello')
  })
})
