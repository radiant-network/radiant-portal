import type { CommunityMember, CommunitySort } from './community-model';

/**
 * Static roster of community members. Front-only mock standing in for the
 * future members endpoint. Order here is treated as insertion order (used as a
 * tie-breaker); `createdAt` drives the date sort.
 */
export const COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: '1',
    firstName: 'Karine',
    lastName: 'St-Onge',
    affiliation: 'Centre de recherche - CHU Sainte-Justine',
    roles: ['research'],
    areasOfInterest: ['Neuroblastoma', 'Osteosarcoma'],
    createdAt: '2026-06-28',
  },
  {
    id: '2',
    firstName: 'Evans',
    lastName: 'Girard',
    affiliation: 'this is an institution',
    roles: ['community'],
    areasOfInterest: ['Congenital Heart Defects'],
    createdAt: '2026-06-27',
  },
  {
    id: '3',
    firstName: 'Adrian',
    lastName: 'Paul',
    roles: ['research'],
    areasOfInterest: ['Familial Leukemia', 'Myeloid Malignancies'],
    createdAt: '2026-06-26',
  },
  {
    id: '4',
    firstName: 'Denis',
    lastName: 'Beauregard',
    roles: ['health'],
    areasOfInterest: ['Pediatric Cancer Studies'],
    createdAt: '2026-06-25',
  },
  {
    id: '5',
    firstName: 'Vincent',
    lastName: 'Ferretti',
    affiliation: 'udem',
    roles: ['research'],
    areasOfInterest: ['Ewing Sarcoma - Genetic Risk'],
    createdAt: '2026-06-24',
  },
  {
    id: '6',
    firstName: 'Julien',
    lastName: 'Bérubé',
    affiliation: 'Ste-Justine Hospital Research Center',
    roles: ['research'],
    areasOfInterest: ['Congenital Diaphragmatic Hernia', 'Kidney and Urinary Tract Defects'],
    createdAt: '2026-06-23',
  },
  {
    id: '7',
    firstName: 'Jeremy',
    lastName: 'Costanza',
    affiliation: 'CHU Sainte Justine',
    roles: ['health'],
    areasOfInterest: ['Orofacial Cleft - European Ancestry'],
    createdAt: '2026-06-22',
  },
  {
    id: '8',
    firstName: 'Jérémy',
    lastName: 'Costanza',
    roles: ['research'],
    areasOfInterest: ['Neuroblastoma'],
    createdAt: '2026-06-21',
  },
  {
    id: '9',
    firstName: 'Denis',
    lastName: 'Beauregard',
    roles: ['community'],
    areasOfInterest: ['Osteosarcoma'],
    createdAt: '2026-06-20',
  },
  {
    id: '10',
    firstName: 'adi',
    lastName: 'paul',
    roles: ['research'],
    areasOfInterest: ['Adolescent Idiopathic Scoliosis', 'Craniofacial Microsomia'],
    createdAt: '2026-06-19',
  },
  {
    id: '11',
    firstName: 'Adrian',
    lastName: 'Paul',
    roles: ['research'],
    areasOfInterest: ['Myeloid Malignancies'],
    createdAt: '2026-06-18',
  },
  {
    id: '12',
    firstName: 'Lucas',
    lastName: 'Lemonnier',
    roles: ['research', 'health'],
    areasOfInterest: ['Congenital Heart Defects'],
    createdAt: '2026-06-17',
  },
  {
    id: '13',
    firstName: 'Adrian',
    lastName: 'Paul',
    affiliation: 'This is my institution22',
    roles: ['health'],
    areasOfInterest: ['Pediatric Cancer Studies'],
    createdAt: '2026-06-16',
  },
  {
    id: '14',
    firstName: 'Allison',
    lastName: 'Heath',
    roles: ['research'],
    areasOfInterest: ['Neuroblastoma', 'Familial Leukemia'],
    createdAt: '2026-06-15',
  },
  {
    id: '15',
    firstName: 'Jérémy',
    lastName: 'Costanza',
    affiliation: 'CHU Sainte-Justine',
    roles: ['research'],
    areasOfInterest: ['Osteosarcoma'],
    createdAt: '2026-06-14',
  },
  {
    id: '16',
    firstName: 'Bailey K',
    lastName: 'Farrow',
    affiliation: 'CHOP',
    roles: ['research'],
    areasOfInterest: ['T-cell Acute Lymphoblastic Leukemia (ALL)'],
    createdAt: '2026-06-13',
  },
  {
    id: '17',
    firstName: 'Hot',
    lastName: 'Chiwawa',
    roles: ['community'],
    areasOfInterest: ['Hemangiomas (PHACE)'],
    createdAt: '2026-06-12',
  },
  {
    id: '18',
    firstName: 'Flying',
    lastName: 'Furret',
    roles: ['patient'],
    areasOfInterest: ['Laterality Birth Defects'],
    createdAt: '2026-06-11',
  },
  {
    id: '19',
    firstName: 'Jena-Philippe',
    lastName: 'Thibert',
    roles: ['research'],
    areasOfInterest: ['Neuroblastoma'],
    createdAt: '2026-06-10',
  },
  {
    id: '20',
    firstName: 'Aymeric',
    lastName: 'Toulouse',
    affiliation: 'Ferlab - CHU Sainte-Justine',
    roles: ['research'],
    areasOfInterest: ['Myeloid Malignancies', 'Pediatric Cancer Studies'],
    createdAt: '2026-06-09',
  },
  {
    id: '21',
    firstName: 'Jean-Philippe',
    lastName: 'Thibert',
    roles: ['research'],
    areasOfInterest: ['Ewing Sarcoma - Genetic Risk'],
    createdAt: '2026-06-08',
  },
  {
    id: '22',
    firstName: 'Alex',
    lastName: 'Lubneuski',
    roles: ['research'],
    areasOfInterest: ['Osteosarcoma'],
    createdAt: '2026-06-07',
  },
  {
    id: '23',
    firstName: 'Adrian',
    lastName: 'Paul',
    roles: ['research'],
    areasOfInterest: ['Congenital Heart Defects'],
    createdAt: '2026-06-06',
  },
  {
    id: '24',
    firstName: 'Karine',
    lastName: 'St-Onge',
    roles: ['health'],
    areasOfInterest: ['Orofacial Cleft - Latin American Ancestry'],
    createdAt: '2026-06-05',
  },
  {
    id: '25',
    firstName: 'Céline',
    lastName: 'Pelletier',
    affiliation: 'CHU Sainte-Justine',
    roles: ['research'],
    areasOfInterest: ['Neuroblastoma', 'Osteosarcoma'],
    createdAt: '2026-06-04',
  },
  {
    id: '26',
    firstName: 'Marie',
    lastName: 'Tremblay',
    affiliation: 'McGill University',
    roles: ['research'],
    areasOfInterest: ['Pediatric Cancer Studies'],
    createdAt: '2026-06-03',
  },
  {
    id: '27',
    firstName: 'John',
    lastName: 'Watson',
    affiliation: 'Linda Crnic Institute',
    roles: ['health'],
    areasOfInterest: ['Familial Leukemia'],
    createdAt: '2026-06-02',
  },
  {
    id: '28',
    firstName: 'Sophie',
    lastName: 'Nguyen',
    affiliation: 'Vanderbilt University',
    roles: ['research'],
    areasOfInterest: ['Neuroblastoma'],
    createdAt: '2026-06-01',
  },
  {
    id: '29',
    firstName: 'Liam',
    lastName: "O'Brien",
    affiliation: 'University of Chicago',
    roles: ['community'],
    areasOfInterest: ['Kidney and Urinary Tract Defects'],
    createdAt: '2026-05-31',
  },
  {
    id: '30',
    firstName: 'Emma',
    lastName: 'Roy',
    roles: ['research', 'patient'],
    areasOfInterest: ['Congenital Heart Defects', 'Neuroblastoma'],
    createdAt: '2026-05-30',
  },
  {
    id: '31',
    firstName: 'Noah',
    lastName: 'Gagnon',
    affiliation: 'Université de Montréal',
    roles: ['research'],
    areasOfInterest: ['Myeloid Malignancies'],
    createdAt: '2026-05-29',
  },
  {
    id: '32',
    firstName: 'Olivia',
    lastName: 'Côté',
    roles: ['health'],
    areasOfInterest: ['Osteosarcoma'],
    createdAt: '2026-05-28',
  },
  {
    id: '33',
    firstName: 'William',
    lastName: 'Fortin',
    affiliation: 'UNC',
    roles: ['research'],
    areasOfInterest: ['Ewing Sarcoma - Genetic Risk'],
    createdAt: '2026-05-27',
  },
  {
    id: '34',
    firstName: 'Ava',
    lastName: 'Bergeron',
    roles: ['community'],
    areasOfInterest: ['Pediatric Cancer Studies'],
    createdAt: '2026-05-26',
  },
  {
    id: '35',
    firstName: 'James',
    lastName: 'Lévesque',
    affiliation: 'Velsera',
    roles: ['health'],
    areasOfInterest: ['Neuroblastoma'],
    createdAt: '2026-05-25',
  },
];

