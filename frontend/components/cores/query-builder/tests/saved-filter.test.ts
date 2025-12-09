import { beforeEach, describe, expect, it, Mock, vitest } from 'vitest';

import { SavedFilterType } from '../../../../api/api';
import { ISavedFilter, SavedFilterTypeEnum } from '../../saved-filter';
import { ISyntheticSqon } from '../../sqon';
import { CoreQueryBuilderProps, createQueryBuilder, QueryBuilderInstance, QueryBuilderState } from '../query-builder';
import { getDefaultSyntheticSqon } from '../utils/sqon';

const defaultQueries: ISyntheticSqon[] = [
  {
    id: '1',
    op: 'and',
    content: [
      {
        content: {
          value: ['something'],
          field: 'field1',
        },
        op: 'in',
      },
    ],
  },
  {
    id: '2',
    op: 'and',
    content: [
      {
        content: {
          value: ['something-else'],
          field: 'field2',
        },
        op: 'in',
      },
    ],
  },
];

const defaultProps: CoreQueryBuilderProps = {
  id: 'test-query-builder',
  state: {
    activeQueryId: defaultQueries[0].id,
    queries: defaultQueries,
    selectedQueryIndexes: [],
    savedFilters: [],
  },
  savedFilterType: SavedFilterType.GERMLINE_SNV_OCCURRENCE,
};

const mockUUID = 'abababab-abab-4bab-abab-abababababab';

let qb: QueryBuilderInstance;
let state: QueryBuilderState = defaultProps.state;

let mockOnFilterCreate: Mock<any>;
let mockOnFilterDelete: Mock<any>;
let mockOnFilterUpdate: Mock<any>;
let mockOnActiveQueryChange: Mock<any>;

// Mock the entire uuid module
vitest.mock('uuid', () => ({
  v4: () => mockUUID,
}));

