import { createColumnHelper } from '@tanstack/react-table';
import { CaseResult } from '@/api/api';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { TFunction } from 'i18next';

const columnHelper = createColumnHelper<CaseResult>();

function getCaseExplorationColumns(t: TFunction<string, undefined>) {
	return [
		columnHelper.accessor(row => row.case_analysis_code, {
			id: 'case_analysis_code',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.headers.case_analysis_code'),
			size: 150,
			minSize: 120,
		}),
		columnHelper.accessor(row => row.created_on, {
			id: 'created_at',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.headers.created_at'),
			size: 150,
			minSize: 120,
		}),
	] as TableColumnDef<CaseResult, any>[]; // todo replace with correct type when api is updated
}


const defaultSettings = createColumnSettings([
	{
		id: 'case_analysis_code',
		visible: true,
	},
	{
		id: 'created_at',
		visible: true,
	},
]);

export { getCaseExplorationColumns, defaultSettings };
