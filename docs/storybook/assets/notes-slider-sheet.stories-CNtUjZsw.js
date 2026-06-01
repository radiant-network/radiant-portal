import{j as t,aa as _}from"./iframe-fZ1JU2dD.js";import{h as p}from"./index-CLIGaZJs.js";import{S as a}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-9YOJ2wg6.js";import{C as g,A as r}from"./applications-config-CTshcaaR.js";import{L as l}from"./notes-container-CVKc9DtY.js";import{n as m,g as d}from"./api-notes-DVUwJBJN.js";import{d as c}from"./delay-CYg5rQuM.js";import{B as u}from"./chunk-QUQL4437-Dibaqxmg.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Du39gQtF.js";import"./index-BsMQ4rV8.js";import"./sheet-B57aZSIK.js";import"./index-BtYAtYTv.js";import"./x-DMxNaVrf.js";import"./i18n-Cu2AZSyu.js";import"./button-CeuGaa2_.js";import"./index-BuixPVmM.js";import"./action-button-DH7rTm7W.js";import"./dropdown-menu-WdkrS53z.js";import"./index-Cuzu6qxP.js";import"./index-Bt1gSSe9.js";import"./check-BCrtbgAX.js";import"./circle-DE-7MMSe.js";import"./separator-Bt15M7Wt.js";import"./spinner-Qss3O8wd.js";import"./rich-text-editor-B8SWYNAD.js";import"./toggle-C2vg-OoT.js";import"./popover-CMm7zbXK.js";import"./input-zQKiFqIP.js";import"./label-Bgg9wXxM.js";import"./underline-fGG5_qvR.js";import"./single-avatar-BTElOswL.js";import"./avatar-DmCJYjxG.js";import"./avatar.utils-TvKK8pbT.js";import"./hover-card-fIj23q4W.js";import"./rich-text-viewer--Dc1ipKr.js";import"./date-DN2kLThA.js";import"./format-txsGbc0u.js";import"./skeleton-BjkBYmoC.js";const C={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(u,{children:t.jsx(g,{config:C,children:t.jsx(l,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),d()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),d()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),_.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
