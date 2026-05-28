import{j as t}from"./iframe-BdVkGBhb.js";import{h as p,H as y}from"./index-DchZLEkY.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-CUoZDl7x.js";import{C as f,A as r}from"./applications-config-D4csJ2eF.js";import{L as E}from"./notes-container-CpyCRIX-.js";import{n as m,g as S}from"./api-notes-BZDnv3NW.js";import{d as c}from"./delay-FY8AArnS.js";import{B as R}from"./chunk-UVKPFVEO-tWcB6apz.js";import"./preload-helper-Dp1pzeXC.js";import"./api-0xi9nZz_.js";import"./index-9hkzsdBx.js";import"./sheet-CX5CFzMi.js";import"./index-3Domndki.js";import"./x-B7iw8ws4.js";import"./i18n-C6QGtJ6I.js";import"./button-zA7C4LoZ.js";import"./index-BTAukcSu.js";import"./action-button-CpRjOizG.js";import"./dropdown-menu-CzBsT1en.js";import"./index-xQ2ojJvx.js";import"./index-CNw0ArEG.js";import"./check-BIdY2e8D.js";import"./circle-B2j6O8ci.js";import"./separator-BYsloDMD.js";import"./spinner-Cju1ADlV.js";import"./rich-text-editor-CVWJcEsH.js";import"./toggle-BTLFpxMZ.js";import"./popover-BNySdI4P.js";import"./input-CPazYHuo.js";import"./label-CjQDtmgm.js";import"./underline-CrjKiN2q.js";import"./single-avatar-CQbnuz1P.js";import"./avatar-BmOIp4dT.js";import"./avatar.utils-CTNwSFQA.js";import"./hover-card-CUydE7cy.js";import"./rich-text-viewer-yQPCa6hy.js";import"./date-GAIN_p87.js";import"./format-DCBEtTFg.js";import"./skeleton-DTOrDwyo.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
