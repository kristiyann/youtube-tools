/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { transformImage } from '@/app/actions/transformImage';
import { Header } from '@/components/header';

export default function ImageEditor() {
	const [isLoading, setIsLoading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setIsLoading(true);
		setError(null);

		try {
			const result = await transformImage(formData);

			if (result.error) {
				setError(result.error);
			} else if (result.url) {
				setPreviewUrl(result.url);
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Failed to process image');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="w-full min-h-screen dark:bg-nxp-dark-primary dark:text-white">
			<Header/>
			<main>
				<Card className="dark:bg-nxp-dark-secondary dark:text-white m-5 p-6">
					<form action={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="image"
								className="block text-sm font-medium text-white"
							>
								Upload Image
							</label>
							<input
								type="file"
								id="image"
								name="image"
								accept="image/*"
								className="block w-full text-sm text-white
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-gray-700
                                hover:file:bg-blue-100"
							/>
						</div>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white"
						>
							{isLoading ? 'Processing...' : 'Transform Image'}
						</Button>
					</form>

					{error && (
						<div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
							{error}
						</div>
					)}

					{previewUrl && (
						<div className="mt-6">
							<h3 className="text-lg font-medium mb-2">Transformed Image</h3>
							<img
								src={previewUrl}
								alt="Transformed"
								className="w-full rounded shadow-lg"
							/>
						</div>
					)}
				</Card>
			</main>
		</div>
	);
}