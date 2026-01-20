export async function apiFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      localStorage.removeItem("accessToken");
      throw new Error("Session expired");
    }

    const refreshData = await refreshRes.json();
    localStorage.setItem("accessToken", refreshData.accessToken);

    res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${refreshData.accessToken}`,
      },
      credentials: "include",
    });
  }

  return res;
}
