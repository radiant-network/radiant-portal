import{j as e}from"./iframe-WC6BGKUB.js";import{h as i,H as _}from"./index-QKEue82O.js";import{N as n}from"./notes-slider-sheet-DNHBoWbU.js";import{C as j,A as t}from"./applications-config-Tn8rBGB3.js";import{L as x}from"./notes-container-DDBhmqSX.js";import{n as m,g as S}from"./api-notes-D0vEu14S.js";import{d as p}from"./delay-DlmxVYMk.js";import{B as L}from"./chunk-UVKPFVEO-DUO1QKGi.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Yfz5FAUG.js";import"./api-D4LlywOg.js";import"./index-Dnsf4l8R.js";import"./sheet-BgFDFPfQ.js";import"./index-B_E7ixgt.js";import"./x-1g5Rag1Y.js";import"./i18n-5WI_T24j.js";import"./button-CA-zbsLM.js";import"./index-D2pVgx5K.js";import"./action-button-C6qZVQy1.js";import"./dropdown-menu-CpH37uPw.js";import"./index-Cfyzgyzw.js";import"./circle-DQN83PW9.js";import"./check-CnVj4Ic9.js";import"./separator-DJdib8gP.js";import"./spinner-B3zx_LVv.js";import"./rich-text-viewer-DjWjhy7_.js";import"./toggle-VTmPZ4O1.js";import"./single-avatar-DUVM895k.js";import"./avatar-DDGtxfh8.js";import"./avatar.utils-DDxzv1ge.js";import"./hover-card-BA7BC6nH.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-Bw2tsndW.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
