import{j as t,aa as _}from"./iframe-CgYzld9M.js";import{h as p}from"./index-DjF2ghAa.js";import{S as a}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-CJTgvSvi.js";import{C as g,A as r}from"./applications-config-DSaueCPj.js";import{L as l}from"./notes-container-SUlsKhYj.js";import{n as m,g as d}from"./api-notes-C-JN49ae.js";import{d as c}from"./delay-yxgQ8DhP.js";import{B as u}from"./chunk-QUQL4437-Blla3tfU.js";import"./preload-helper-PPVm8Dsz.js";import"./api-C1_4ex4N.js";import"./index-BJLMTLPT.js";import"./sheet-VVLfrB-S.js";import"./index-B4uORf9Z.js";import"./x-B30BiZwY.js";import"./i18n-BhtfqN2W.js";import"./button-BB6JTV7B.js";import"./index-0Ui6iiVS.js";import"./action-button-Dd50ZnSl.js";import"./dropdown-menu-CCEHsgQp.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./check-DrnC7o8K.js";import"./circle-BJPs1Iry.js";import"./separator-BXAAQkGD.js";import"./spinner-C8OkYsdO.js";import"./rich-text-editor-E4qJXcsS.js";import"./toggle-at5pgcRR.js";import"./popover-CgcTZUAv.js";import"./input-BVLSUFFJ.js";import"./label-DmVEf26Q.js";import"./underline-BqnNrRat.js";import"./single-avatar-CsBSBvSX.js";import"./avatar-BZBile2U.js";import"./avatar.utils-BVJE-8hd.js";import"./hover-card-DZhlzgad.js";import"./rich-text-viewer-Bm2hPW8r.js";import"./date-8mJxKa3d.js";import"./format-DgGmklzE.js";import"./skeleton-BS9ObOBk.js";const C={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(u,{children:t.jsx(g,{config:C,children:t.jsx(l,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),d()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),d()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),_.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
