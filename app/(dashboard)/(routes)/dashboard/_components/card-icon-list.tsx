'use client';

import { CardIcon, CardIconProps } from './card-icon';

interface CardIconListProps {
	items: CardIconProps[];
}

export const CardIconList = ({ items }: CardIconListProps) => {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			{items.map((item: CardIconProps) => (
				<CardIcon key={item.title} title={item.title} total={item.total} />
			))}
		</div>
	);
};
