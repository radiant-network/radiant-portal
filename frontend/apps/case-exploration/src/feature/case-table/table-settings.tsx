import { createColumnHelper } from '@tanstack/react-table';
import { CaseResult } from '@/api/api';
import { createColumnSettings, TableColumnDef } from '@/components/base/data-table/data-table';
import { TFunction } from 'i18next';

const columnHelper = createColumnHelper<CaseResult>();

function getCaseExplorationColumns(t: TFunction<string, undefined>) {
	return [
		// case
		columnHelper.accessor(row => row.case_id, {
			id: 'case_id',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.case_id'),
			size: 150,
			minSize: 120,
		}),
		// MRN
		columnHelper.accessor(row => row.mrn, {
			id: 'mrn',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.mrn'),
			size: 150,
			minSize: 120,
		}),
		// Priority
		columnHelper.accessor(row => row.priority_code, {
			id: 'priority_code',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.priority_code'),
			size: 150,
			minSize: 120,
		}),
		// Status
		columnHelper.accessor(row => row.status_code, {
			id: 'status_code',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.status_code'),
			size: 150,
			minSize: 120,
		}),
		// Type
		columnHelper.accessor(row => row.case_analysis_type_code, {
			id: 'case_analysis_type_code',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.case_analysis_type_code'),
			size: 150,
			minSize: 120,
		}),
		// Analysis
		columnHelper.accessor(row => row.case_analysis_name, {
			id: 'case_analysis_code',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.case_analysis_code'),
			size: 150,
			minSize: 120,
		}),
		// Req. by
		columnHelper.accessor(row => row.requested_by_name, {
			id: 'requested_by_name',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.requested_by_name'),
			size: 150,
			minSize: 120,
		}),
		// Updated
		columnHelper.accessor(row => row.updated_on, {
			id: 'updated_on',
			cell: info => <>{info.getValue()}</>,
			header: t('caseExploration.case.headers.updated_on'),
			size: 150,
			minSize: 120,
		}),
		// Actions Buttons
	] as TableColumnDef<CaseResult, any>[]; // todo replace with correct type when api is updated
}


const defaultSettings = createColumnSettings([
	{
		id: 'case_id',
		visible: true,
		label: "caseExploration.case.headers.case_id"
	},
	{
		id: 'mrn',
		visible: true,
		label: "caseExploration.case.headers.mrn"
	},
	{
		id: 'priority_code',
		visible: true,
		label: "caseExploration.case.headers.priority_code"
	},
	{
		id: 'status_code',
		visible: true,
		label: "caseExploration.case.headers.status_code"
	},
	{
		id: 'case_analysis_type_code',
		visible: true,
		label: "caseExploration.case.headers.case_analysis_type_code"
	},
	{
		id: 'case_analysis_code',
		visible: true,
		label: "caseExploration.case.headers.case_analysis_code"
	},
	{
		id: 'requested_by_name',
		visible: true,
		label: "caseExploration.case.headers.requested_by_name"
	},
	{
		id: 'updated_on',
		visible: true,
		label: "caseExploration.case.headers.updated_on"
	},
]);

export { getCaseExplorationColumns, defaultSettings };
