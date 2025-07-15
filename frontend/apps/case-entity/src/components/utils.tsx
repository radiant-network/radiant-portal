export function getBadgeAffectedCodeColor(code: string) {
  switch (code) {
    case "affected":
      return "red"
    default:
      return "secondary"
  }
}
