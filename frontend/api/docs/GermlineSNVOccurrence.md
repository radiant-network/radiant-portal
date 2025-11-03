# GermlineSNVOccurrence

GermlineSNVOccurrence represents a germline SNV occurrence

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **string** |  | [optional] [default to undefined]
**ad_ratio** | **number** |  | [default to undefined]
**chromosome** | **string** |  | [default to undefined]
**clinvar** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**exomiser_acmg_classification** | **string** |  | [default to undefined]
**exomiser_acmg_evidence** | **Array&lt;string&gt;** |  | [default to undefined]
**exomiser_gene_combined_score** | **number** |  | [default to undefined]
**exomiser_moi** | **string** |  | [default to undefined]
**exomiser_variant_score** | **number** |  | [default to undefined]
**filter** | **string** |  | [optional] [default to undefined]
**genotype_quality** | **number** |  | [default to undefined]
**gnomad_v3_af** | **number** |  | [default to undefined]
**has_interpretation** | **boolean** |  | [default to undefined]
**hgvsg** | **string** |  | [default to undefined]
**is_canonical** | **boolean** |  | [optional] [default to undefined]
**is_mane_plus** | **boolean** |  | [optional] [default to undefined]
**is_mane_select** | **boolean** |  | [optional] [default to undefined]
**locus** | **string** |  | [default to undefined]
**locus_id** | **string** |  | [default to undefined]
**max_impact_score** | **number** |  | [default to undefined]
**omim_inheritance_code** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**pc_wgs** | **number** |  | [optional] [default to undefined]
**pf_wgs** | **number** |  | [default to undefined]
**picked_consequences** | **Array&lt;string&gt;** |  | [default to undefined]
**pn_wgs** | **number** |  | [optional] [default to undefined]
**rsnumber** | **string** |  | [optional] [default to undefined]
**seq_id** | **number** |  | [default to undefined]
**start** | **number** |  | [default to undefined]
**symbol** | **string** |  | [optional] [default to undefined]
**task_id** | **number** |  | [default to undefined]
**transcript_id** | **string** |  | [optional] [default to undefined]
**variant_class** | **string** |  | [default to undefined]
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] [default to undefined]
**zygosity** | **string** |  | [default to undefined]

## Example

```typescript
import { GermlineSNVOccurrence } from './api';

const instance: GermlineSNVOccurrence = {
    aa_change,
    ad_ratio,
    chromosome,
    clinvar,
    exomiser_acmg_classification,
    exomiser_acmg_evidence,
    exomiser_gene_combined_score,
    exomiser_moi,
    exomiser_variant_score,
    filter,
    genotype_quality,
    gnomad_v3_af,
    has_interpretation,
    hgvsg,
    is_canonical,
    is_mane_plus,
    is_mane_select,
    locus,
    locus_id,
    max_impact_score,
    omim_inheritance_code,
    pc_wgs,
    pf_wgs,
    picked_consequences,
    pn_wgs,
    rsnumber,
    seq_id,
    start,
    symbol,
    task_id,
    transcript_id,
    variant_class,
    vep_impact,
    zygosity,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
