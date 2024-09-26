import { headers } from "next/headers";

export function getHeader() {
	const requestHeaders = headers();
	const fetchHeaders = new Headers(requestHeaders);
	fetchHeaders.set(
		"Authorization",
		requestHeaders.get("Authorization") as string
	);
	fetchHeaders.set("Content-Type", "application/json");
	return fetchHeaders;
}
