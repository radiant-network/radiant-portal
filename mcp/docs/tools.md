# What each tool does

This page explains, in plain words, what each tool of the Radiant assistant
(D.A.V.I.D) gives back and how it decides. It is meant for anyone who uses or
reviews the assistant's answers: geneticists, clinicians, bioinformaticians.
How the tools are built is in the [developer guide](developer-guide.md).

The assistant chooses and calls these tools itself. Knowing what they do helps
to ask good questions and to judge an answer.

## Rules for every tool

**Everything runs as you.** The assistant sees exactly what you can see in the
portal, no more. Two users asking the same question can get different answers.

**One tenant at a time.** A tenant is a site or project (for example a
research cohort). If you belong to one tenant it is chosen for you; if you
belong to several, the assistant asks which one.

**Links back to the portal.** Cases, patients, variants and occurrences come
with a link that opens the matching page of the portal, when the portal
address is configured. A patient link appears only when the portal's patient
page is available for that tenant and you may see that patient.

**Answers say what they left out.** When a list is cut, the answer says so and
says which list (the few exceptions are named in the tools below). Warnings
name the parts that could not be read (a portal section that failed, an
analysis not loaded yet). Errors say what to fix: an unknown value comes with
the list of accepted values.

**Gene names.** Use the official gene symbol (ERBB2, not HER2; TP53, not P53)
or the Ensembl gene id. Other names are not recognised: the assistant is told
to ask for the official symbol.

## Case tables versus analyses

Two kinds of tools read variants, and they do not apply the same rules.

**The case tables** (prioritize_snv, case_cnv, variant_details,
variant_carriers) show exactly what the portal shows for a case or a variant:
every call of the analysis you point to, with the portal's own filters. They
apply none of the rules below.

**The analyses** (second_hit, cohort_carriers, genotype_phenotype, oncoprint,
lollipop, the carrier groups of survival_curve, and family_venn where noted)
compute their own answers, and follow these rules:

- **Re-analyses.** When a sequencing was analysed again, only its latest
  analysis is read. An analysis the pipeline has not finished loading is
  ignored until it is loaded, and the previous one is used meanwhile.
- **Somatic variants come from tumor-normal analyses only.** A tumor-only
  analysis cannot tell the patient's germline (constitutional) variants from
  the tumor's own: most of what it calls is germline. So the somatic small
  variants (SNVs) come from analyses that compare the tumor with a normal
  sample of the same patient. Somatic copy number changes (CNVs) are the
  exception: the platform only produces them from tumor-only calling, so they
  are used as they are.
- **Germline call quality.** A germline variant call counts only when it
  passes the same quality rule as the portal's variant frequencies: the
  variant passes the caller's filters, the genotype quality is at least 20
  and at least 3 reads show the variant. The second-hit search keeps the
  calls that fail this rule, marked as low quality, so a real but poorly
  covered event is not hidden. family_venn does not apply it.
- **Somatic call quality.** A somatic variant call counts as a carrier only
  when it passes the portal's somatic frequency rule: the variant passes the
  caller's filters and at least 2 tumor reads show it. The second-hit search
  keeps the passing calls with fewer reads, marked as low quality.
- **Which variants are "in" a gene.** A variant belongs to a gene when it has
  a consequence on one of that gene's transcripts, not only on the transcript
  the annotation picked. A variant inside an intron counts. A variant only
  near the gene (just upstream or downstream of it, as the annotation reports
  for every gene within 5 kb) does not. A variant can therefore belong to two
  overlapping genes. Its impact is its most severe impact on that gene; the
  protein change shown is the one of the picked transcript, which can belong
  to the overlapping gene.
- **A classification belongs to the variant, not to every gene it is in.** A
  P/LP classification (ClinVar, Exomiser, a portal interpretation) and the
  ClinVar filter count for a gene only when it is the gene the annotation
  picked, or the variant has an effect there (impact at least LOW). A variant
  pathogenic for one gene and only intronic in a gene nested in it is not
  pathogenic for the nested gene; a deep intronic pathogenic variant still
  counts for its own gene.
- **Families.** In a germline case, the parents' and siblings' sequencings
  belong to the proband's case. When a tool counts cases, it says whether it
  counts the cases where the proband carries the variant, or those where any
  member does.

**Common words.** *Rare* means a gnomAD v3 frequency below 1 %, or absent
from gnomAD. In the second-hit search, *P/LP* (pathogenic or likely
pathogenic) means classified so by ClinVar, by Exomiser, or by a geneticist
in a portal interpretation. Elsewhere, a ClinVar filter means the ClinVar
classification only.

## Finding the right case or patient

### list_tenants

Lists the tenants you belong to, with your permissions in each. The assistant
uses it when it needs to ask you which tenant you mean.

### search_cases

