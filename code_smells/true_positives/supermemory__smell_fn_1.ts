// @ts-nocheck
export function getAllTweets(data: TwitterAPIResponse): Tweet[] {
	const tweets: Tweet[] = []
	try {
		const instructions =
			data.data?.bookmark_timeline_v2?.timeline?.instructions ||
			data.data?.bookmark_collection_timeline?.timeline?.instructions ||
			[]
		for (const instruction of instructions) {
			if (instruction.type === `TimelineAddEntries` && instruction.entries) {
				for (const entry of instruction.entries) {
					if (entry.entryId.startsWith(`tweet-`)) {
						const tweet = transformTweetData(entry)
						if (tweet) {
							tweets.push(tweet)
						}
					}
				}
			}
		}
	} catch (error) {
		console.error(`Error extracting tweets:`, error)
	}
	return tweets
}