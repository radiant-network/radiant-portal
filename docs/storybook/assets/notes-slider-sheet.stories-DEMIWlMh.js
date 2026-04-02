import{j as e}from"./iframe-Bo5RHwEg.js";import{h as i,H as _}from"./index-BE7hhu-0.js";import{N as n}from"./notes-slider-sheet-DTA1ZZVP.js";import{C as j,A as t}from"./applications-config-1KjFvSzf.js";import{L as x}from"./notes-container-IFXSoTcY.js";import{n as m,g as S}from"./api-notes-B1RGkpHW.js";import{d as p}from"./delay-60Si-nmH.js";import{B as L}from"./chunk-UVKPFVEO-BkyeNUaq.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CNE4WKYh.js";import"./api-D4LlywOg.js";import"./index-BEwrDLtU.js";import"./sheet-BChN-n04.js";import"./index-DxYPoQ9Q.js";import"./x-8yNW3_6e.js";import"./i18n-DKJ_1r2e.js";import"./button-LL67ycaC.js";import"./index-RbvwN6yS.js";import"./action-button-AqBXW0n2.js";import"./dropdown-menu-CNHMOBVX.js";import"./index-BPXwU9V8.js";import"./circle-DGpyzQaM.js";import"./check-BTUcXPXF.js";import"./separator-BQApiWN0.js";import"./spinner-BHnbmZYd.js";import"./rich-text-viewer-Bt5pHmg6.js";import"./toggle-DtvVkPzN.js";import"./single-avatar-BSJXrB2t.js";import"./avatar-amgpzCxo.js";import"./avatar.utils-Bw1Lnrco.js";import"./hover-card-DNqptEbq.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-CMK30Ylq.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
