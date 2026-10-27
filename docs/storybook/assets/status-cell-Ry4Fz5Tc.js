import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./createLucideIcon-BZk7HdX5.js";import{o as a,s as o}from"./button-aZykv-G3.js";import{n as s,t as c}from"./i18n-DI2FRnnF.js";import{a as l,i as u}from"./api-D3hbutUI.js";import{n as d,r as f}from"./index-C0irWvHc.js";import{a as p,r as m}from"./use-tenant-Bh2tpqTH.js";import{n as h,t as g}from"./status-badge-BwVfxDej.js";import{c as _,i as v,n as y,s as b,t as x,u as S}from"./dialog-KvQfUlrJ.js";import{n as C,t as w}from"./empty-cell-DJcOE7K8.js";var T,E;function D(){return(D=e((()=>{r(),T={name:`clipboard-list`,size:24,node:[[`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`,key:`tgr4d6`}],[`path`,{d:`M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,key:`116196`}],[`path`,{d:`M12 11h4`,key:`1jrz19`}],[`path`,{d:`M12 16h4`,key:`n85exb`}],[`path`,{d:`M8 11h.01`,key:`1dfujw`}],[`path`,{d:`M8 16h.01`,key:`18s6g9`}]]},T.node,E=i(T)})))()}var O,k,A;function j(){return(j=e((()=>{O=t(),k=n(),A=({id:e=`igvContainer`,className:t=``,options:n})=>{let r=(0,O.useRef)(null),[i,a]=(0,O.useState)(null),[o,s]=(0,O.useState)(null);return(0,O.useEffect)(()=>{r.current&&window.igv.browser!==!0&&!i&&n.tracks?.length>0&&(window.igv.browser=!0,window.igv.createBrowser(r.current,n).then(e=>{window.igv.browser=e,a(e),s(n)}))},[n.tracks]),(0,O.useEffect)(()=>{i&&o?.locus!==n.locus&&(i.search(n.locus),s(n))},[n,o]),(0,k.jsx)(`div`,{id:e,ref:r,className:t})},A.__docgenInfo={description:``,methods:[],displayName:`IGV`,props:{id:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`'igvContainer'`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`''`,computed:!1}},options:{required:!0,tsType:{name:`IIGVBrowserOptions`},description:``},loading:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}var M,N;function P(){return(P=e((()=>{j(),M=n(),N=({locus:e,tracks:t})=>(0,M.jsx)(A,{className:`igvContainer`,options:{palette:[`#00A0B0`,`#6A4A3C`,`#CC333F`,`#EB6841`],reference:{id:`hg38_1kg`,ucscID:`hg38`,blatDB:`hg38`,name:`Human (hg38 1kg/GATK)`,fastaURL:`https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome/GRCh38_full_analysis_set_plus_decoy_hla.fa`,indexURL:`https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome/GRCh38_full_analysis_set_plus_decoy_hla.fa.fai`,cytobandURL:`https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz`,tracks:[{name:`Refseq Genes`,format:`refgene`,url:`https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz`,indexURL:`https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz.tbi`,order:0,visibilityWindow:-1,displayMode:`EXPANDED`,autoHeight:!0,maxHeight:160}]},locus:e,tracks:t}}),N.__docgenInfo={description:``,methods:[],displayName:`IgvContainer`,props:{locus:{required:!0,tsType:{name:`string`},description:``},tracks:{required:!0,tsType:{name:`Array`,elements:[{name:`intersection`,raw:`Partial<IGVTrackEnriched> & {
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
}`,elements:[{name:`Partial`,elements:[{name:`IGVTrackEnriched`}],raw:`Partial<IGVTrackEnriched>`},{name:`signature`,type:`object`,raw:`{
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
}`,signature:{properties:[{key:`order`,value:{name:`number`,required:!1},description:`Integer value specifying relative order of track position on the screen. To pin a track to the bottom use Number.MAX_VALUE. If no order is specified, tracks appear in order of their addition.`},{key:`visibilityWindow`,value:{name:`number`,required:!1},description:`Maximum window size in base pairs for which indexed annotations or variants are displayed  1 MB for variants, 30 KB for alignments, whole chromosome for other track types`},{key:`color`,value:{name:`string`,required:!1},description:`CSS color value for track features, e.g. "#ff0000" or "rgb(100,0,100)"`},{key:`displayMode`,value:{name:`union`,raw:`'COLLAPSED' | 'EXPANDED' | 'SQUISHED'`,elements:[{name:`literal`,value:`'COLLAPSED'`},{name:`literal`,value:`'EXPANDED'`},{name:`literal`,value:`'SQUISHED'`}],required:!1},description:`Annotation display mode, one of "COLLAPSED", "EXPANDED", "SQUISHED"  "COLLAPSED"
@default COLLAPSED`},{key:`height`,value:{name:`number`,required:!1},description:`Initial height of track viewport in pixels
@default 50`},{key:`autoHeight`,value:{name:`boolean`,required:!1},description:`If true, then track height is adjusted dynamically, within the bounds set by minHeight and maxHeight, to accomdodate features in view
@default true;`},{key:`minHeight`,value:{name:`number`,required:!1},description:`Minimum height of track in pixels  50
@default 50`},{key:`maxHeight`,value:{name:`number`,required:!1},description:`Maximum height of track in pixels
@default 500`}]}}]}],raw:`IGVTrack[]`},description:``}}}})))()}var F,I,L,R,z;function B(){return(B=e((()=>{F=t(),d(),S(),o(),c(),m(),l(),P(),I=n(),L=async({caseId:e},t)=>u.getIGV(t,e.toString()).then(e=>e.data),R=({caseId:e,seqId:t,locus:n,start:r,chromosome:i,open:o,setOpen:c,renderTrigger:l})=>{let{t:u}=s(),{tenant:d}=p(),m=f({key:`igv-${e}-${t}-${n}`,caseId:e},({caseId:e})=>L({caseId:e},d),{revalidateOnFocus:!1,revalidateOnMount:!1,shouldRetryOnError:!1});return(0,F.useEffect)(()=>{o&&m.mutate()},[o]),(0,I.jsxs)(x,{open:o,onOpenChange:c,children:[l?.(()=>c(!0)),(0,I.jsx)(v,{size:`full`,variant:`stickyHeader`,children:m.isLoading?(0,I.jsx)(y,{className:`flex items-center justify-center`,children:(0,I.jsx)(a,{size:32})}):(0,I.jsxs)(`div`,{children:[(0,I.jsx)(b,{children:(0,I.jsx)(_,{children:u(`variant.igv.title`)})}),(0,I.jsx)(y,{className:`relative max-h-[85vh] overflow-y-auto`,children:(0,I.jsx)(N,{tracks:m.data?.alignment||[],locus:z(r,i,100)})})]})})]})},z=(e,t,n,r)=>`chr${t}:${n?`${e-n}-${r?r+n:e+n}`:e}`,R.__docgenInfo={description:``,methods:[],displayName:`IGVDialog`,props:{open:{required:!0,tsType:{name:`boolean`},description:``},setOpen:{required:!0,tsType:{name:`signature`,type:`function`,raw:`(value: boolean) => void`,signature:{arguments:[{type:{name:`boolean`},name:`value`}],return:{name:`void`}}},description:``},caseId:{required:!0,tsType:{name:`number`},description:``},seqId:{required:!0,tsType:{name:`number`},description:``},locus:{required:!0,tsType:{name:`string`},description:``},start:{required:!0,tsType:{name:`number`},description:``},chromosome:{required:!0,tsType:{name:`string`},description:``},renderTrigger:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(handleOpen: () => void) => ReactNode`,signature:{arguments:[{type:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},name:`handleOpen`}],return:{name:`ReactNode`}}},description:``}}}})))()}function V({status:e}){return e?(0,H.jsx)(g,{status:e}):(0,H.jsx)(w,{})}var H;function U(){return(U=e((()=>{h(),C(),H=n(),V.__docgenInfo={description:``,methods:[],displayName:`StatusCell`,props:{status:{required:!0,tsType:{name:`union`,raw:`CaseStatus | undefined`,elements:[{name:`CaseStatus`},{name:`undefined`}]},description:``}}}})))()}export{E as a,B as i,U as n,D as o,R as r,V as t};