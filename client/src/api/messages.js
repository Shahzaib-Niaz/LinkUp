const API_URL = "http://localhost:5000/api/messages";

export async function getMessages(
  conversationId,
  token
) {
  const response = await fetch(
    `${API_URL}/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch messages"
    );
  }

  return data;
}