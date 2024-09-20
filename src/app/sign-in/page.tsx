'use client'

import GoogleLoginButton from '@/components/google-login-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PATH_DESCRIPTION_REPLACE } from '@/constants/paths';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

function SignIn() {
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push(PATH_DESCRIPTION_REPLACE);
		}
	}, [router, session]);

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-cover bg-center bg-gray-100 dark:bg-nxp-dark-primary"
		>
			<Card className="w-full max-w-md mx-auto bg-white dark:bg-nxp-dark-secondary shadow-xl rounded-xl overflow-hidden">
				<CardHeader className="text-center dark:text-white">
					<CardTitle className="text-3xl font-bold dark:text-white">Welcome!</CardTitle>
					<CardDescription className="dark:text-gray-300">Sign in to access the tool.</CardDescription>
				</CardHeader>
				<CardContent>
					<GoogleLoginButton/>
				</CardContent>
			</Card>
		</div>
	)
}

export default SignIn