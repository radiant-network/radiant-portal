import{j as e}from"./iframe-BDt4H8XZ.js";import{h as i,H as _}from"./index-CrDf1zU4.js";import{N as n}from"./notes-slider-sheet-CsiBoEMT.js";import{C as j,A as t}from"./applications-config-BECvCOUG.js";import{L as x}from"./notes-container-BMySnFxI.js";import{n as m,g as S}from"./api-notes-DxzuJFcA.js";import{d as p}from"./delay-C2NwgepP.js";import{B as L}from"./chunk-UVKPFVEO-BMyCL0NM.js";import"./preload-helper-Dp1pzeXC.js";import"./index-jvvADG1i.js";import"./api-CKEtK0ZG.js";import"./index-DueU0MVj.js";import"./sheet-RJ0ypyfk.js";import"./index-BTjU9lFH.js";import"./x-DMPzMYdX.js";import"./i18n-C6f_13ML.js";import"./button-1B-VaxXW.js";import"./index-JEWPsZM2.js";import"./action-button-q5Iewh9a.js";import"./dropdown-menu-X3DTAFHM.js";import"./index-5AO7-ZcO.js";import"./circle-CUlY3_HL.js";import"./check-Co7JZAXN.js";import"./separator-iydTIEtg.js";import"./spinner-CggbGRU1.js";import"./rich-text-viewer-BJqHiPTY.js";import"./toggle-XihVMuUt.js";import"./single-avatar-CNl-T1hj.js";import"./avatar-D5CfaQPQ.js";import"./avatar.utils-DZpi9qMB.js";import"./hover-card-C0Go6GL1.js";import"./date-BaZs8ImO.js";import"./skeleton-Df2Tuwhu.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var y,f,w;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(w=(f=o.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const or=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,or as __namedExportsOrder,ar as default};
