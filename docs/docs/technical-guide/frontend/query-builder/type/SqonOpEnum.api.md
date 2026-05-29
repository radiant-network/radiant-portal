# SqonOpEnum (API)

 ```typescript
export const SqonOpEnum = {
    In: 'in',
    And: 'and',
    Or: 'or',
    Not: 'not',
    Between: 'between',
    GreaterThan: '>',
    LessThan: '<',
    GreaterThanOrEqualTo: '>=',
    LessThanOrEqualTo: '<=',
    NotIn: 'not-in',
    All: 'all'
} as const;

export type SqonOpEnum = typeof SqonOpEnum[keyof typeof SqonOpEnum];

```