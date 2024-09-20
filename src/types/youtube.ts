export const YouTubeErrorStrings = {
	QuotaLimitReached: 'The request cannot be completed because you have exceeded your <a href="/youtube/v3/getting-started#quota">quota</a>'
}


export interface Video {
	id: { videoId: string };
	snippet: {
		title: string;
		thumbnails: {
			default: {
				url: string;
			};
		};
	};
}