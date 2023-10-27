import { Separator } from '@/components/ui/separator';
import { FormProject } from '../_components/form-project';

const CreateProjectPage = () => {
	return (
		<div className='flex-1 flex items-center justify-center max-w-md w-full mx-auto p-4 md:p-0'>
			<div className='h-full w-full space-y-3'>
				<div>
					<h3 className='text-lg font-medium'>Nuevo Proyecto</h3>
					<p className='text-sm text-muted-foreground'>
						Formulario inicial para crear un proyecto.
					</p>
				</div>
				<Separator />
				<FormProject />
			</div>
		</div>
	);
};

export default CreateProjectPage;
