'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog"
import { fetchYouTubeVideos, updateVideoDescriptions } from '@/app/actions/youtube'
import { Header } from '@/components/header'
import { Video, YouTubeErrorStrings } from '@/types/youtube'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DefaultAlert, { AlertProps } from '@/components/action-alerts'
import { PATH_SIGN_IN } from '@/constants/paths'

function DescriptionReplace() {
	const { data: session } = useSession();
	const router = useRouter();

	const [actionAlert, setActionAlert] = useState<AlertProps>({});
	const [showAlert, setShowAlert] = useState(false);
	
	const [descriptionToReplace, setDescriptionToReplace] = useState('');
	const [replacementText, setReplacementText] = useState('');

	const [videos, setVideos] = useState<Video[]>([]);
	const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
	const [selectAll, setSelectAll] = useState(false);

	const itemsPerPage = 20;
	const [currentPage, setCurrentPage] = useState(1);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	if (!session) {
		router.push(PATH_SIGN_IN);
	}

	useEffect(() => {
		if (showAlert) {
			const toRef = setTimeout(() => {
				setShowAlert(false);

				clearTimeout(toRef);
			}, 8000);
		}
	}, [showAlert]);

	useEffect(() => {
		const getVideos = async () => {
			try {
				const fetchedVideos = await fetchYouTubeVideos(20, 0, true);
				setVideos(fetchedVideos as Video[]);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : String(err);
				console.error(errorMessage);

				if (errorMessage.includes(YouTubeErrorStrings.QuotaLimitReached)) {
					setActionAlert({ status: 'error', message: 'Our daily YouTube API quota was reached. This means videos cannot be displayed and edited 😔. Please try again tomorrow!'});
					setShowAlert(true);
				}
			}
		};

		getVideos();
	}, [])

	const handleCheckboxChange = (videoId: string) => {
		setSelectedVideos(prev => {
			const newSet = new Set(prev);
			if (newSet.has(videoId)) {
				newSet.delete(videoId);
			} else {
				newSet.add(videoId);
			}

			return newSet
		})
	}

	const handleSelectAllChange = () => {
		if (selectAll) {
			setSelectedVideos(new Set());
		} else {
			setSelectedVideos(new Set(videos.map(video => video.id.videoId)));
		}

		setSelectAll(!selectAll);
	}

	const handleApplyChanges = async () => {
		const result = await updateVideoDescriptions(Array.from(selectedVideos), descriptionToReplace, replacementText);
		console.log(result);

		const numSuccessfulVideos = result.filter(item => item.success).length;

		setIsDialogOpen(false);
		setActionAlert({ status: 'success', message: `Description update was successful for ${numSuccessfulVideos} videos! ✔️`});
		setShowAlert(true);
	}

	const paginatedVideos = videos.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const totalPages = Math.ceil(videos.length / itemsPerPage);

	const handleClearAll = () => {
		setSelectedVideos(new Set());
		setSelectAll(false);
	};

	return (
		<div className="w-full dark:bg-nxp-dark-primary dark:text-white min-h-screen">
			<Header />
			<main className="px-4 sm:px-6 md:px-8 space-y-6 py-6">
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<Label htmlFor="descriptionToReplace" className="dark:text-gray-300">Description text to replace</Label>
						<Input
							id="descriptionToReplace"
							value={descriptionToReplace}
							onChange={(e) => setDescriptionToReplace(e.target.value)}
							className="dark:bg-nxp-dark-secondary dark:text-white dark:border-gray-700"
						/>
					</div>
					<div>
						<Label htmlFor="replacementText" className="dark:text-gray-300">Text to replace with</Label>
						<Input
							id="replacementText"
							value={replacementText}
							onChange={(e) => setReplacementText(e.target.value)}
							className="dark:bg-nxp-dark-secondary dark:text-white dark:border-gray-700"
						/>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<Checkbox
							id="selectAll"
							checked={selectAll}
							onCheckedChange={handleSelectAllChange}
						/>
						<Label htmlFor="selectAll" className="dark:text-gray-300">Select All Videos</Label>
						<Button
							onClick={handleClearAll}
							variant="outline"
							size="sm"
							className="ml-4 dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white"
						>
							Clear All
						</Button>
					</div>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button
								className="dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white"
							>
								Apply Changes ({selectedVideos.size} videos)
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-white">
							<DialogHeader>
								<DialogTitle>Confirm Changes</DialogTitle>
								<DialogDescription className="dark:text-gray-300">
									Are you sure you want to apply the changes to {selectedVideos.size} videos?
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button variant="secondary" onClick={() => setIsDialogOpen(false)} className="dark:bg-gray-700 dark:text-white">
									Cancel
								</Button>
								<Button onClick={handleApplyChanges} className="dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white">
									Confirm
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>

				<Table className="dark:bg-nxp-dark-secondary dark:text-gray-300">
					<TableHeader>
						<TableRow className='hover:bg-gray-700'>
							<TableHead className="w-[50px]">Select</TableHead>
							<TableHead>Thumbnail</TableHead>
							<TableHead>ID</TableHead>
							<TableHead>Name</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedVideos.map((video) => (
							<TableRow key={video.id.videoId} className="hover:bg-gray-700">
								<TableCell>
									<Checkbox
										checked={selectedVideos.has(video.id.videoId)}
										onCheckedChange={() => handleCheckboxChange(video.id.videoId)}
									/>
								</TableCell>
								<TableCell>
									<img
										src={video.snippet.thumbnails.default.url}
										alt={`Thumbnail for ${video.snippet.title}`}
										className="w-20 h-auto"
									/>
								</TableCell>
								<TableCell>{video.id.videoId}</TableCell>
								<TableCell>{video.snippet.title}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
								aria-disabled={currentPage === 1}
								className={`dark:bg-gray-700 dark:text-gray-300 ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'dark:hover:bg-gray-800'}`}
							/>
						</PaginationItem>
						{[...Array(totalPages)].map((_, i) => (
							<PaginationItem key={i}>
								<PaginationLink
									onClick={() => setCurrentPage(i + 1)}
									isActive={currentPage === i + 1}
									className="dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
								>
									{i + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
								aria-disabled={currentPage === totalPages}
								className="dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
				{showAlert ? <DefaultAlert message={actionAlert.message} status={actionAlert.status} /> : <></>}
			</main>
		</div>
	)
}

export default DescriptionReplace