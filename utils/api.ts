export async function apiFetch(url: string, options: RequestInit = {}) {
	const accessToken = localStorage.getItem("accessToken");

	const headers = {
		"Content-Type": "application/json",
		...options.headers,
		...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
	};

	let res = await fetch(url, { ...options, headers, credentials: "include" });

	if (res.status === 401) {
		const refreshRes = await fetch("/api/refresh", {
			method: "POST",
			credentials: "include",
		});

		if (!refreshRes.ok) {

			localStorage.removeItem("accessToken");
			throw new Error("Session expired. Please login again.");
		}

		const refreshData = await refreshRes.json();
		localStorage.setItem("accessToken", refreshData.accessToken);

		const retryHeaders = {
			...headers,
			"Authorization": `Bearer ${refreshData.accessToken}`,
		};
		res = await fetch(url, { ...options, headers: retryHeaders, credentials: "include" });
	}

	return res;
}
