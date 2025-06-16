import useSWR from 'swr';
import DataTable from '@/components/base/data-table/data-table';
import { PaginationState } from '@tanstack/react-table';
import { getCaseExplorationColumns, defaultSettings } from '@/feature/case-table/table-settings';
import { CaseResult, Count, CountBodyWithCriteria, ListBodyWithCriteria, SortBody, SortBodyOrderEnum } from '@/api/api';
import { useState } from 'react';
import { useI18n } from '@/components/hooks/i18n';
import { caseApi } from '@/utils/api';
import FiltersGroupForm from '@/components/filters-group/filters-group';

type CaseListInput = {
	listBody: ListBodyWithCriteria;
};

type CaseCountInput = {
	countBody: CountBodyWithCriteria;
};

const DEFAULT_SORTING = [
	{
		field: 'created_at',
		order: SortBodyOrderEnum.Asc,
	},
];


async function fetchCasesList(input: CaseListInput) {
	const response = await caseApi.listCases(input.listBody);
	return response.data;
}

async function fetchCasesCount(input: CaseCountInput) {
	const response = await caseApi.countCases(input.countBody);
	return response.data;
}

function CasesTab() {
	const { t } = useI18n();
	const [sorting, setSorting] = useState<SortBody[]>(DEFAULT_SORTING);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const { data: total, isLoading: totalIsLoading } = useSWR<Count, any, CaseCountInput>(
		{
			countBody: { search_criteria: [] },
		},
		fetchCasesCount,
		{
			revalidateOnFocus: false,
		},
	);

	const { data: list, isLoading: listIsLoading } = useSWR<CaseResult[], any, CaseListInput>(
		{
			listBody: {
				additional_fields: [
					'case_analysis_code',
					'created_at',
				],
				search_criteria: [],
				limit: pagination.pageSize,
				page_index: pagination.pageIndex,
				sort: sorting,
			},
		},
		fetchCasesList,
		{
			revalidateOnFocus: false,
		},
	);

	return (
		<div className="bg-background">
			<DataTable
				id="case-exploration"
				columns={getCaseExplorationColumns(t)}
				FiltersGroupForm={FiltersGroupForm}
				data={list ?? []}
				defaultColumnSettings={defaultSettings}
				defaultServerSorting={DEFAULT_SORTING}
				loadingStates={{
					total: totalIsLoading,
					list: listIsLoading
				}}
				pagination={pagination}
				onPaginationChange={setPagination}
				onServerSortingChange={setSorting}
				total={total ?? 0}
				enableColumnOrdering
				enableFullscreen
				tableIndexResultPosition='hidden'
			/>
		</div>
	)
}

export default CasesTab;
