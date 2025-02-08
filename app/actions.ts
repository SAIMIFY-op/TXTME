"use server"

export async function sendMessage(formData: FormData) {
  const apiKey = "2469805"
  const phoneNumber = "923478018040"
  const name = formData.get("name") as string
  const message = formData.get("message") as string
  const fullMessage = `New message from: ${name}\n${message}`

  try {
    const response = await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodeURIComponent(fullMessage)}&apikey=${apiKey}`,
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send message: ${response.status} ${response.statusText}. ${errorText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

