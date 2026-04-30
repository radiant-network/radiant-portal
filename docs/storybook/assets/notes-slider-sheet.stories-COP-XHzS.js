import{j as r}from"./iframe-s7mzBcxe.js";import{h as i,H as S}from"./index-CkkCN1wB.js";import{N as o}from"./notes-slider-sheet-Celn-la5.js";import{C as j,A as t}from"./applications-config-Bhq8uM1T.js";import{L as x}from"./notes-container-DQb_Ya4L.js";import{n as m,g as w}from"./api-notes-Cl2uZAsC.js";import{d as p}from"./delay-DSHj6LlV.js";import{B as L}from"./chunk-UVKPFVEO-DFffaY1n.js";import"./preload-helper-Dp1pzeXC.js";import"./index-EvTuZ_Ib.js";import"./api-B3xiDz_1.js";import"./index-D-HoTjHf.js";import"./sheet-C3skB6oO.js";import"./index-CXptgGFe.js";import"./x-ChbQ_swm.js";import"./i18n-WfuZEDOA.js";import"./button-a42Jp6lR.js";import"./index-ZuuZi8tL.js";import"./action-button-qhDSyRDc.js";import"./dropdown-menu-C-WUw0Uv.js";import"./index-C0VM317R.js";import"./circle-DoraGt89.js";import"./check-BtaDGT8a.js";import"./separator-1u5V84K1.js";import"./spinner-BpQ8YuWS.js";import"./rich-text-viewer-Bge7sd6c.js";import"./toggle-DX1zetCF.js";import"./single-avatar-C34D1Bvq.js";import"./avatar-CPuu1iFc.js";import"./avatar.utils-gKVZpWxj.js";import"./hover-card-Dceb3Wl5.js";import"./date-CQ1q4FHL.js";import"./skeleton-CUB1xmkD.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSliderSheet {...args} />
}`,...(g=(d=s.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var l,u,h;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var _,y,f;n.parameters={...n.parameters,docs:{...(_=n.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(f=(y=n.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const ne=["Default","Loading","Empty"];export{s as Default,n as Empty,a as Loading,ne as __namedExportsOrder,ae as default};
