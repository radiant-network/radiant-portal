import{j as t,aa as _}from"./iframe-BH3MSqWK.js";import{h as p}from"./index-CJX5yBN4.js";import{S as a}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-DEmk6E0X.js";import{C as g,A as r}from"./applications-config-BSntMn92.js";import{L as l}from"./notes-container-BIV3lx5D.js";import{n as m,g as d}from"./api-notes-BcoHz14J.js";import{d as c}from"./delay-J5Xhhn2A.js";import{B as u}from"./chunk-QUQL4437-DecpjHsp.js";import"./preload-helper-PPVm8Dsz.js";import"./api-CW7YpE16.js";import"./index-BSwCZ4xH.js";import"./sheet-CYa_Nxro.js";import"./index-CWIj6fqH.js";import"./x-D_WMbL1s.js";import"./i18n-MpjanH8G.js";import"./button-BxP9PPaa.js";import"./index-CfauPKxk.js";import"./action-button-DjPcyzdS.js";import"./dropdown-menu-DwRYTMWI.js";import"./index-B6DCGoSV.js";import"./index-Cipz7JOz.js";import"./check-Bk5l44Qw.js";import"./circle-Cyir8aSn.js";import"./separator-DyfWTagX.js";import"./spinner-Bk0oDQub.js";import"./rich-text-editor-ft2EOrpj.js";import"./toggle-BYnfgVa8.js";import"./popover-BMngGd2f.js";import"./input-h6d6rGg7.js";import"./label-CbaNIhYw.js";import"./underline-D843-jnD.js";import"./single-avatar-Ds76-A21.js";import"./avatar-DB1ZneiA.js";import"./avatar.utils-C5SUAW_9.js";import"./hover-card-CiyUyn9y.js";import"./rich-text-viewer-CWkAo8Cx.js";import"./date-C92wp4cq.js";import"./format-C4517A07.js";import"./skeleton-D3nQRcXW.js";const C={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(u,{children:t.jsx(g,{config:C,children:t.jsx(l,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),d()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),d()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),_.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSliderSheet {...args} />
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};const se=["Default","Loading","Empty"];export{s as Default,n as Empty,o as Loading,se as __namedExportsOrder,ae as default};
