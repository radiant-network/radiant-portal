import{j as t,aa as _}from"./iframe-DaN5ePGy.js";import{h as p}from"./index-DyN6-iYz.js";import{S as a}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-CprvP4Z4.js";import{C as g,A as r}from"./applications-config-DfTGuYYT.js";import{L as l}from"./notes-container-DqUupGiB.js";import{n as m,g as d}from"./api-notes-D3X7I-xw.js";import{d as c}from"./delay-hEdm0CfD.js";import{B as u}from"./chunk-QUQL4437-tiDeZvge.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Bl_JvKfP.js";import"./index-FwWjbq00.js";import"./sheet-DSHaluaj.js";import"./index-CqOF5RWC.js";import"./x-BX9lxs28.js";import"./i18n-M9kOJp22.js";import"./button-C2HSnRiu.js";import"./index-buk7i43K.js";import"./action-button-BHK2YR4r.js";import"./dropdown-menu-CPO56L4e.js";import"./index-DeH_VHOF.js";import"./index-CZCzdGEw.js";import"./check-B-s7SQrr.js";import"./circle-ZjFAsy7t.js";import"./separator-Dw2V0eT4.js";import"./spinner-CwWFmy3E.js";import"./rich-text-editor-fsTgf4qI.js";import"./toggle-CvEZfL22.js";import"./popover-uHeYVtc4.js";import"./input-DP_2MVQx.js";import"./label-DFc0ADpw.js";import"./underline-CLKpMD1B.js";import"./user-avatar-GIuusjCl.js";import"./avatar-DBPiBfPq.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-ApfqgsJb.js";import"./rich-text-viewer-DzkU1SQv.js";import"./date-CjJoDpn_.js";import"./format-D-UfH1AD.js";import"./skeleton-ddFZC1OR.js";const C={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(u,{children:t.jsx(g,{config:C,children:t.jsx(l,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),d()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),d()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),_.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
