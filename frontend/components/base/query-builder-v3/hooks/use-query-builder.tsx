// @TODO: to be changed for api
import { createContext } from 'react';

import { TSqonGroupOp } from '@/components/cores/sqon';

type QueryBuilderContextProps = {
  activeQuery?: QueryFieldProps;
};

type QueryFieldProps = {
  filterGroup: any; // @TODO: use FilterGroup from api when exported
  selectedFilters: any[]; // @TODO: use Filter type from api when exported
  index?: string;
  operator?: TSqonGroupOp;
};

export const QueryBuilderContext = createContext<QueryBuilderContextProps>({});

export function useUpdateActiveQueryField({ filterGroup, selectedFilters, index, operator }: QueryFieldProps) {
  console.log(filterGroup, selectedFilters, index, operator);
}

function queryBuilderReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
