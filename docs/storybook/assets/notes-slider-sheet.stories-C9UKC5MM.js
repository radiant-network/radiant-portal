import{j as t}from"./iframe-C0iLOhhN.js";import{h as p,H as y}from"./index-rSYZwri4.js";import{S as s}from"./api-QmR3WP_i.js";import{N as i}from"./notes-slider-sheet-Be296jaE.js";import{C as f,A as r}from"./applications-config-DgxAA6zS.js";import{L as E}from"./notes-container-BdpoUI1r.js";import{n as m,g as S}from"./api-notes-B0pqXP5V.js";import{d as c}from"./delay-DlEDMpQ6.js";import{B as R}from"./chunk-UVKPFVEO-DRsH6O0b.js";import"./preload-helper-Dp1pzeXC.js";import"./api-uUDyMK4x.js";import"./index-BlYLXJEb.js";import"./sheet-DCh4xdWL.js";import"./index-CQPPTDLW.js";import"./x-RVTHyxVY.js";import"./i18n-D8IvajwH.js";import"./button-CNjl8yW6.js";import"./index-kyNJ1CnW.js";import"./action-button-8mTLY66a.js";import"./dropdown-menu-BGUmaoIM.js";import"./index-Df3PTcw5.js";import"./index-DkANzGOx.js";import"./check-svrqvj4s.js";import"./circle-BLSR2qOI.js";import"./separator-LozKfEm5.js";import"./spinner-DRutpT_Y.js";import"./rich-text-editor-BUoFOoT6.js";import"./toggle-B977O-E8.js";import"./popover-CYozt4Pw.js";import"./input-BlrxJVZR.js";import"./label-BzgZFpGE.js";import"./underline-CRk_Mpot.js";import"./single-avatar-B5teQ-o9.js";import"./avatar-AffflPlT.js";import"./avatar.utils-C9ADMKWS.js";import"./hover-card-CZZEATIB.js";import"./rich-text-viewer-eyM-TEWk.js";import"./date-Dw1gJ1yC.js";import"./format-B4ir9GLQ.js";import"./skeleton-BMSmKVtD.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
