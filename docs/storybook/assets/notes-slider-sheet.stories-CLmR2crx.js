import{j as t}from"./iframe-8oJ5Bgb6.js";import{h as p,H as y}from"./index-OTV_qfG9.js";import{S as s}from"./api-z4CtOsxY.js";import{N as i}from"./notes-slider-sheet-BtIeaM1J.js";import{C as f,A as r}from"./applications-config-DXnM4GfU.js";import{L as E}from"./notes-container-C0vxqNGq.js";import{n as m,g as S}from"./api-notes-VOk_Mssd.js";import{d as c}from"./delay-DGu4EucZ.js";import{B as R}from"./chunk-UVKPFVEO-07MDkUHM.js";import"./preload-helper-Dp1pzeXC.js";import"./api-B8LeNhSf.js";import"./index-C1qHQxBp.js";import"./sheet-4r8FZCSy.js";import"./index-DBgNYyTu.js";import"./x-D0roLtfc.js";import"./i18n-BUvQZllC.js";import"./button-B-Vd7I7W.js";import"./index-DViiVEq-.js";import"./action-button-CdU_izQK.js";import"./dropdown-menu-BT9qsx5b.js";import"./index-BeRE-8C-.js";import"./index-B7DGIYRL.js";import"./check-CLsWVnhq.js";import"./circle-CKypI8aC.js";import"./separator-DpObONvW.js";import"./spinner-C637fxDr.js";import"./rich-text-editor-CVFrZhf8.js";import"./toggle-DreiAu2A.js";import"./popover--t-0pc3_.js";import"./input-CaYKlYyd.js";import"./label-q4eFVfi7.js";import"./underline-DO5b_z2g.js";import"./single-avatar-DPRHpCiI.js";import"./avatar-CrCNQGI4.js";import"./avatar.utils-D3nUrDbW.js";import"./hover-card-Be0EIJm_.js";import"./rich-text-viewer-DcW1Bgun.js";import"./date-BgXxhe8f.js";import"./format-B0u9AitB.js";import"./skeleton-DPHeHnr4.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
