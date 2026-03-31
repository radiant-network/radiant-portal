import{j as e}from"./iframe-BxmwNBfU.js";import{h as i,H as _}from"./index-BiQJvsiv.js";import{N as n}from"./notes-slider-sheet-3frexMPU.js";import{C as j,A as t}from"./applications-config-DeBuIJwz.js";import{L as x}from"./notes-container-DN4H5HyB.js";import{n as m,g as S}from"./api-notes-CGb4hTVU.js";import{d as p}from"./delay-CLQrmu-i.js";import{B as L}from"./chunk-UVKPFVEO-HEvO86Do.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CLSn2fO5.js";import"./api-DA-7dRzo.js";import"./index-BBUlzqM_.js";import"./sheet-ByWgYgWl.js";import"./index-CFgeAKVx.js";import"./x-BtTVamEd.js";import"./i18n-DHDEvtP2.js";import"./button-Bkoe4ap0.js";import"./index-BlaJQrTa.js";import"./action-button-YYoHvf27.js";import"./dropdown-menu-D15iAaZL.js";import"./index-DNG52xFh.js";import"./circle-LlW4xNOP.js";import"./check-BU4k5eRG.js";import"./separator-D4YLQwsE.js";import"./spinner-B19_98v5.js";import"./rich-text-viewer-P0ibljQA.js";import"./toggle-CeKHlqVV.js";import"./single-avatar-DAYn99S_.js";import"./avatar-CfqmBkfi.js";import"./avatar.utils-BPchJMvp.js";import"./hover-card-BnBk3uy1.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-DpIPZiM6.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
