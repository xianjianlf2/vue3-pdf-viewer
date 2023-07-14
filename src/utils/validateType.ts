export function isBase64(src: string) {
  const reg = /^data:.*;base64,/
  return reg.test(src)
}
