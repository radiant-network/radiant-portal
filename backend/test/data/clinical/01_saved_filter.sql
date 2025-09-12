INSERT INTO saved_filter (user_id, name, type, favorite, queries, created_on, updated_on)
VALUES ('1', 'saved_filter_snv_1', 'germline_snv_occurrence', false, '[{
  "content": [
    {
      "content": {
        "field": "chromosome",
        "value": [
          "X"
        ]
      },
      "op": "in"
    }
  ],
  "op": "and"
}]', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       ('1', 'saved_filter_cnv_1', 'germline_cnv_occurrence', true, '[{
  "content": [
    {
      "content": {
        "field": "chromosome",
        "value": [
          "1"
        ]
      },
      "op": "in"
    }
  ],
  "op": "and"
}]', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00'),
       ('2', 'saved_filter_snv_2', 'germline_snv_occurrence', false, '[{
  "content": [
    {
      "content": {
        "field": "chromosome",
        "value": [
          "2"
        ]
      },
      "op": "in"
    }
  ],
  "op": "and"
}]', '2021-09-12T13:08:00-04:00', '2021-09-12T13:08:00-04:00')