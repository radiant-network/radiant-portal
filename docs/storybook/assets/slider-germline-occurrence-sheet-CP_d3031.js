import{g as A,r as g,j as e,S as z,b as k,d as T,e as C}from"./iframe-C1u-2gre.js";import{S as B,a as U,u as F,b as $,c as X,d as W,e as Q,I as K,f as Z,g as J,h as Y}from"./slider-variant-details-card-C98ZU0uk.js";import{a as ee}from"./notes-container-DiwTyp66.js";import{N as te}from"./notes-slider-sheet-BzjsKjcl.js";import{B as L}from"./button-Dktn9BJ3.js";import{S as ie}from"./separator-DPfAxmJm.js";import{P as se,a as ae}from"./pedigree-male-not-affected-icon-CDafpo0w.js";import{S as re}from"./shape-triangle-up-icon-3FeZhYPF.js";import{u as ne,i as oe}from"./index-CKlqh2ii.js";import{D as le,b as de,f as E,c as ce,d as me}from"./dialog-Cm870SRn.js";import{u as I,t as D,r as N}from"./i18n-D_VZFZgc.js";import{B as v}from"./badge-CM7StMV8.js";import{D as j,a as h}from"./description-DreGU92S.js";import{t as S}from"./number-format-CWBLyO08.js";import{E as f}from"./empty-field-bQsSwYoU.js";import{U as ue}from"./users-DcYd6vAP.js";import{_ as pe,a as he}from"./helper-CicCyW-y.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"m17 3-5 5-5-5h10",key:"1ftt6x"}],["path",{d:"m17 21-5-5-5 5h10",key:"1m0wmu"}],["path",{d:"M4 12H2",key:"rhcxmi"}],["path",{d:"M10 12H8",key:"s88cx1"}],["path",{d:"M16 12h-2",key:"10asgb"}],["path",{d:"M22 12h-2",key:"14jgyd"}]],ge=A("FlipVertical2",fe);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"14u9p9"}]],ye=A("Triangle",xe),_e=g.createContext(null);function ve(){const t=g.useContext(_e);if(!t)throw new Error("useOccurrenceListContext must be used within OccurrencesListContext");return t}const O=({id:t="igvContainer",className:a="",options:s})=>{const u=g.useRef(null),[p,c]=g.useState(null),[r,d]=g.useState(null);return g.useEffect(()=>{var n;u.current&&window.igv.browser!==!0&&!p&&((n=s.tracks)==null?void 0:n.length)>0&&(window.igv.browser=!0,window.igv.createBrowser(u.current,s).then(m=>{window.igv.browser=m,c(m),d(s)}))},[s.tracks]),g.useEffect(()=>{p&&(r==null?void 0:r.locus)!==s.locus&&(p.search(s.locus),d(s))},[s,r]),e.jsx("div",{id:t,ref:u,className:a})};O.__docgenInfo={description:"",methods:[],displayName:"IGV",props:{id:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'igvContainer'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},options:{required:!0,tsType:{name:"IIGVBrowserOptions"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:""}}};const P=({locus:t,tracks:a})=>e.jsx(O,{className:"igvContainer",options:{palette:["#00A0B0","#6A4A3C","#CC333F","#EB6841"],reference:{id:"hg38_1kg",ucscID:"hg38",blatDB:"hg38",name:"Human (hg38 1kg/GATK)",fastaURL:"https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome/GRCh38_full_analysis_set_plus_decoy_hla.fa",indexURL:"https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome/GRCh38_full_analysis_set_plus_decoy_hla.fa.fai",cytobandURL:"https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz",tracks:[{name:"Refseq Genes",format:"refgene",url:"https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz",indexURL:"https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz.tbi",order:0,visibilityWindow:-1,displayMode:"EXPANDED",autoHeight:!0,maxHeight:160}]},locus:t,tracks:a}});P.__docgenInfo={description:"",methods:[],displayName:"IgvContainer",props:{locus:{required:!0,tsType:{name:"string"},description:""},tracks:{required:!0,tsType:{name:"Array",elements:[{name:"intersection",raw:`IGVTrackEnriched & {
  /**
   * Integer value specifying relative order of track position on the screen. To pin a track to the bottom use Number.MAX_VALUE. If no order is specified, tracks appear in order of their addition.
   */
  order?: number;
  /**
   * Maximum window size in base pairs for which indexed annotations or variants are displayed  1 MB for variants, 30 KB for alignments, whole chromosome for other track types
   */
  visibilityWindow?: number;
  /**
   * CSS color value for track features, e.g. "#ff0000" or "rgb(100,0,100)"
   */
  color?: string;
  /**
   * Annotation display mode, one of "COLLAPSED", "EXPANDED", "SQUISHED"  "COLLAPSED"
   * @default COLLAPSED
   */
  displayMode?: 'COLLAPSED' | 'EXPANDED' | 'SQUISHED';
  /**
   * Initial height of track viewport in pixels
   * @default 50
   */
  height?: number;
  /**
   * If true, then track height is adjusted dynamically, within the bounds set by minHeight and maxHeight, to accomdodate features in view
   * @default true;
   */
  autoHeight?: boolean;
  /**
   * Minimum height of track in pixels  50
   * @default 50
   */
  minHeight?: number;
  /**
   * Maximum height of track in pixels
   * @default 500
   */
  maxHeight?: number;
}`,elements:[{name:"IGVTrackEnriched"},{name:"signature",type:"object",raw:`{
  /**
   * Integer value specifying relative order of track position on the screen. To pin a track to the bottom use Number.MAX_VALUE. If no order is specified, tracks appear in order of their addition.
   */
  order?: number;
  /**
   * Maximum window size in base pairs for which indexed annotations or variants are displayed  1 MB for variants, 30 KB for alignments, whole chromosome for other track types
   */
  visibilityWindow?: number;
  /**
   * CSS color value for track features, e.g. "#ff0000" or "rgb(100,0,100)"
   */
  color?: string;
  /**
   * Annotation display mode, one of "COLLAPSED", "EXPANDED", "SQUISHED"  "COLLAPSED"
   * @default COLLAPSED
   */
  displayMode?: 'COLLAPSED' | 'EXPANDED' | 'SQUISHED';
  /**
   * Initial height of track viewport in pixels
   * @default 50
   */
  height?: number;
  /**
   * If true, then track height is adjusted dynamically, within the bounds set by minHeight and maxHeight, to accomdodate features in view
   * @default true;
   */
  autoHeight?: boolean;
  /**
   * Minimum height of track in pixels  50
   * @default 50
   */
  minHeight?: number;
  /**
   * Maximum height of track in pixels
   * @default 500
   */
  maxHeight?: number;
}`,signature:{properties:[{key:"order",value:{name:"number",required:!1},description:"Integer value specifying relative order of track position on the screen. To pin a track to the bottom use Number.MAX_VALUE. If no order is specified, tracks appear in order of their addition."},{key:"visibilityWindow",value:{name:"number",required:!1},description:"Maximum window size in base pairs for which indexed annotations or variants are displayed  1 MB for variants, 30 KB for alignments, whole chromosome for other track types"},{key:"color",value:{name:"string",required:!1},description:'CSS color value for track features, e.g. "#ff0000" or "rgb(100,0,100)"'},{key:"displayMode",value:{name:"union",raw:"'COLLAPSED' | 'EXPANDED' | 'SQUISHED'",elements:[{name:"literal",value:"'COLLAPSED'"},{name:"literal",value:"'EXPANDED'"},{name:"literal",value:"'SQUISHED'"}],required:!1},description:`Annotation display mode, one of "COLLAPSED", "EXPANDED", "SQUISHED"  "COLLAPSED"
@default COLLAPSED`},{key:"height",value:{name:"number",required:!1},description:`Initial height of track viewport in pixels
@default 50`},{key:"autoHeight",value:{name:"boolean",required:!1},description:`If true, then track height is adjusted dynamically, within the bounds set by minHeight and maxHeight, to accomdodate features in view
@default true;`},{key:"minHeight",value:{name:"number",required:!1},description:`Minimum height of track in pixels  50
@default 50`},{key:"maxHeight",value:{name:"number",required:!1},description:`Maximum height of track in pixels
@default 500`}]}}]}],raw:"IGVTrack[]"},description:""}}};const be=async({caseId:t})=>oe.getIGV(t.toString()).then(a=>a.data),H=({caseId:t,seqId:a,locus:s,start:u,chromosome:p,open:c,setOpen:r,renderTrigger:d})=>{var x;const{t:n}=I(),m=ne({key:`igv-${t}-${a}-${s}`,caseId:t},be,{revalidateOnFocus:!1,revalidateOnMount:!1,shouldRetryOnError:!1});return g.useEffect(()=>{c&&m.mutate()},[c]),e.jsxs(le,{open:c,onOpenChange:r,children:[d==null?void 0:d(()=>r(!0)),e.jsx(de,{size:"full",variant:"stickyHeader",children:m.isLoading?e.jsx(E,{className:"flex items-center justify-center",children:e.jsx(z,{size:32})}):e.jsxs("div",{children:[e.jsx(ce,{children:e.jsx(me,{children:n("variant.igv.title")})}),e.jsx(E,{className:"relative max-h-[85vh] overflow-y-auto",children:e.jsx(P,{tracks:((x=m.data)==null?void 0:x.alignment)||[],locus:we(u,p,100)})})]})})]})},we=(t,a,s,u)=>`chr${a}:${`${t-s}-${t+s}`}`;H.__docgenInfo={description:"",methods:[],displayName:"IGVDialog",props:{open:{required:!0,tsType:{name:"boolean"},description:""},setOpen:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"value"}],return:{name:"void"}}},description:""},caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},locus:{required:!0,tsType:{name:"string"},description:""},start:{required:!0,tsType:{name:"number"},description:""},chromosome:{required:!0,tsType:{name:"string"},description:""},renderTrigger:{required:!1,tsType:{name:"signature",type:"function",raw:"(handleOpen: () => void) => ReactNode",signature:{arguments:[{type:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},name:"handleOpen"}],return:{name:"ReactNode"}}},description:""}}};function je(t,a){return t?t==="PASS"?e.jsx(v,{variant:"green",children:a("preview_sheet.occurrence_details.sections.metrics.pass")}):e.jsx(v,{variant:"red",children:a("preview_sheet.occurrence_details.sections.metrics.fail")}):e.jsx(f,{})}function Se(t){return!t||t<=0?e.jsx(f,{}):e.jsxs("span",{className:"inline-flex gap-1 items-center",children:[t>=20?e.jsx(ye,{strokeWidth:1.5,className:"w-[13px] h-[13px] text-opacity-50"}):e.jsx(re,{className:"w-[13px] h-[13px] text-destructive"}),S(t)]})}const M=({caseId:t,seqId:a,locus:s,start:u,chromosome:p,zygosity:c,transmission:r,parental_origin:d,genotype_quality:n,relationshipToProband:m,filter:x,father_calls:o,mother_calls:y,ad_alt:_,ad_total:l,enableIGV:b=!1})=>{const{t:i}=I(),[w,G]=g.useState(!1),R=je(x,i);let q;return b&&(q=e.jsx(H,{open:w,setOpen:G,caseId:t,seqId:a,locus:s,start:u,chromosome:p,renderTrigger:V=>e.jsxs(L,{variant:"outline",size:"xs",onClick:V,children:[e.jsx(ge,{}),i("preview_sheet.occurrence_details.actions.view_in_igv")]})})),e.jsx(B,{icon:ue,title:i("preview_sheet.occurrence_details.title"),actions:q,children:e.jsx("div",{className:"rounded-md w-full border",children:e.jsx("div",{className:"size-full",children:e.jsxs("div",{className:"flex flex-wrap gap-4 sm:gap-20 items-start p-3 w-full",children:[e.jsxs("div",{className:"flex flex-col gap-4 grow max-w-full sm:max-w-72 min-w-56",children:[e.jsxs(j,{title:i("preview_sheet.occurrence_details.sections.inheritance.title"),values:[c,r,d],children:[e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.inheritance.zygosity"),children:c?e.jsx(v,{variant:"outline",children:c}):e.jsx(f,{})}),e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.inheritance.inheritance"),children:r?e.jsx(v,{variant:"outline",children:D(N(r))}):e.jsx(f,{})}),e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.inheritance.parental_origin"),children:d?e.jsx(v,{variant:"outline",children:D(N(d))}):e.jsx(f,{})})]}),m==="proband"&&e.jsxs(j,{title:"Family",children:[e.jsx(h,{label:e.jsxs(k,{children:[e.jsx(T,{asChild:!0,children:e.jsxs("span",{className:"inline-flex gap-1 items-center",children:[i("preview_sheet.occurrence_details.sections.family.father_genotype")," ",e.jsx(se,{size:13})]})}),e.jsx(C,{children:o&&o[0]>0?i("preview_sheet.occurrence_details.sections.family.affected_tooltip"):i("preview_sheet.occurrence_details.sections.family.not_affected_tooltip")})]}),children:o?e.jsx("span",{className:"font-mono",children:`${o[0]}/${o[1]}`}):e.jsx(f,{})}),e.jsx(h,{label:e.jsxs(k,{children:[e.jsx(T,{asChild:!0,children:e.jsxs("span",{className:"inline-flex gap-1 items-center",children:[i("preview_sheet.occurrence_details.sections.family.mother_genotype")," ",e.jsx(ae,{size:13})]})}),e.jsx(C,{children:y&&y[0]>0?i("preview_sheet.occurrence_details.sections.family.affected_tooltip"):i("preview_sheet.occurrence_details.sections.family.not_affected_tooltip")})]}),children:y?e.jsx("span",{className:"font-mono",children:`${y[0]}/${y[1]}`}):e.jsx(f,{})})]})]}),e.jsx("div",{className:"flex flex-col gap-4 grow max-w-full sm:max-w-72 min-w-56",children:e.jsxs(j,{title:"Metrics",values:[_,l,n,x],children:[e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.metrics.quality_depth"),children:e.jsx(f,{})}),e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.metrics.allele_depth_alt"),children:e.jsx("span",{className:"font-mono",children:_?S(_):e.jsx(f,{})})}),e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.metrics.total_depth_alt_ref"),children:e.jsx("span",{className:"font-mono",children:l?S(l):e.jsx(f,{})})}),e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.metrics.genotype_quality"),children:Se(n)}),e.jsx(h,{label:i("preview_sheet.occurrence_details.sections.metrics.filter"),children:R})]})})]})})})})};M.__docgenInfo={description:"",methods:[],displayName:"SliderOccurrenceDetailsCard",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},locus:{required:!0,tsType:{name:"string"},description:""},start:{required:!0,tsType:{name:"number"},description:""},chromosome:{required:!0,tsType:{name:"string"},description:""},zygosity:{required:!1,tsType:{name:"string"},description:""},transmission:{required:!1,tsType:{name:"string"},description:""},parental_origin:{required:!1,tsType:{name:"string"},description:""},genotype_quality:{required:!1,tsType:{name:"number"},description:""},filter:{required:!1,tsType:{name:"string"},description:""},relationshipToProband:{required:!1,tsType:{name:"string"},description:""},father_calls:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:""},mother_calls:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:""},ad_alt:{required:!1,tsType:{name:"number"},description:""},ad_total:{required:!1,tsType:{name:"number"},description:""},enableIGV:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};function Ie({occurrence:t,children:a,open:s,setOpen:u,onPrevious:p,onNext:c,hasPrevious:r,hasNext:d,patientSelected:n,onInterpretationSaved:m}){return e.jsx(U,{trigger:a,open:s,setOpen:u,children:t&&e.jsx(qe,{onInterpretationSaved:m,occurrence:t,onPrevious:p,onNext:c,hasPrevious:r,hasNext:d,patientSelected:n})})}function qe({occurrence:t,onPrevious:a,onNext:s,hasPrevious:u,hasNext:p,patientSelected:c,onInterpretationSaved:r}){var i;const{t:d}=I(),n=pe(),m=he(),{mutate:x}=ve(),{patient:o,caseResult:y,caseSequencing:_,expandResult:l,isLoading:b}=F(n,m,t.locus_id.toString(),c);return b||!l.data?e.jsx($,{}):e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(X,{onPrevious:a,onNext:s,hasPrevious:u,hasNext:p,children:e.jsx(W,{patientId:o==null?void 0:o.patient_id,relationshipToProband:o==null?void 0:o.relationship_to_proband,seqId:_==null?void 0:_.seq_id})}),e.jsx(ie,{}),e.jsx(Q,{type:(i=y.data)==null?void 0:i.case_type,locusId:t.locus_id,hgvsg:t.hgvsg,actions:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(ee,{value:{onChangeCallback:x},children:e.jsx(te,{caseId:n,seqId:t.seq_id,taskId:t.task_id,occurenceId:t.locus_id})}),!t.has_interpretation&&e.jsx(K,{locusId:t.locus_id,transcriptId:t.transcript_id,handleSaveCallback:r,renderTrigger:w=>e.jsxs(L,{size:"sm",onClick:w,children:[e.jsx(Z,{}),d("preview_sheet.actions.interpretation")]})})]})}),t.has_interpretation&&e.jsx(J,{canEditInterpretation:!0,onInterpretationSaved:r,seqId:m,caseId:n,symbol:t==null?void 0:t.symbol,locusId:t==null?void 0:t.locus_id,isManeSelect:t==null?void 0:t.is_mane_select,isManePlus:t==null?void 0:t.is_mane_plus,isCanonical:t==null?void 0:t.is_canonical,transcriptId:t==null?void 0:t.transcript_id}),n&&e.jsx(M,{caseId:n,seqId:t.seq_id,locus:t.locus,start:t.start,chromosome:t.chromosome,zygosity:l.data.zygosity,transmission:l.data.transmission,parental_origin:l.data.parental_origin,genotype_quality:l.data.genotype_quality,relationshipToProband:o==null?void 0:o.relationship_to_proband,filter:l.data.filter,father_calls:l.data.father_calls,mother_calls:l.data.mother_calls,ad_alt:l.data.ad_alt,ad_total:l.data.ad_total,enableIGV:!0}),e.jsx(Y,{data:l.data})]})}Ie.__docgenInfo={description:"",methods:[],displayName:"SliderGermlineOccurrenceSheet",props:{occurrence:{required:!1,tsType:{name:"GermlineSNVOccurrence"},description:""},children:{required:!1,tsType:{name:"ReactReactElement",raw:"React.ReactElement"},description:""},open:{required:!0,tsType:{name:"boolean"},description:""},setOpen:{required:!0,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},onPrevious:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onNext:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},hasPrevious:{required:!1,tsType:{name:"boolean"},description:""},hasNext:{required:!1,tsType:{name:"boolean"},description:""},patientSelected:{required:!1,tsType:{name:"CaseSequencingExperiment"},description:""},onInterpretationSaved:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};export{_e as F,H as I,Ie as S,ve as u};
