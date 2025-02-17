import {
  isBooleanOperator,
  isCustomPill,
  isReference,
  isRemoteComponent,
  isSet,
  isUploadedList,
} from "@/components/model/query-builder-core";
import { ISyntheticSqon } from "@/components/model/sqon";
import QueryPillField from "./QueryPill.Field";
import QueryPillRemoteComponent from "./QueryPill.RemoteComponent";
import QueryPillUploadList from "./QueryPill.UploadList";
import QueryPillSet from "./QueryPill.Set";
import QueryPillReference from "./QueryPill.Reference";
import QueryPillCustom from "./QueryPill.Custom";
import QueryPillIsolatedBoolean from "./QueryPill.IsolatedBoolean";
import QueryCombiner from "./QueryPill.Combiner";

export type QueryPillBooleanProps = {
  sqon: ISyntheticSqon;
};

const QueryPillBoolean = ({ sqon }: QueryPillBooleanProps) => (
  <>
    {sqon.content.map((f: any, i: number) => (
      <div key={i} className="flex items-center py-[2px]">
        {f.skipBooleanOperatorCheck ? (
          <QueryPillIsolatedBoolean />
        ) : isCustomPill(f) ? (
          <QueryPillCustom />
        ) : isBooleanOperator(f) ? (
          <QueryPillBoolean sqon={f} />
        ) : isReference(f) ? (
          <QueryPillReference refIndex={f as number} />
        ) : isSet(f) ? (
          <QueryPillSet valueFilter={f} />
        ) : isUploadedList(f) ? (
          <QueryPillUploadList />
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

const isNotEnd = (content: any[], index: number) => content.length - 1 > index;

export default QueryPillBoolean;
