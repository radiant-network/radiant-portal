export const germlineTwoSets = {
  summary: [
    {
      operation: 'Q₁',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 33,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
        ],
        id: 'e9d723e9-b1de-49f0-9508-bb5ccb4f7d64',
        op: 'and',
      },
    },
    {
      operation: 'Q₂',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 100,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
            },
            op: 'in',
          },
        ],
        id: 'c4db82ab-517b-42f0-8d88-ed65ff5768ef',
        op: 'and',
      },
    },
  ],
  operations: [
    {
      operation: 'Q₁-Q₂',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants',
                      value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 18,
      setId: 'set-0',
    },
    {
      operation: 'Q₂-Q₁',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants',
                      value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 85,
      setId: 'set-1',
    },
    {
      operation: 'Q₁∩Q₂',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants',
                  value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
        ],
      },
      count: 15,
      setId: 'set-2',
    },
  ],
};

export const germlineThreeSets = {
  summary: [
    {
      operation: 'Q₁',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 33,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
        ],
        id: '15f7910a-3184-4b4f-8df6-a9324f932179',
        op: 'and',
      },
    },
    {
      operation: 'Q₂',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 46,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
            },
            op: 'in',
          },
        ],
        id: 'af20eb7f-93d3-4449-9b60-f65c98033f3b',
        op: 'and',
      },
    },
    {
      operation: 'Q₃',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 100,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
            },
            op: 'in',
          },
        ],
        id: '578d4edb-f81b-484b-90b4-f4e19e0edf6e',
        op: 'and',
      },
    },
  ],
  operations: [
    {
      operation: 'Q₁-(Q₂∪Q₃)',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                op: 'or',
                content: [
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants',
                          value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants',
                          value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                ],
              },
            ],
          },
        ],
      },
      count: 18,
      setId: 'set-0',
    },
    {
      operation: 'Q₂-(Q₁∪Q₃)',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                op: 'or',
                content: [
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants',
                          value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants',
                          value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                ],
              },
            ],
          },
        ],
      },
      count: 0,
      setId: 'set-1',
    },
    {
      operation: 'Q₃-(Q₁∪Q₂)',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                op: 'or',
                content: [
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants',
                          value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants',
                          value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                ],
              },
            ],
          },
        ],
      },
      count: 54,
      setId: 'set-2',
    },
    {
      operation: '(Q₁∩Q₂)-Q₃',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants',
                  value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants',
                      value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 0,
      setId: 'set-3',
    },
    {
      operation: '(Q₂∩Q₃)-Q₁',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants',
                  value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants',
                      value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 31,
      setId: 'set-4',
    },
    {
      operation: '(Q₁∩Q₃)-Q₂',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants',
                  value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants',
                      value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 0,
      setId: 'set-5',
    },
    {
      operation: 'Q₁∩Q₂∩Q₃',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants',
              value: ['set_id:e99767d9-be4e-457a-9c6a-8bb00b18f6b5'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants',
                  value: ['set_id:6ed954e4-0027-42d8-b687-151f02acb490'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants',
                  value: ['set_id:81dff16d-2216-42c5-a231-de100dc2f65a'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
        ],
      },
      count: 15,
      setId: 'set-6',
    },
  ],
};

export const somaticTwoSets = {
  summary: [
    {
      operation: 'Q₁',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 43,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
        ],
        id: '6ff66075-2722-415d-a4d1-7a54385fa434',
        op: 'and',
      },
    },
    {
      operation: 'Q₂',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 60,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
            },
            op: 'in',
          },
        ],
        id: '07352ff3-305e-4eec-95f9-3c50d96745ac',
        op: 'and',
      },
    },
  ],
  operations: [
    {
      operation: 'Q₁-Q₂',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants_somatic',
                      value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 19,
      setId: 'set-0',
    },
    {
      operation: 'Q₂-Q₁',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants_somatic',
                      value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 36,
      setId: 'set-1',
    },
    {
      operation: 'Q₁∩Q₂',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants_somatic',
                  value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
        ],
      },
      count: 24,
      setId: 'set-2',
    },
  ],
};

export const somaticThreeSets = {
  summary: [
    {
      operation: 'Q₁',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 43,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
        ],
        id: '67c954be-165d-4718-bc7a-55e3d0bf1337',
        op: 'and',
      },
    },
    {
      operation: 'Q₂',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 60,
    },
    {
      operation: 'Q₃',
      sqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
            },
            op: 'in',
          },
        ],
        op: 'and',
      },
      count: 50,
      qbSqon: {
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
            },
            op: 'in',
          },
        ],
        id: '66e5b14a-0b8b-4b68-8eb5-b459a38f3f87',
        op: 'and',
      },
    },
  ],
  operations: [
    {
      operation: 'Q₁-(Q₂∪Q₃)',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                op: 'or',
                content: [
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants_somatic',
                          value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants_somatic',
                          value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                ],
              },
            ],
          },
        ],
      },
      count: 4,
      setId: 'set-0',
    },
    {
      operation: 'Q₂-(Q₁∪Q₃)',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                op: 'or',
                content: [
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants_somatic',
                          value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants_somatic',
                          value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                ],
              },
            ],
          },
        ],
      },
      count: 16,
      setId: 'set-1',
    },
    {
      operation: 'Q₃-(Q₁∪Q₂)',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
            },
            op: 'in',
          },
          {
            op: 'not',
            content: [
              {
                op: 'or',
                content: [
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants_somatic',
                          value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                  {
                    content: [
                      {
                        content: {
                          field: 'locus',
                          index: 'variants_somatic',
                          value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
                        },
                        op: 'in',
                      },
                    ],
                    op: 'and',
                  },
                ],
              },
            ],
          },
        ],
      },
      count: 6,
      setId: 'set-2',
    },
    {
      operation: '(Q₁∩Q₂)-Q₃',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants_somatic',
                  value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants_somatic',
                      value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 15,
      setId: 'set-3',
    },
    {
      operation: '(Q₂∩Q₃)-Q₁',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants_somatic',
                  value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants_somatic',
                      value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 20,
      setId: 'set-4',
    },
    {
      operation: '(Q₁∩Q₃)-Q₂',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants_somatic',
                  value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            op: 'not',
            content: [
              {
                content: [
                  {
                    content: {
                      field: 'locus',
                      index: 'variants_somatic',
                      value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
                    },
                    op: 'in',
                  },
                ],
                op: 'and',
              },
            ],
          },
        ],
      },
      count: 15,
      setId: 'set-5',
    },
    {
      operation: 'Q₁∩Q₂∩Q₃',
      sqon: {
        op: 'and',
        content: [
          {
            content: {
              field: 'locus',
              index: 'variants_somatic',
              value: ['set_id:116dd73b-7092-43da-8f06-70a76c773e52'],
            },
            op: 'in',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants_somatic',
                  value: ['set_id:55a4cc2a-3f50-438e-a9bd-334805bafe71'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          {
            content: [
              {
                content: {
                  field: 'locus',
                  index: 'variants_somatic',
                  value: ['set_id:19dfd7a6-35b7-4a09-8cee-4a5b5ef7bac5'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
        ],
      },
      count: 9,
      setId: 'set-6',
    },
  ],
};
