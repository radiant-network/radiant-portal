import{j as t}from"./iframe-Dazgu-xC.js";import{h as p,H as y}from"./index-_V58G7Gw.js";import{S as s}from"./api-Bvp-Hr8F.js";import{N as i}from"./notes-slider-sheet-CZ9x1xMw.js";import{C as f,A as r}from"./applications-config-BtxFDTb-.js";import{L as E}from"./notes-container-CbY-GEdH.js";import{n as m,g as S}from"./api-notes-B8N77jkq.js";import{d as c}from"./delay-DV3kj88P.js";import{B as R}from"./chunk-UVKPFVEO-CBqCeUQh.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BVEA3X-S.js";import"./index-B3HPNJL0.js";import"./sheet-C69JKzOE.js";import"./index-Bfmrw_TA.js";import"./x-CKsu-GPn.js";import"./i18n-CWqrHIWh.js";import"./button-8J658wd4.js";import"./index-Aj7YrDzF.js";import"./action-button-BfMVkXo8.js";import"./dropdown-menu-CUwMNzYL.js";import"./index-DQ2PnqWf.js";import"./index-6Lx37dYF.js";import"./check-CzryUxBS.js";import"./circle-CZgbCMc1.js";import"./separator-uwq_OMO5.js";import"./spinner-BvkOzIeu.js";import"./rich-text-editor-BudcwJAF.js";import"./toggle-CrZMZCYy.js";import"./popover-BjOmwFyM.js";import"./input-ZZfgT6Fu.js";import"./label-5Mi_LwNg.js";import"./underline-5ddjjB4r.js";import"./single-avatar-BzIKIl8u.js";import"./avatar-hTWwQgoP.js";import"./avatar.utils-CC8GqUxo.js";import"./hover-card-MtOfCJhf.js";import"./rich-text-viewer-DmuUpSPs.js";import"./date-CoOhaM5m.js";import"./format-DL_NsEnK.js";import"./skeleton-1JU-3uDe.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
