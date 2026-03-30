import{j as e}from"./iframe-Bgw3uR-9.js";import{h as i,H as _}from"./index-4g0BD4zL.js";import{N as n}from"./notes-slider-sheet-4VkrafBX.js";import{C as j,A as t}from"./applications-config-D0vlE3YL.js";import{L as x}from"./notes-container-EGalaM_U.js";import{n as m,g as S}from"./api-notes-COk_V8b4.js";import{d as p}from"./delay-D5osbGl8.js";import{B as L}from"./chunk-UVKPFVEO-Bd4vPBeP.js";import"./preload-helper-Dp1pzeXC.js";import"./index-yyHQaXcq.js";import"./api-DA-7dRzo.js";import"./index-DLfxwTg2.js";import"./sheet-BnPbw1N7.js";import"./index-BgoLRxeb.js";import"./x-B5xaZwNy.js";import"./i18n-BiGX2f4l.js";import"./button-Quz-tjMR.js";import"./index-Dy2frFx_.js";import"./action-button-BkVWXcC6.js";import"./dropdown-menu-CCo1KQ2f.js";import"./index-BoUzJc-p.js";import"./circle-CQKKVFOR.js";import"./check-WdjjoOsi.js";import"./separator-JF2g8UGw.js";import"./spinner-B5ySuZZ2.js";import"./rich-text-viewer-DmR-gF20.js";import"./toggle-uB5k-JtM.js";import"./single-avatar-sAqXxsVR.js";import"./avatar-8p14Xr68.js";import"./avatar.utils-CYlLYSB7.js";import"./hover-card-BiFs5SKt.js";import"./en-US-DpFScRkU.js";import"./skeleton-zYtuA3YD.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
