'use client'

import React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { LogIn } from 'lucide-react';

const GoogleLoginButton: React.FC = () => {
	return (
		<Button className="w-full hover:bg-gray-300 dark:hover:bg-nxp-dark-tertiary" variant="outline" onClick={() => signIn('google')} >
			<LogIn className="mr-2 h-4 w-4" />
				Sign in with Google
          </Button >
  );
};

export default GoogleLoginButton;