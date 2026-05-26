import{j as t}from"./iframe-CoEcbA0Q.js";import{h as p,H as y}from"./index-6kR7fU3j.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-DgV_8xNT.js";import{C as f,A as r}from"./applications-config-04phLGWC.js";import{L as E}from"./notes-container-CbseY3Hk.js";import{n as m,g as S}from"./api-notes-D0QQdplY.js";import{d as c}from"./delay-CQahuynS.js";import{B as R}from"./chunk-UVKPFVEO-pvdJNT1A.js";import"./preload-helper-Dp1pzeXC.js";import"./api-rC05Zo1-.js";import"./index-D_cpkjZT.js";import"./sheet-CIyyr_QW.js";import"./index-DXotYb0n.js";import"./x-C8SyGHwj.js";import"./i18n-BOQJC4x0.js";import"./button-D9HtrZJg.js";import"./index-BiAuQahW.js";import"./action-button-lIohNrhc.js";import"./dropdown-menu-CBuFLUqm.js";import"./index-Dlfzbc-H.js";import"./index-BEcaC1MX.js";import"./check-DGlyanKq.js";import"./circle-CUypZ47c.js";import"./separator-DjdzzDam.js";import"./spinner-CwwEOyMf.js";import"./rich-text-editor-BJnuGb83.js";import"./toggle-C_UUV3DN.js";import"./popover-0eNC2MXR.js";import"./input-BxfgbUFl.js";import"./label-CvlceGUJ.js";import"./underline-CBXBN92B.js";import"./single-avatar-CtM3xCT4.js";import"./avatar-Ds8HZDFI.js";import"./avatar.utils-_RNlN9gF.js";import"./hover-card-DRNzsNWt.js";import"./rich-text-viewer-CRcLUr3l.js";import"./date-CFLt8HX9.js";import"./format-Cj0cMZdT.js";import"./skeleton-BpGAGHGh.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSliderSheet {...args} />
}`,...(g=(_=a.parameters)==null?void 0:_.docs)==null?void 0:g.source}}};var l,u,C;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(10000);
        return getHTTPMockNotesList();
      })]
    }
  },
  args: {
    seqId: 3
  },
  render: args => <NotesSliderSheet {...args} />
}`,...(C=(u=o.parameters)==null?void 0:u.docs)==null?void 0:C.source}}};var N,h,v;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })]
    }
  },
  args: {
    seqId: 4
  },
  render: args => <NotesSliderSheet {...args} />
}`,...(v=(h=n.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const ge=["Default","Loading","Empty"];export{a as Default,n as Empty,o as Loading,ge as __namedExportsOrder,_e as default};