Finds cases, either from an identifier you give (case number, medical record
number, sample id of the proband, sequencing id) or from criteria ("active
prenatal cases", "cases on panel RGDI"). Returns a short summary of each case:
type, status, priority, panel, main condition, project, proband. Up to 100
cases per answer; the total is given, or a lower bound when a search by
identifier was cut.

*Example:* "Find the case of patient MRN 12345."

### search_patients

Finds patients of the portal's patient list, by identifier or name, or by
clinical criteria (diagnosis, vital status, age group at diagnosis,
radiation, chemotherapy agents). Returns identifiers, demographics, vital
status, initial diagnosis and survival. Names are hidden when you are not
allowed to see them. Patients not yet in the portal's key table have no
patient key: they are left out, with a warning, and paging uses the returned
next offset. A tenant with no clinical data says so.

*Example:* "Deceased patients with a medulloblastoma."

## One case

### get_case_context

The starting point for any question about one case. Returns the case
(type, status, analysis, panel, main condition, diagnosis hypothesis,
prescriber, lab, note), its members (relationship to the proband, sex,
affected status, observed and absent HPO phenotypes, family history), its
sequencings, and the list of analyses that produced variants, for each
sequencing and data type (several when a sequencing was analysed again; an
analysis not loaded yet is marked and listed last). That list is what the
variant tools below need.

### prioritize_snv

Ranks and filters the small variants (SNVs) of one analysis of a case, with
the same data, filters and order as the SNV table of the case in the portal.
Germline by default: ranked by the Exomiser gene score, then by impact.
Somatic tumor-normal and tumor-only analyses can be read too here, since this
is the case's own variant table. Filters include gene, impact, consequence,
ClinVar, frequencies, gene panels, prediction scores, and for germline the
zygosity, transmission, parental origin and Exomiser classification.

*Example:* "The rare high-impact variants of case 1131 in the epilepsy panel."

### case_cnv

Lists and filters the copy number changes (CNVs) of one analysis of a case,
like the CNV table of the case in the portal: type (loss, gain, copy-neutral
loss of heterozygosity, gain with loss of heterozygosity), genes covered,
position, length, copy number, quality, gene panels. No CNV analysis listed
for a sequencing means none was done.

### variant_details

Everything the portal knows about one variant: gene and consequences on the
main transcripts, impact, prediction scores (CADD, REVEL, SpliceAI and
others), gene constraint, OMIM conditions, ClinVar, frequencies in public
databases and in the Radiant cohort, and how geneticists classified it in
other cases. Given a case, it also returns the variant as seen in that case:
genotype, read depth, quality, transmission, parental origin, Exomiser.

### variant_carriers

The cases of the tenant that carry one germline variant (the case you are
looking at included), as on the portal's variant page: the cases where a
geneticist interpreted it (classification, condition, zygosity, phenotypes)
and those where it is present but not interpreted. Up to 100 cases per list.

### second_hit

Looks for genes hit twice in a case, a common mechanism of recessive and
tumor-suppressor disease.

- **Germline case**, for each sequenced person:
  - a rare variant, of high or moderate impact or classified P/LP, in a gene
    also covered by a deletion. Either the variant is heterozygous anywhere
    in the gene (possibly on the other copy), or it looks homozygous because
    it lies inside the deletion (only one copy is left). The answer says
    which. The other members' deletions over the same gene are shown, which
    can explain an unexpected genotype in a parent;
  - the compound heterozygous pairs found by the pipeline.
- **Somatic case:** genes where the patient has a germline P/LP variant
  (from their germline sequencing) and the tumor has a second event in the
  same gene: a somatic variant of high or moderate impact from a tumor-normal
  analysis, or a loss or copy-neutral loss of heterozygosity. When the
  germline variant itself shows up in the tumor, it is not counted as a
  second hit; when its share of reads in the tumor is high (60 % or more,
  for a germline heterozygous variant), the answer flags a possible loss of
  the normal copy, to be checked, since the tumor purity is not known.
  Tumor-only small-variant analyses are not used.

Each answer states the exact rules it applied. The impact shown is the
variant's most severe impact on the gene reported; the protein change shown
is the one of the transcript the annotation picked, which can belong to an
overlapping gene. Low-quality germline calls are shown and marked. Each list
stops at 200 entries, and the answer says when one was cut.

### family_venn

A Venn diagram of the variants shared by the proband and the parents (a trio)
or one parent (a duo), with the count in each region. In a trio, the variants
found only in the proband are the de novo candidates; in a duo, that region
also holds what came from the parent who was not sequenced. Can be limited to
rare variants or to some impacts. This chart counts every call, without the
germline quality rule.

## One patient

### get_patient_context

The starting point for any question about one patient's clinical history, as
on the portal's patient page: identifiers, demographics, vital status,
diagnoses and their dates, tumor and metastases, then treatments (surgeries,
radiation, medical therapies), laboratory results, imaging sessions, the
patient's cases and the variants interpreted in them, and trial
eligibilities. A part that cannot be read is named; the rest is still given.

### patient_timeline

A picture of one patient's history on a single age axis: diagnosis,
progression and recurrence, surgeries, radiation and chemotherapy periods,
imaging sessions and vital status.

## A gene or the whole cohort

### gene_info

What is known about a gene, independently of any patient: OMIM conditions and
their inheritance, associated HPO phenotypes, Orphanet disorders, membership
of the DDD and COSMIC cancer gene lists, the tenant's own gene panels that
contain it, and the gnomAD constraint scores (pLI, LOEUF) of its 10
transcripts with the highest pLI. Long lists are cut (100 HPO terms, 50 OMIM
conditions, 50 Orphanet disorders) and the answer says so.

### lookup_terms

Finds HPO phenotype terms or MONDO disease terms by name or by the beginning
of their id. The assistant uses it to name a code, or to find the MONDO id of
a condition for an interpretation draft, rather than inventing one.

### cohort_carriers

Who carries a variant in a gene, across the tenant. Works on germline or
somatic small variants, or germline or somatic CNVs, with optional filters:
impact, ClinVar classification, rarity, zygosity, CNV type.

Returns:
- the number of **cases** where the proband carries, the number of cases
  where **any member** carries (a parent alone included), the number of
  carrier **patients** (relatives included) and the number of variants;
- the list of carriers, most variants first, with their case, family role,
  affected status, number of matching variants (and CNV types) and a link to
  the first one (up to 200);
- counts by consequence (on the gene itself, and only the consequences of
  the variant's most severe impact there: a stop gained that is intronic on
  another transcript counts as stop gained only), by variant class, by CNV
  type and by family role, each limited to its 30 largest entries.

The answer lists the filters and rules actually applied.

*Example:* "How many cases carry a rare pathogenic variant in SCN1A?"

### genotype_phenotype

The observed HPO phenotypes of a gene's carriers (same carriers and filters
as cohort_carriers), with how many carriers have each phenotype, most frequent
first. The number of carriers that have any recorded phenotype is given, to
use as the denominator. Given one phenotype, it also lists the carriers that
have it. Phenotypes recorded for a fetus are left out, since a fetal sample is
filed under its mother.

