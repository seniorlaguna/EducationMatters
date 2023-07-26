export function getIcon(type: string | undefined) {
    switch (type) {
      case "DOC":
        return "📖"
      case "WEB":
        return "💻"
      default:
        return ""
    }
  }