'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';

import { cn } from '@/lib/utils';

interface ImageUploadProps {
	value: string;
	onChange: (src: string) => void;
	disabled?: boolean;
}

export const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div
			className={cn(
				'space-y-4 w-full flex flex-col justify-center items-center',
				disabled ? 'pointer-events-none opacity-50' : 'pointer-events-auto'
			)}
		>
			<CldUploadButton
				options={{
					maxFiles: 1,
				}}
				onUpload={(result: any) => onChange(result.info.secure_url)}
				uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
			>
				<div className='p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center'>
					<div className='relative w-40 h-40'>
						<Image
							fill
							alt='upload'
							src={value || '/placeholder.svg'}
							className='rounded-lg object-cover'
						/>
					</div>
				</div>
			</CldUploadButton>
		</div>
	);
};
