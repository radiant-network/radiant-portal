import {
  isBooleanOperator,
  isCustomPill,
  isReference,
  isRemoteComponent,
  isSet,
  isUploadedList,
} from "@/components/model/query-builder-core";
import {
  ISqonGroupFilter,
  ISyntheticSqon,
  IValueQuery,
} from "@/components/model/sqon";
import QueryPillField from "./query-pill-field";
import QueryPillRemoteComponent from "./query-pill-remote-component";
import QueryPillUploadList from "./query-pill-upload-list";
import QueryPillSet from "./query-pill-set";
import QueryPillReference from "./query-pill-reference";
import QueryPillCustom from "./query-pill-custom";
import QueryPillIsolatedBoolean from "./query-pill-isolated-boolean";
import QueryCombiner from "./query-pill-combiner";

export type QueryPillBooleanProps = {
  sqon: ISyntheticSqon;
};

function QueryPillBoolean({ sqon }: QueryPillBooleanProps) {
  return (
    <>
      {sqon.content.map((f: any, i: number) => (
        <div key={i} className="flex items-center py-[2px]">
          {f.skipBooleanOperatorCheck ? (
            <QueryPillIsolatedBoolean groupFilter={f as ISqonGroupFilter} />
          ) : isCustomPill(f) ? (
            <QueryPillCustom valueQuery={f as IValueQuery} />
          ) : isBooleanOperator(f) ? (
            <QueryPillBoolean sqon={f} />
          ) : isReference(f) ? (
            <QueryPillReference refIndex={f as number} />
          ) : isSet(f) ? (
            <QueryPillSet valueFilter={f} />
          ) : isUploadedList(f) ? (
            <QueryPillUploadList valueFilter={f} />
          ) : isRemoteComponent(f) ? (
            <QueryPillRemoteComponent />
          ) : (
            <QueryPillField valueFilter={f} />
          )}
          {isNotEnd(sqon.content, i) && <QueryCombiner />}
        </div>
      ))}
    </>
  );
}

const isNotEnd = (content: any[], index: number) => content.length - 1 > index;

export default QueryPillBoolean;
