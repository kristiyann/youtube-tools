/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		accessToken?: string;
		refreshToken?: string;
	}
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };