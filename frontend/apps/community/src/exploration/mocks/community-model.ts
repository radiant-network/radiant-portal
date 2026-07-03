import type { IFilterButtonItem } from '@/components/base/buttons/filter-button';

/**
 * A community member as displayed in the exploration directory.
 * TODO(back): replace with the generated API model once the members endpoint exists.
 */
export type CommunityMember = {
  id: string;
  firstName: string;
  lastName: string;
  affiliation?: string;
  roles: string[];
  areasOfInterest: string[];
  createdAt: string;
};

export type CommunitySort = 'newest' | 'oldest' | 'name';

/** Role options */
export const ROLE_OPTIONS: IFilterButtonItem[] = [
  { key: 'research', label: 'Researcher' },
  { key: 'health', label: 'Healthcare Professional' },
  { key: 'patient', label: 'Patient/Family Member' },
  { key: 'community', label: 'Community Member' },
];

/** Area of Interest options */
export const AREA_OF_INTEREST: IFilterButtonItem[] = [
  'Adolescent Idiopathic Scoliosis',
  'Bladder Exstrophy-Epispadias Complex',
  'Congenital Diaphragmatic Hernia',
  'Congenital Heart Defects',
  'Cornelia de Lange Syndrome',
  'Craniofacial Microsomia',
  'Disorders of Sex Development',
  'Enchondromatosis',
  'Esophageal Atresia & Tracheoesophageal',
  'Ewing Sarcoma - Genetic Risk',
  'Familial Leukemia',
  'Hemangiomas (PHACE)',
  'Intersections of Cancer & Structural Birth Defects',
  'Kidney and Urinary Tract Defects',
  'Laterality Birth Defects',
  'Leukemia & Heart Defects in Down Syndrome',
  'Microtia in Hispanic Populations',
  'Myeloid Malignancies',
  'Neuroblastoma',
  'Nonsyndromic Craniosynostosis',
  'Novel Cancer Susceptibility in Families (from BASIC3)',
  'Orofacial Cleft - African & Asian Ancestries',
  'Orofacial Cleft - European Ancestry',
  'Orofacial Cleft - Latin American Ancestry',
  'Osteosarcoma',
  'Pediatric Cancer Studies',
  'Syndromic Cranial Dysinnervation',
  'T-cell Acute Lymphoblastic Leukemia (ALL)',
].map(area => ({ key: area, label: area }));
