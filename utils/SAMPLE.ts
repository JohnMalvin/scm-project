import { apiFetch } from "./api";

export async function fetchProfile() { 
  try {
    const res = await apiFetch("/api/v1/profile", { method: "GET" });
    const data = await res.json();
    console.log(data);

  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}


export async function createPost() {
  try {
    const res = await apiFetch("/api/v1/posts", {
      method: "POST",
      body: JSON.stringify({ title: "Hello", content: "World" }),
    });
    const data = await res.json();
    console.log(data);

  } catch (error) {
    console.error("Error creating post:", error);
  }
}
