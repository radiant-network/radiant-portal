import{j as t}from"./iframe-BIVZNcDx.js";import{h as p,H as y}from"./index-DHrLodiX.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-Gn9CbzO1.js";import{C as f,A as r}from"./applications-config-Bfz_Xc4S.js";import{L as E}from"./notes-container-6mZvqNGH.js";import{n as m,g as S}from"./api-notes-Dt1-02Mq.js";import{d as c}from"./delay-C3yQAyou.js";import{B as R}from"./chunk-UVKPFVEO-DkEhpWYP.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BNnkDz4h.js";import"./index-BMZKsHUR.js";import"./sheet-BjsslpW9.js";import"./index-BvQeIq23.js";import"./x-CM_jdjpH.js";import"./i18n-BkDRdn4X.js";import"./button-6N62lUpo.js";import"./index-D37jQc6A.js";import"./action-button-Dp1yU_WD.js";import"./dropdown-menu-DPDJlzat.js";import"./index-DQWZ93FF.js";import"./index-D5OUmr5s.js";import"./check-oh_5MiUz.js";import"./circle-Bz-lEpPj.js";import"./separator-Dwai73g_.js";import"./spinner-r2H7tqfS.js";import"./rich-text-editor-C3JFdCgL.js";import"./toggle-Dcc4ejOn.js";import"./popover-Cy4LFm9B.js";import"./input-DYazXf9D.js";import"./label-CJsIthia.js";import"./underline-6g7w6YzV.js";import"./single-avatar-CadK2YzN.js";import"./avatar-9mLZSRJJ.js";import"./avatar.utils-jAVZ0CdN.js";import"./hover-card-CYKo2rKi.js";import"./rich-text-viewer-BV4ePfPP.js";import"./date-DotMPcgr.js";import"./format-DUIX5wlz.js";import"./skeleton-BGpQmToc.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
