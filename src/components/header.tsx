import { Button } from './ui/button'
import { useSession, signIn, signOut } from 'next-auth/react'

export function Header() {
	const { data: session } = useSession();

	const handleSignOut = () => {
		signOut({ callbackUrl: '/sign-in' });
	}

	return (
		<header className="w-full px-4 sm:px-6 md:px-8 py-4 bg-white dark:bg-nxp-dark-secondary">
			<div className="flex flex-col sm:flex-row items-center justify-between">
				<h1 className="text-2xl font-bold mb-4 sm:mb-0 dark:text-white">
					YouTube Tools
				</h1>
				<div className="flex items-center space-x-4">
					{session ? (
						<Button onClick={handleSignOut} variant="outline" className="dark:text-white dark:hover:bg-nxp-dark-primary">
							Sign Out
						</Button>
					) : (
						<Button onClick={() => signIn()} variant="outline" className="dark:text-white dark:hover:bg-nxp-dark-primary">
							Sign In
						</Button>
					)}
				</div>
			</div>
		</header>
	)
}