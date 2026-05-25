import{j as t}from"./iframe-BmGXa3-X.js";import{h as p,H as y}from"./index-DK66HcqW.js";import{S as s}from"./api-QmR3WP_i.js";import{N as i}from"./notes-slider-sheet-DizvshL7.js";import{C as f,A as r}from"./applications-config-BqpPbBAn.js";import{L as E}from"./notes-container-zgPLVJWB.js";import{n as m,g as S}from"./api-notes-B5edw4JN.js";import{d as c}from"./delay-ClJG3rkh.js";import{B as R}from"./chunk-UVKPFVEO-DyoJ0mNg.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CaapTjG0.js";import"./index-BzxUydVe.js";import"./sheet-BslHrNkd.js";import"./index-DwSV4z2L.js";import"./x-CxdibXDu.js";import"./i18n-CIi-bBZn.js";import"./button-D3gglFwF.js";import"./index-D50K9r0m.js";import"./action-button-CpjBn32O.js";import"./dropdown-menu-C7jK4Cbw.js";import"./index-DHPhzIhz.js";import"./index-Dr9b5RjJ.js";import"./check-CGXxJ1mv.js";import"./circle-DlZirWGW.js";import"./separator-ACzPuug0.js";import"./spinner-CPXCkHLS.js";import"./rich-text-editor-DP3LcZaO.js";import"./toggle-Cg90-ft6.js";import"./popover-CqPtME_M.js";import"./input-DsUAWfl8.js";import"./label-B0bdI6zS.js";import"./underline-Csn5sER1.js";import"./single-avatar-B7uCihvE.js";import"./avatar-Cz8c5kSt.js";import"./avatar.utils-C9TDylPw.js";import"./hover-card-MqbYqS5n.js";import"./rich-text-viewer-BiJRFZ4d.js";import"./date-BwfSNhG8.js";import"./format-KnS4A24t.js";import"./skeleton-DfNQFgFp.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
