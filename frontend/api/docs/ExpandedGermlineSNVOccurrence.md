# ExpandedGermlineSNVOccurrence


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **string** |  | [optional] [default to undefined]
**ad_alt** | **number** |  | [optional] [default to undefined]
**ad_total** | **number** |  | [optional] [default to undefined]
**af** | **number** | TODO | [optional] [default to undefined]
**cadd_phred** | **number** |  | [optional] [default to undefined]
**cadd_score** | **number** |  | [optional] [default to undefined]
**case_id** | **number** |  | [default to undefined]
**chromosome** | **string** |  | [optional] [default to undefined]
**clinvar** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**dann_score** | **number** |  | [optional] [default to undefined]
**dna_change** | **string** |  | [optional] [default to undefined]
**end** | **number** |  | [optional] [default to undefined]
**exomiser_acmg_classification** | **string** |  | [optional] [default to undefined]
**exomiser_acmg_classification_counts** | **{ [key: string]: number; }** |  | [optional] [default to undefined]
**exomiser_acmg_evidence** | **Array&lt;string&gt;** |  | [default to undefined]
**exomiser_gene_combined_score** | **number** |  | [default to undefined]
**exon_rank** | **number** |  | [optional] [default to undefined]
**exon_total** | **number** |  | [optional] [default to undefined]
**father_calls** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**fathmm_pred** | **string** |  | [optional] [default to undefined]
**fathmm_score** | **number** |  | [optional] [default to undefined]
**filter** | **string** |  | [optional] [default to undefined]
**genotype_quality** | **number** |  | [default to undefined]
**gnomad_loeuf** | **number** |  | [optional] [default to undefined]
**gnomad_pli** | **number** |  | [optional] [default to undefined]
**gnomad_v3_af** | **number** |  | [default to undefined]
**hgvsg** | **string** |  | [default to undefined]
**interpretation_classification** | **string** |  | [optional] [default to undefined]
**interpretation_classification_counts** | **{ [key: string]: number; }** |  | [optional] [default to undefined]
**is_canonical** | **boolean** |  | [optional] [default to undefined]
**is_mane_plus** | **boolean** |  | [optional] [default to undefined]
**is_mane_select** | **boolean** |  | [optional] [default to undefined]
**locus** | **string** |  | [default to undefined]
**locus_id** | **string** |  | [default to undefined]
**mother_calls** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**omim_conditions** | [**Array&lt;OmimGenePanel&gt;**](OmimGenePanel.md) |  | [optional] [default to undefined]
**parental_origin** | **string** |  | [optional] [default to undefined]
**pc_wgs_affected** | **number** |  | [optional] [default to undefined]
**pc_wgs_not_affected** | **number** |  | [optional] [default to undefined]
**pf_wgs** | **number** |  | [optional] [default to undefined]
**pf_wgs_affected** | **number** |  | [optional] [default to undefined]
**pf_wgs_not_affected** | **number** |  | [optional] [default to undefined]
**picked_consequences** | **Array&lt;string&gt;** |  | [default to undefined]
**pn_wgs_affected** | **number** |  | [optional] [default to undefined]
**pn_wgs_not_affected** | **number** |  | [optional] [default to undefined]
**qd** | **number** |  | [optional] [default to undefined]
**revel_score** | **number** |  | [optional] [default to undefined]
**rsnumber** | **string** |  | [optional] [default to undefined]
**sift_pred** | **string** |  | [optional] [default to undefined]
**sift_score** | **number** |  | [optional] [default to undefined]
**spliceai_ds** | **number** |  | [optional] [default to undefined]
**spliceai_type** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**start** | **number** |  | [optional] [default to undefined]
**symbol** | **string** |  | [optional] [default to undefined]
**transcript_id** | **string** |  | [optional] [default to undefined]
**transmission** | **string** |  | [optional] [default to undefined]
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] [default to undefined]
**zygosity** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ExpandedGermlineSNVOccurrence } from './api';

const instance: ExpandedGermlineSNVOccurrence = {
    aa_change,
    ad_alt,
    ad_total,
    af,
    cadd_phred,
    cadd_score,
    case_id,
    chromosome,
    clinvar,
    dann_score,
    dna_change,
    end,
    exomiser_acmg_classification,
    exomiser_acmg_classification_counts,
    exomiser_acmg_evidence,
    exomiser_gene_combined_score,
    exon_rank,
    exon_total,
    father_calls,
    fathmm_pred,
    fathmm_score,
    filter,
    genotype_quality,
    gnomad_loeuf,
    gnomad_pli,
    gnomad_v3_af,
    hgvsg,
    interpretation_classification,
    interpretation_classification_counts,
    is_canonical,
    is_mane_plus,
    is_mane_select,
    locus,
    locus_id,
    mother_calls,
    omim_conditions,
    parental_origin,
    pc_wgs_affected,
    pc_wgs_not_affected,
    pf_wgs,
    pf_wgs_affected,
    pf_wgs_not_affected,
    picked_consequences,
    pn_wgs_affected,
    pn_wgs_not_affected,
    qd,
    revel_score,
    rsnumber,
    sift_pred,
    sift_score,
    spliceai_ds,
    spliceai_type,
    start,
    symbol,
    transcript_id,
    transmission,
    vep_impact,
    zygosity,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
