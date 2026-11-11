// @TODO: Should use api's type in the futur
export type UserSetOption = {
  id: string;
  tag: string;
  size: number;
  updated_date: string;
  created_date: string;
  setType: string;
  is_invisible: boolean;
};

export const mockSets: UserSetOption[] = [
  {
    id: '81dff16d-2216-42c5-a231-de100dc2f65a',
    tag: 'Germline Set - 1',
    size: 100,
    updated_date: '2026-07-14T12:24:24.372Z',
    setType: 'variants_germline',
    created_date: '2026-07-14T12:24:24.372Z',
    is_invisible: false,
  },
  {
    id: 'e99767d9-be4e-457a-9c6a-8bb00b18f6b5',
    tag: 'Germline Set - 2',
    size: 15,
    updated_date: '2026-07-14T12:24:43.194Z',
    setType: 'variants_germline',
    created_date: '2026-07-14T12:24:43.194Z',
    is_invisible: false,
  },
  {
    id: '6ed954e4-0027-42d8-b687-151f02acb490',
    tag: 'Germline Set - 3',
    size: 35,
    updated_date: '2026-07-14T12:25:13.293Z',
    setType: 'variants_germline',
    created_date: '2026-07-14T12:25:13.293Z',
    is_invisible: false,
  },
  {
    id: '795d0b9e-81e2-46b8-9a50-4f72b1174945',
    tag: 'Germline Set - 4',
    size: 10,
    updated_date: '2026-07-14T12:25:31.799Z',
    setType: 'variants_germline',
    created_date: '2026-07-14T12:25:31.799Z',
    is_invisible: false,
  },
  {
    id: '62de96d5-34c6-4c21-a5b6-f99ffd30c449',
    tag: 'Germline Set - 5',
    size: 18,
    updated_date: '2026-07-14T12:25:58.050Z',
    setType: 'variants_germline',
    created_date: '2026-07-14T12:25:58.050Z',
    is_invisible: false,
  },
  {
    id: '55a4cc2a-3f50-438e-a9bd-334805bafe71',
    tag: 'Somatic Set -1',
    size: 20,
    updated_date: '2026-07-14T12:26:16.775Z',
    setType: 'variants_somatic',
    created_date: '2026-07-14T12:26:16.775Z',
    is_invisible: false,
  },
  {
    id: '116dd73b-7092-43da-8f06-70a76c773e52',
    tag: 'Somatic Set - 2',
    size: 10,
    updated_date: '2026-07-14T12:26:31.822Z',
    setType: 'variants_somatic',
    created_date: '2026-07-14T12:26:31.822Z',
    is_invisible: false,
  },
  {
    id: '19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5',
    tag: 'Somatic Set - 3',
    size: 20,
    updated_date: '2026-07-14T12:26:49.885Z',
    setType: 'variants_somatic',
    created_date: '2026-07-14T12:26:49.885Z',
    is_invisible: false,
  },
  {
    id: 'a6ea3927-b211-4b78-9c93-048971f2f3d3',
    tag: 'Somatic Set - 4',
    size: 100,
    updated_date: '2026-07-14T12:27:03.336Z',
    setType: 'variants_somatic',
    created_date: '2026-07-14T12:27:03.336Z',
    is_invisible: false,
  },
];
