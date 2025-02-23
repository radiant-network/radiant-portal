import { v4 } from "uuid";
import { ISavedFilter } from "../../saved-filter";
import { getDefaultSyntheticSqon } from "./sqon";

export function getNewSavedFilter(defaultTitle = "New Filter") {
  const newActiveQueryId = v4();
  const newSavedFilter: ISavedFilter = {
    id: v4(),
    queries: [getDefaultSyntheticSqon(newActiveQueryId)],
    title: defaultTitle,
    favorite: false,
    isDirty: false,
    isNew: true,
  };

  return {
    newActiveQueryId,
    newSavedFilter,
  };
}
