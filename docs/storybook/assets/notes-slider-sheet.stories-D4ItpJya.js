import{j as e}from"./iframe-rY9FuL_1.js";import{h as i,H as _}from"./index-Bgbdl8s2.js";import{N as n}from"./notes-slider-sheet-BKUxPEEP.js";import{C as j,A as t}from"./applications-config-C67n0nta.js";import{L as x}from"./notes-container-VEroZdUK.js";import{n as m,g as S}from"./api-notes-BAByY8eB.js";import{d as p}from"./delay-BJo78xKJ.js";import{B as L}from"./chunk-UVKPFVEO-2PpKA9In.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CLIQgf0t.js";import"./api-D4LlywOg.js";import"./index-CM2V-28P.js";import"./sheet-DvHOIuQd.js";import"./index-CgOiqxmo.js";import"./x-CbDawBxt.js";import"./i18n-hNMK6Ji9.js";import"./button-Ls4_F8Zz.js";import"./index-CP0X7wP1.js";import"./action-button-CbeiqfGA.js";import"./dropdown-menu-DCtcWosA.js";import"./index-By7SdKDV.js";import"./circle-D8jm1hCI.js";import"./check-bVxim9Yq.js";import"./separator-CoiMU3f7.js";import"./spinner-CidkECma.js";import"./rich-text-viewer-aeNQqaMt.js";import"./toggle-DMOuwfN_.js";import"./single-avatar-gJauRvga.js";import"./avatar-CCBACn5M.js";import"./avatar.utils-DIBWtBdo.js";import"./hover-card-D07vlQ69.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-dBFUnXMr.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
