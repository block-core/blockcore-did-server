export function sleep(durationInMillisecond): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, durationInMillisecond));
}
