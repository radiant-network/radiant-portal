import{j as t}from"./iframe-CQgZAOkF.js";import{h as p,H as y}from"./index-a8dLTY3x.js";import{S as s}from"./api-QmR3WP_i.js";import{N as i}from"./notes-slider-sheet-Rv_7maAx.js";import{C as f,A as r}from"./applications-config-CZUSecrj.js";import{L as E}from"./notes-container-DvyIFQ-z.js";import{n as m,g as S}from"./api-notes-BeNJYtQs.js";import{d as c}from"./delay-Ci3KDMY_.js";import{B as R}from"./chunk-UVKPFVEO-HBFeQRBM.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BYFS7H1g.js";import"./index-Dj4GQutF.js";import"./sheet-CemPiBmY.js";import"./index-CkoMMX28.js";import"./x-CTf5kmt8.js";import"./i18n-zfLOoNJ9.js";import"./button-C_AsNXYw.js";import"./index-omJgMaAL.js";import"./action-button-BjNqzH1o.js";import"./dropdown-menu-BTfS0Wrp.js";import"./index-CSD6zSMT.js";import"./index-CfmBBbLM.js";import"./check-Cx9ZfCjz.js";import"./circle-Cp5EZ7RS.js";import"./separator-DQ_lcvcD.js";import"./spinner-DuAGBaZM.js";import"./rich-text-editor-B5WTT_pl.js";import"./toggle-DoVTUylv.js";import"./popover-BM4cox1r.js";import"./input-BcZHmFoE.js";import"./label-B497SNPe.js";import"./underline-RA9awg4S.js";import"./single-avatar-DwsRjRyU.js";import"./avatar-C-VxveVX.js";import"./avatar.utils-DdIUbUhV.js";import"./hover-card-c6YNhDlq.js";import"./rich-text-viewer-OIe1pO-u.js";import"./date-BBpz4aBZ.js";import"./format-CQOkMxXw.js";import"./skeleton-CtM-wUGc.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
