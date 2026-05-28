import{j as t}from"./iframe-BrSeghhN.js";import{h as p,H as y}from"./index-B06i79tT.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-DryGFv_f.js";import{C as f,A as r}from"./applications-config-D8cwIrPo.js";import{L as E}from"./notes-container-mct3FwNi.js";import{n as m,g as S}from"./api-notes-Bz-8dBIe.js";import{d as c}from"./delay-CpxdaUdu.js";import{B as R}from"./chunk-UVKPFVEO-DtMjr8N3.js";import"./preload-helper-Dp1pzeXC.js";import"./api-iZoFxMmC.js";import"./index-DhKdHgJ5.js";import"./sheet-DdhBgTXp.js";import"./index-C5RUfXEF.js";import"./x-CE4q4d5i.js";import"./i18n-yI98UA-9.js";import"./button-mWGiavLc.js";import"./index-BT6s_ZVo.js";import"./action-button-C9neH2i_.js";import"./dropdown-menu-BfTwRjwo.js";import"./index-B0vLzOZN.js";import"./index-BWpW7zLN.js";import"./check-DLxMbB_1.js";import"./circle-DUWUDPO6.js";import"./separator-DE6Q_3-9.js";import"./spinner-CbNUhyvE.js";import"./rich-text-editor-DgBypeiE.js";import"./toggle-CDbEs3Q_.js";import"./popover-D02s2f4R.js";import"./input-BKwtPosv.js";import"./label-O7MtxIK_.js";import"./underline-guMCywgm.js";import"./single-avatar-DzTN5Lc_.js";import"./avatar-Ce__VccQ.js";import"./avatar.utils-a0W07Em1.js";import"./hover-card-DeOMRtkg.js";import"./rich-text-viewer-DswbWUb8.js";import"./date-CEPC-EtL.js";import"./format-C498ZQgJ.js";import"./skeleton-B_gOsObQ.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
