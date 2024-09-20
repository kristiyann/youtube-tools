/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
				}
			}
		}),
	],
	callbacks: {
		async jwt({ token, account }: { token: any; account: any }) {
			if (account) {
				token.accessToken = account.access_token;
				token.refreshToken = account.refresh_token;
			}
			return token;
		},
		async session({ session, token }: { session: any; token: any }) {
			session.accessToken = token.accessToken;
			session.refreshToken = token.refreshToken;
			return session;
		}
	}
};