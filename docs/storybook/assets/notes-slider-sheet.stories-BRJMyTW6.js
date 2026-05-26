import{j as t}from"./iframe-Bfhefzsx.js";import{h as p,H as y}from"./index-CEnRqh40.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-B0fdOTOs.js";import{C as f,A as r}from"./applications-config-B6Tg5d9b.js";import{L as E}from"./notes-container-DLUR1DtG.js";import{n as m,g as S}from"./api-notes-CaQym2l4.js";import{d as c}from"./delay-qObMA_Zh.js";import{B as R}from"./chunk-UVKPFVEO-CzR9cwZI.js";import"./preload-helper-Dp1pzeXC.js";import"./api-6clcAXtN.js";import"./index-DKzYbM40.js";import"./sheet-DhFKtGUT.js";import"./index-BrBp5k-E.js";import"./x-FhvHWdbH.js";import"./i18n-B6khZ_Hp.js";import"./button-CWzl1mbJ.js";import"./index-ySC5M_j1.js";import"./action-button-DXGv7O3g.js";import"./dropdown-menu-z1WTEfQX.js";import"./index-DtXaOCN_.js";import"./index-WNoVkAv8.js";import"./check-BHnUMkz2.js";import"./circle-E9FFs9t_.js";import"./separator-DTG1lmI1.js";import"./spinner-CNH0W_x3.js";import"./rich-text-editor-Jmj0A43m.js";import"./toggle-nJo_-Vkm.js";import"./popover-Cl8hT8Oi.js";import"./input-79WjFeeW.js";import"./label-DGW8yMMk.js";import"./underline-CpFIZQrT.js";import"./single-avatar-7D1WmT9d.js";import"./avatar-CStrLqBy.js";import"./avatar.utils-DcFs0MHd.js";import"./hover-card-CiIJaLAw.js";import"./rich-text-viewer-BXR-bhmd.js";import"./date-oYhYLjUA.js";import"./format-CrBmC4wx.js";import"./skeleton-6BlzxHy1.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