### survival_curve

Kaplan-Meier survival curves of 2 to 6 groups of patients, with the log-rank
test. A group can be a list of patients, patients matching clinical criteria
(as in search_patients), or the carriers of a variant in a gene (as in
cohort_carriers). Every group can be restricted to one cohort (for example a
diagnosis), and an extra group can hold "everyone else in the cohort".

Time runs from the initial diagnosis to the date of the last vital status;
the event is death. To compare carriers with non-carriers fairly, the
"sequenced only" option keeps only patients whose genotype is known: those
with a loaded analysis of the same kind as the carriers (a germline case says
nothing about a tumor gene).

Returns the chart and, per group, the number of patients, deaths and the
median survival, the log-rank p-value (or why there is none: overlapping
groups, no death...) and the patients left out and why. The patients are
read from the portal's clinical patient list, with the same filters and your
own rights, in one query per group; up to 50,000 patients, beyond that the
answer says the cohort was cut.

### oncoprint

A grid of genes (rows) by cases (columns) showing which cases have an
alteration in each gene, and of what kind: truncating, splice, missense,
in-frame or other for small variants; the CNV type for copy number changes;
"multiple" when a case has several kinds in one gene. Up to 20 genes and 100
cases shown, most altered first; the counts cover every altered case. In a
germline case only the proband counts. Germline small variants have no rarity
or impact filter unless asked, so common polymorphisms appear: the answer
warns about it.

*Example:* "An oncoprint of TP53, RB1 and MYCN in the tumors."

### lollipop

The carriers' variants drawn along the protein of a gene: each variant at its
protein position, its height the number of carrier patients, its colour the
kind of change. The variants are drawn on the transcript most of them are
described on, which the answer names. Variants on other transcripts, without
a protein change, or described on an overlapping gene are counted, not drawn.
Same filters as cohort_carriers, for germline or tumor-normal somatic small
variants. At most the 5,000 variants with the most carriers are used; the
answer says when there were more.

### bar_chart

Draws a bar chart of numbers the assistant already obtained with another tool
(for example carriers per consequence, patients per diagnosis). The assistant
is told never to use patient names or identifiers as labels.

## Direct database access

These are the last resort, for questions no tool above can answer. They read
the database directly, still with your own access rights.

### describe_schema

Describes the database tables of one topic (germline variants, somatic
variants, CNVs, annotations, frequencies, clinical data): which tables to use,
how they connect, the stored values, and example queries. The assistant reads
it before writing a query.

### read_query

Runs a database query written by the assistant and returns at most a few
hundred rows, saying when more exist. The assistant is told to send one query
at a time; if it sends several, all of them run, only the first result is
shown and the answer says how many were not shown.

### table_overview

Shows the columns, the number of rows and three sample rows of one table.
