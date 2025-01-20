import { IArrangerEdge, IArrangerNodeData, IQueryOperationsConfig, ISearchAfter } from './types';

export const hydrateResults = <resultType extends IArrangerNodeData>(
    results: IArrangerEdge<resultType>[],
    reverse = false,
): resultType[] => {
    const hydratedResults = results.map(
        (edge: IArrangerEdge<resultType>, index): resultType => ({
            ...edge.node,
            key: edge.node?.id || index,
        }),
    );

    return reverse ? hydratedResults.reverse() : hydratedResults;
};

export const computeSearchAfter = <resultType extends IArrangerNodeData>(
    result: IArrangerEdge<resultType>[],
    operations?: IQueryOperationsConfig,
): ISearchAfter => ({
    head: operations?.previous ? result[result.length - 1]?.searchAfter : result[0]?.searchAfter,
    tail: operations?.previous ? result[0]?.searchAfter : result[result.length - 1]?.searchAfter,
});
