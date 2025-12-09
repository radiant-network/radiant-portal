import { v4 } from 'uuid';

import { SqonOpEnum } from '@/api/api';
import { ISavedFilter, IUserSavedFilter } from '@/components/cores/saved-filter';
import { BooleanOperators, ISyntheticSqon } from '@/components/cores/sqon';

export function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
export function randomNumber(min = 1, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomString() {
  return Math.random().toString(36).substring(7);
}

export const numericOperators: SqonOpEnum[] = [
  SqonOpEnum.GreaterThan,
  SqonOpEnum.LessThan,
  SqonOpEnum.Between,
  SqonOpEnum.GreaterThanOrEqualTo,
  SqonOpEnum.LessThanOrEqualTo,
];

export function generateRandomUserSavedFilter(filter?: ISavedFilter): IUserSavedFilter {
  return {
    id: v4(),
    title: filter?.title || `Custom Pill ${randomNumber(1, 50)}`,
    queries: [generateRandomQuery()],
    keycloak_id: v4(),
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
    tag: 'tag',
    favorite: false,
  };
}

export function generateRandomValue(operator: SqonOpEnum): (string | number)[] {
  if (numericOperators.includes(operator)) {
    return Array.from({ length: 2 }, () => randomNumber());
  } else {
    return Array.from({ length: randomNumber(2, 5) }, () => randomString());
  }
}

export function generateRandomQuery(id: string = v4()): ISyntheticSqon {
  const numConditions = randomNumber(1, 3);
  const conditions = Array.from({ length: numConditions }, () => {
    const filteredOps = Object.values(SqonOpEnum).filter(
      op => op !== SqonOpEnum.And && op !== SqonOpEnum.Or && op !== SqonOpEnum.Not,
    );
    const op = randomElement(filteredOps);
    return {
      op,
      content: {
        field: `field_${randomString()}`,
        value: generateRandomValue(op),
      },
    };
  });

  return {
    id,
    op: randomElement(['and', 'or'] as BooleanOperators[]),
    content: conditions as any,
  };
}
