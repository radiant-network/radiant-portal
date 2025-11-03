# VariantOverview


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**aa_change** | **string** |  | [optional] [default to undefined]
**cadd_phred** | **number** |  | [optional] [default to undefined]
**cadd_score** | **number** |  | [optional] [default to undefined]
**clinvar** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**clinvar_name** | **string** |  | [optional] [default to undefined]
**dann_score** | **number** |  | [optional] [default to undefined]
**dna_change** | **string** |  | [optional] [default to undefined]
**exomiser_acmg_classification_counts** | **{ [key: string]: number; }** |  | [optional] [default to undefined]
**exon_rank** | **number** |  | [optional] [default to undefined]
**exon_total** | **number** |  | [optional] [default to undefined]
**fathmm_pred** | **string** |  | [optional] [default to undefined]
**fathmm_score** | **number** |  | [optional] [default to undefined]
**gnomad_loeuf** | **number** |  | [optional] [default to undefined]
**gnomad_pli** | **number** |  | [optional] [default to undefined]
**gnomad_v3_af** | **number** |  | [default to undefined]
**interpretation_classification_counts** | **{ [key: string]: number; }** |  | [optional] [default to undefined]
**is_canonical** | **boolean** |  | [default to undefined]
**is_mane_plus** | **boolean** |  | [default to undefined]
**is_mane_select** | **boolean** |  | [default to undefined]
**locus** | **string** |  | [default to undefined]
**lrt_pred** | **string** |  | [optional] [default to undefined]
**lrt_score** | **number** |  | [optional] [default to undefined]
**omim_conditions** | [**Array&lt;OmimGenePanel&gt;**](OmimGenePanel.md) |  | [optional] [default to undefined]
**pc_wgs** | **number** |  | [optional] [default to undefined]
**pf_wgs** | **number** |  | [default to undefined]
**phyloP17way_primate** | **number** |  | [optional] [default to undefined]
**picked_consequences** | **Array&lt;string&gt;** |  | [default to undefined]
**pn_wgs** | **number** |  | [optional] [default to undefined]
**polyphen2_hvar_pred** | **string** |  | [optional] [default to undefined]
**polyphen2_hvar_score** | **number** |  | [optional] [default to undefined]
**revel_score** | **number** |  | [optional] [default to undefined]
**rsnumber** | **string** |  | [optional] [default to undefined]
**sift_pred** | **string** |  | [optional] [default to undefined]
**sift_score** | **number** |  | [optional] [default to undefined]
**spliceai_ds** | **number** |  | [optional] [default to undefined]
**spliceai_type** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**symbol** | **string** |  | [optional] [default to undefined]
**transcript_id** | **string** |  | [optional] [default to undefined]
**vep_impact** | [**VepImpact**](VepImpact.md) |  | [optional] [default to undefined]

## Example

```typescript
import { VariantOverview } from './api';

const instance: VariantOverview = {
    aa_change,
    cadd_phred,
    cadd_score,
    clinvar,
    clinvar_name,
    dann_score,
    dna_change,
    exomiser_acmg_classification_counts,
    exon_rank,
    exon_total,
    fathmm_pred,
    fathmm_score,
    gnomad_loeuf,
    gnomad_pli,
    gnomad_v3_af,
    interpretation_classification_counts,
    is_canonical,
    is_mane_plus,
    is_mane_select,
    locus,
    lrt_pred,
    lrt_score,
    omim_conditions,
    pc_wgs,
    pf_wgs,
    phyloP17way_primate,
    picked_consequences,
    pn_wgs,
    polyphen2_hvar_pred,
    polyphen2_hvar_score,
    revel_score,
    rsnumber,
    sift_pred,
    sift_score,
    spliceai_ds,
    spliceai_type,
    symbol,
    transcript_id,
    vep_impact,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
