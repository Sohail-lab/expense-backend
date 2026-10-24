export function loginSuccessDetails(
  message: string,
  sessionId: string,
  expiresAt: Date,
  userId: number,
  email?: string
) {
  return {
    message: message,
    sessionId: sessionId,
    expiresAt: expiresAt,
    userId: userId,
    ...(email && { email: email })
  };
}

export function showMessage(message: string) {
    return {
        message: message,
    }
}
