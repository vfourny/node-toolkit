export const kebabCase = (string: string) =>
  string
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()

export const lowerCaseFirstLetter = (string: string) =>
  string.charAt(0).toLowerCase() + string.slice(1)

export default {
  kebabCase,
  lowerCaseFirstLetter,
}