export type FetchCommunityMembersParams = {
  /** Free-text query matched against the member name and affiliation. */
  search: string;
  /** Selected Role values (intersection with the member's roles). */
  roles: string[];
  /** Selected Area of Interest values (intersection with the member's areas of interest). */
  areasOfInterest: string[];
  sort: CommunitySort;
  /** 1-based page number. */
  pageIndex: number;
  pageSize: number;
};

export type FetchCommunityMembersResult = {
  members: CommunityMember[];
  /** Total matching the filters, before pagination. */
  total: number;
};

function matchesFilters(member: CommunityMember, search: string, roles: string[], areasOfInterest: string[]): boolean {
  if (search) {
    const haystack = `${member.firstName} ${member.lastName} ${member.affiliation ?? ''}`.toLowerCase();
    if (!haystack.includes(search.toLowerCase().trim())) {
      return false;
    }
  }
  if (roles.length > 0 && !roles.some(role => member.roles.includes(role))) {
    return false;
  }
  if (areasOfInterest.length > 0 && !areasOfInterest.some(area => member.areasOfInterest.includes(area))) {
    return false;
  }
  return true;
}

function compareMembers(a: CommunityMember, b: CommunityMember, sort: CommunitySort): number {
  switch (sort) {
    case 'oldest':
      return a.createdAt.localeCompare(b.createdAt);
    case 'name':
      return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
    case 'newest':
    default:
      return b.createdAt.localeCompare(a.createdAt);
  }
}

/**
 * Front-only stand-in for the members endpoint: filters, sorts and paginates
 * the static roster in memory.
 */
export function fetchCommunityMembers({
  search,
  roles,
  areasOfInterest,
  sort,
  pageIndex,
  pageSize,
}: FetchCommunityMembersParams): FetchCommunityMembersResult {
  const filtered = COMMUNITY_MEMBERS.filter(member => matchesFilters(member, search, roles, areasOfInterest)).sort(
    (a, b) => compareMembers(a, b, sort),
  );

  const start = (pageIndex - 1) * pageSize;
  return {
    members: filtered.slice(start, start + pageSize),
    total: filtered.length,
  };
}
