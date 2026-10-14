const API_URL = "http://localhost:5000/api/users";

export async function getUsers(token) {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType =
    response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(
      `Server returned an unexpected response (${response.status})`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
}