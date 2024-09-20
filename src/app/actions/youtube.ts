/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { authOptions } from '@/lib/auth';
import { withAuth } from '@/lib/middleware';
import { google, youtube_v3 } from 'googleapis';
import { getServerSession } from 'next-auth/next';

async function getInstance(): Promise<youtube_v3.Youtube> {
	const session = await getServerSession(authOptions);
	if (!session?.accessToken || !session?.refreshToken) {
		throw new Error('No access token or refresh token found');
	}

	const oauth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET
	);

	oauth2Client.setCredentials({
		access_token: session.accessToken,
		refresh_token: session.refreshToken,
	});

	const youtube: youtube_v3.Youtube = google.youtube({
		version: 'v3',
		auth: oauth2Client,
	});

	return youtube;
}

export const fetchYouTubeVideos = withAuth(async (limit: number, offset: number, fetchAll: boolean = false) => {
	const youtube = await getInstance();
	let allVideos: any[] = [];
	let pageToken = '';

	try {
		do {
			const response = await youtube.search.list({
				part: ['snippet'],
				forMine: true,
				type: ['video'],
				maxResults: 50,
				pageToken: pageToken,
			});

			allVideos = allVideos.concat(response.data.items || []);
			pageToken = response.data.nextPageToken || '';

			if (!fetchAll) break;
		} while (pageToken && (fetchAll || allVideos.length < limit));

		return fetchAll ? allVideos : allVideos.slice(offset, offset + limit);
	} catch (error) {
		console.error('Error fetching videos:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Error(errorMessage);
	}
});

export const updateVideoDescriptions = withAuth(async (videoIds: string[], textToReplace: string, replacementText: string) => {
	const youtube = await getInstance();

	console.log("Updating the following videos: ", videoIds);
	const results = await Promise.all(videoIds.map(async (videoId) => {
		try {
			const videoResponse = await youtube.videos.list({
				part: ['snippet'],
				id: [videoId]
			});

			const video = videoResponse.data.items?.[0];
			if (!video) {
				throw new Error(`Video not found: ${videoId}`);
			}

			const regexTextToReplace = textToReplace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regexReplacementText = replacementText.replace(/\$/g, '$$$$');

			const oldDescription = video.snippet?.description || '';
			const newDescription = oldDescription.replace(new RegExp(regexTextToReplace, 'g'), regexReplacementText);

			const updatedVideo = {
				part: ['snippet'],
				requestBody: {
					id: videoId,
					snippet: {
						title: video.snippet?.title,
						categoryId: video.snippet?.categoryId,
						description: newDescription,
					}
				}
			};
			await youtube.videos.update(updatedVideo);

			return { videoId, success: true };
		} catch (error) {
			console.error(`Error updating video ${videoId}:`, error);
			const errorMessage = error instanceof Error ? error.message : String(error);

			return { videoId, success: false, error: errorMessage };
		}
	}));

	return results;
});