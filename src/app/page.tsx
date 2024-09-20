'use client'

import GoogleLoginButton from '@/components/google-login-button';
import { PATH_DESCRIPTION_REPLACE, PATH_SIGN_IN } from '@/constants/paths';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
	const { data: session } = useSession();
	const router = useRouter();

	if (!session) {
		router.push(PATH_SIGN_IN);
	}
	if (session) {
		router.push(PATH_DESCRIPTION_REPLACE);
	}

	return (
		<main>
			{!session && <GoogleLoginButton />}
		</main>
	);
}
