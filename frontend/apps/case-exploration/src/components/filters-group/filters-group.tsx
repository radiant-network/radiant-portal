import { useI18n } from '@/components/hooks/i18n';
import { Command, CommandInput } from '@/components/base/ui/command';
import { Button } from '@/components/base/ui/button';
import FiltersGroupSkeleton from '@/components/base/filters-group/filters-group-skeleton';

type FiltersGroupFormProps = {
	loading?: boolean;
}

function FiltersGroupForm({ loading = true }: FiltersGroupFormProps) {
	const { t } = useI18n();

	if (loading) return <FiltersGroupSkeleton />;

	return (
		<div className='py-4'>
			<label>{t('caseExploration.filtersGroup.searchById')}</label>
			<div className="flex gap-2">
				<Command>
					<CommandInput />
				</Command>
				<Button>{t('caseExploration.filtersGroup.priority_code')}</Button>
				<Button>{t('caseExploration.filtersGroup.status_code')}</Button>
				<Button>{t('caseExploration.filtersGroup.case_analysis_code')}</Button>
			</div>
		</div>
	)
}


export default FiltersGroupForm;
