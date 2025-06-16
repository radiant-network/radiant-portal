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
		<div>
			<label>{t('caseExploration.form.searchById')}</label>
			<div className="flex gap-2">
				<Command>
					<CommandInput />
				</Command>
				<Button>Priority</Button>
				<Button>Status</Button>
				<Button>Analysis</Button>
			</div>
		</div>
	)
}


export default FiltersGroupForm;