describe('SavedFilters Manipulation', () => {
  beforeEach(() => {
    state = defaultProps.state;

    mockOnFilterCreate = vitest.fn();
    mockOnFilterDelete = vitest.fn();
    mockOnFilterUpdate = vitest.fn();
    mockOnActiveQueryChange = vitest.fn();

    qb = createQueryBuilder({
      ...defaultProps,
      onStateChange: newState => {
        state = newState;
      },
      onSavedFilterCreate: mockOnFilterCreate,
      onSavedFilterDelete: mockOnFilterDelete,
      onSavedFilterUpdate: mockOnFilterUpdate,
      onActiveQueryChange: mockOnActiveQueryChange,
    });
  });

  it('should return the selected saved filter if set', () => {
    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: defaultQueries,
      favorite: false,
    };

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.raw()).toEqual(savedFilter);
    expect(qb.getSelectedSavedFilter()?.isSelected()).toBe(true);
  });

  it('should return null as the selected saved filter if not set', () => {
    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeNull();
  });

  it('should create a new saved filter', () => {
    expect(state.activeQueryId).toBe(defaultQueries[0].id);
    expect(state.savedFilters).toHaveLength(0);

    qb.createSavedFilter();

    const newSavedFilter: Partial<ISavedFilter> = {
      id: mockUUID,
      isNew: true,
      isDirty: false,
      favorite: false,
      queries: [getDefaultSyntheticSqon()],
    };

    expect(state.savedFilters).toHaveLength(1);
    expect(state.savedFilters[0]).toMatchObject(newSavedFilter);
    expect(state.activeQueryId).toBe(mockUUID);
    expect(mockOnFilterCreate).toBeCalledTimes(1);
    expect(mockOnFilterCreate).toBeCalledWith(expect.objectContaining(newSavedFilter));
  });

  it('should not alter the initial queries of a saved filter when deleting a query', () => {
    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: defaultQueries,
      favorite: false,
    };

    expect(qb.getSelectedSavedFilter()).toBeNull();

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.getQueries().length).toBe(2);
    expect(qb.getSelectedSavedFilter()?.getRawQueries()).toEqual(defaultQueries);

    qb.deleteQuery('1');

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.getQueries().length).toBe(2);
    expect(qb.getSelectedSavedFilter()?.getRawQueries()).toEqual(defaultQueries);
  });

  it('should return that the saved filter is dirty if query has changed', () => {
    const initialQueries: ISyntheticSqon[] = [
      {
        id: '1',
        op: 'and',
        content: [
          {
            content: {
              value: ['something'],
              field: 'field1',
            },
            op: 'in',
          },
        ],
      },
      {
        id: '2',
        op: 'and',
        content: [
          {
            content: {
              value: ['something-else'],
              field: 'field2',
            },
            op: 'in',
          },
        ],
      },
    ];

    const changedQueries = [
      initialQueries[0],
      {
        ...initialQueries[1],
        op: 'or',
      },
    ];

    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: initialQueries,
      favorite: false,
    };

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        queries: changedQueries,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.getQueries().length).toBe(2);
    expect(qb.getSelectedSavedFilter()?.getRawQueries()).toEqual(initialQueries);
    expect(qb.getSelectedSavedFilter()?.isDirty()).toBe(true);
  });

  it('should copy the saved filter', () => {
    const initialQueries: ISyntheticSqon[] = [
      {
        id: '1',
        op: 'and',
        content: [
          {
            content: {
              value: ['something'],
              field: 'field1',
            },
            op: 'in',
          },
        ],
      },
      {
        id: '2',
        op: 'and',
        content: [
          {
            content: {
              value: ['something-else'],
              field: 'field2',
            },
            op: 'in',
          },
        ],
      },
    ];

    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: initialQueries,
      favorite: false,
    };

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        queries: initialQueries,
        savedFilters: [savedFilter],
      },
    }));

    const result = qb.getSelectedSavedFilter()?.copy();

    const duplicatedQueries: ISyntheticSqon[] = [
      {
        ...initialQueries[0],
        id: mockUUID,
      },
      {
        ...initialQueries[1],
        id: mockUUID,
      },
    ];

    expect(result).toMatchObject({
      id: mockUUID,
      isNew: true,
      isDirty: false,
      favorite: false,
      queries: duplicatedQueries,
    });
  });

  it('should duplicate the selected saved filter and set the new one as selected', () => {
    const initialQueries: ISyntheticSqon[] = [
      {
        id: '1',
        op: 'and',
        content: [
          {
            content: {
              value: ['something'],
              field: 'field1',
            },
            op: 'in',
          },
        ],
      },
      {
        id: '2',
        op: 'and',
        content: [
          {
            content: {
              value: ['something-else'],
              field: 'field2',
            },
            op: 'in',
          },
        ],
      },
    ];

    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: initialQueries,
      favorite: false,
    };

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        queries: initialQueries,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getState().savedFilters.length).toBe(1);

    qb.getSelectedSavedFilter()?.duplicate();

    const duplicatedQueries: ISyntheticSqon[] = [
      {
        ...initialQueries[0],
        id: mockUUID,
      },
      {
        ...initialQueries[1],
        id: mockUUID,
      },
    ];

    // Cant test that qb.getSelectedSavedFilter() is the new saved filter
    // Since this would only work with the real useQueryBuilderHook.
    // But we can check that the activeQueryId was updated with the ID of
    // the first query in the new savedFilter
    expect(state.activeQueryId).toBe(mockUUID);
    expect(state.queries).toEqual(duplicatedQueries);
    expect(state.savedFilters.length).toBe(2);
    expect(state.savedFilters[1].isNew).toBe(true);
    expect(state.savedFilters[1].isDirty).toBe(false);
    expect(state.savedFilters[1].id).toBe(mockUUID);
    expect(state.savedFilters[1].queries).toEqual(duplicatedQueries);
    expect(mockOnFilterCreate).toHaveBeenCalledTimes(1);
    expect(mockOnFilterCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockUUID,
        isNew: true,
        isDirty: false,
        favorite: false,
        queries: duplicatedQueries,
      }),
    );
  });

  it('should create and set new selected saved filter when deleting the currently selected saved filter', async () => {
    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: defaultQueries,
      favorite: false,
    };

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getState().savedFilters.length).toBe(1);
    expect(qb.getState().activeQueryId).toBe('1');
    expect(qb.getState().savedFilters[0].id).toBe('1');
    expect(qb.getState().savedFilters[0].queries).toEqual(defaultQueries);

    await qb.getSelectedSavedFilter()?.delete();

    // Cant test that qb.getSelectedSavedFilter() is the new saved filter
    // Since this would only work with the real useQueryBuilderHook.
    // But we can check that the activeQueryId was updated with the ID of
    // the first query in the new savedFilter
    expect(state.activeQueryId).toBe(mockUUID);
    expect(state.savedFilters.length).toBe(1);
    expect(state.savedFilters[0].isNew).toBe(true);
    expect(state.savedFilters[0].isDirty).toBe(false);
    expect(state.savedFilters[0].id).toBe(mockUUID);
    expect(state.savedFilters[0].queries).toEqual([getDefaultSyntheticSqon()]);
    expect(mockOnFilterDelete).toHaveBeenCalledTimes(1);
    expect(mockOnFilterDelete).toHaveBeenCalledWith('1');
    expect(mockOnActiveQueryChange).toHaveBeenCalledTimes(1);
    expect(mockOnActiveQueryChange).toHaveBeenCalledWith(getDefaultSyntheticSqon());
  });

  it('should select savedfilter', () => {
    const savedFilter: ISavedFilter = {
      id: 'saved-filter-id-1',
      name: 'Saved Filter 1',
      queries: [
        {
          id: 'query-id-1',
          op: 'and',
          content: [
            {
              content: {
                value: ['something'],
                field: 'field1',
              },
              op: 'in',
            },
          ],
        },
      ],
      favorite: false,
    };

    expect(qb.getSelectedSavedFilter()).toBeNull();

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeNull();

    qb.getSavedFilters()[0].select();

    expect(state.activeQueryId).toBe('query-id-1');
    expect(state.queries).toEqual(savedFilter.queries);
  });

  it('should discard changes', () => {
    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: defaultQueries,
      favorite: false,
    };

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        queries: [
          ...defaultQueries,
          {
            id: '3',
            op: 'and',
            content: [
              {
                content: {
                  value: ['something-else'],
                  field: 'field3',
                },
                op: 'in',
              },
            ],
          },
        ],
        savedFilters: [savedFilter],
      },
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.isDirty()).toBe(true);

    qb.getSelectedSavedFilter()?.discardChanges();

    expect(state.savedFilters[0].queries).toEqual(defaultQueries);
  });

  it('should save filter', async () => {
    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: defaultQueries,
      favorite: false,
    };

    const newSyntheticSqon: ISyntheticSqon = {
      id: '3',
      op: 'and',
      content: [
        {
          content: {
            value: ['something-else'],
            field: 'field3',
          },
          op: 'in',
        },
      ],
    };

    const newQueries: ISyntheticSqon[] = [...defaultQueries, newSyntheticSqon];

    const updatedName = 'Saved Filter 1 Updated';

    const mockOnSavedFilterUpdate = vitest.fn().mockReturnValue({
      ...savedFilter,
      name: updatedName,
      queries: newQueries,
      favorite: true,
    });

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        queries: newQueries,
        savedFilters: [savedFilter],
      },
      onSavedFilterUpdate: mockOnSavedFilterUpdate,
    }));

    expect(qb.getSelectedSavedFilter()).toBeTruthy();
    expect(qb.getSelectedSavedFilter()?.isDirty()).toBe(true);

    await qb.getSelectedSavedFilter()?.save(SavedFilterTypeEnum.Filter, {
      name: updatedName,
      favorite: true,
    });

    expect(state.savedFilters[0].queries).toEqual(newQueries);
    expect(state.savedFilters[0].isDirty).toBeFalsy();
    expect(state.savedFilters[0].isNew).toBeFalsy();
    expect(state.savedFilters[0].name).toEqual(updatedName);
    expect(state.savedFilters[0].favorite).toBeTruthy();
    expect(mockOnSavedFilterUpdate).toBeCalledTimes(1);
    expect(mockOnSavedFilterUpdate).toBeCalledWith({
      id: '1',
      name: updatedName,
      queries: newQueries,
      favorite: true,
    });
  });

  it('should only increment savedFilters by 1 when duplicating and saving a filter', async () => {
    const initialQueries: ISyntheticSqon[] = [
      {
        id: '1',
        op: 'and',
        content: [
          {
            content: {
              value: ['something'],
              field: 'field1',
            },
            op: 'in',
          },
        ],
      },
    ];

    const savedFilter: ISavedFilter = {
      id: '1',
      name: 'Saved Filter 1',
      queries: initialQueries,
      favorite: false,
    };

    const mockOnSavedFilterSave = vitest.fn().mockResolvedValue({
      id: mockUUID,
      name: 'Saved Filter 1 COPY',
      queries: [{ ...initialQueries[0], id: mockUUID }],
      favorite: false,
    });

    qb.setCoreProps(prev => ({
      ...prev,
      state: {
        ...state,
        queries: initialQueries,
        savedFilters: [savedFilter],
      },
      onSavedFilterSave: mockOnSavedFilterSave,
    }));

    // Initially we have 1 saved filter
    expect(qb.getState().savedFilters.length).toBe(1);

    // Duplicate the saved filter
    qb.getSelectedSavedFilter()?.duplicate();

    const newSelectedSavedFilter = state.savedFilters.find(filter =>
      filter.queries.find((query: ISyntheticSqon) => query.id === mockUUID),
    );

    // After duplication, we should have 2 saved filters
    expect(state.savedFilters.length).toBe(2);
    expect(state.savedFilters[1].isNew).toBe(true);

    // Save the duplicated filter
    await qb.saveNewFilter(newSelectedSavedFilter);

    // After saving, we should still have only 2 saved filters (not 3)
    expect(state.savedFilters.length).toBe(2);
    expect(state.savedFilters[0].id).toBe('1');
    expect(state.savedFilters[1].id).toBe(mockUUID);
    expect(state.savedFilters[1].isNew).toBe(false);
    expect(mockOnSavedFilterSave).toHaveBeenCalledTimes(1);
  });

  // add test for save (custom pill)
  // Test hasQueries
  // Test isFavorite
  // Test isNew
  // Test isDirty
  // Test saveNewFilter
});
