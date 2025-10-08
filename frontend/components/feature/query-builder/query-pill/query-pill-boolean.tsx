import {
  isBooleanOperator,
  isCustomPill,
  isReference,
  isRemoteComponent,
  isSet,
  isUploadedList,
} from '@/components/model/query-builder-core';
import { ISqonGroupFilter, ISyntheticSqon, IValueQuery } from '@/components/model/sqon';

import QueryCombiner from './query-pill-combiner';
import QueryPillCustom from './query-pill-custom';
import QueryPillField from './query-pill-field';
import QueryPillIsolatedBoolean from './query-pill-isolated-boolean';
import QueryPillReference from './query-pill-reference';
import QueryPillRemoteComponent from './query-pill-remote-component';
import QueryPillSet from './query-pill-set';
import QueryPillUploadList from './query-pill-upload-list';

export type QueryPillBooleanProps = {
  sqon: ISyntheticSqon;
  customPillEditEnabled?: boolean;
};

function getQueryPill(f: any, customPillEditEnabled?: boolean) {
  if (f.skipBooleanOperatorCheck) {
    return <QueryPillIsolatedBoolean groupFilter={f as ISqonGroupFilter} />;
  }

  if (isCustomPill(f)) {
    return <QueryPillCustom valueQuery={f as IValueQuery} />;
  }

  if (isBooleanOperator(f)) {
    return <QueryPillBoolean sqon={f} />;
  }

  if (isReference(f)) {
    return <QueryPillReference refIndex={f as number} />;
  }

  if (isSet(f)) {
    return <QueryPillSet valueFilter={f} />;
  }

  if (isUploadedList(f)) {
    return <QueryPillUploadList valueFilter={f} />;
  }

  if (isRemoteComponent(f)) {
    return <QueryPillRemoteComponent />;
  }

  return <QueryPillField valueFilter={f} customPillEditEnabled={customPillEditEnabled} />;
}

function QueryPillBoolean({ sqon, customPillEditEnabled }: QueryPillBooleanProps) {
  return (
    <>
      {sqon.content.map((f: any, i: number) => (
        <div key={i} className="flex items-center py-[2px]">
          {getQueryPill(f, customPillEditEnabled)}
          {isNotEnd(sqon.content, i) && <QueryCombiner />}
        </div>
      ))}
    </>
  );
}

const isNotEnd = (content: any[], index: number) => content.length - 1 > index;

export default QueryPillBoolean;
