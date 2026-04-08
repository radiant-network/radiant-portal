import{j as e}from"./iframe-ccOMwIfL.js";import{h as i,H as _}from"./index-VR6TYo-H.js";import{N as n}from"./notes-slider-sheet-spztQG4t.js";import{C as j,A as t}from"./applications-config-CULgtTCI.js";import{L as x}from"./notes-container-CWK2wci6.js";import{n as m,g as S}from"./api-notes-lVcjRtdd.js";import{d as p}from"./delay-3nR__645.js";import{B as L}from"./chunk-UVKPFVEO-DqmA1WT8.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Dw7ARh7S.js";import"./api-D4LlywOg.js";import"./index-CUTN0j6c.js";import"./sheet-0v-RTkDQ.js";import"./index-BE7ChZkl.js";import"./x-DmFfSvDI.js";import"./i18n-C0wFy6ss.js";import"./button-BLtXfBKf.js";import"./index-yFtBxm3-.js";import"./action-button-5Ba1TO7C.js";import"./dropdown-menu-BdU3Xrod.js";import"./index-C00d-gDV.js";import"./circle-IW85Nuet.js";import"./check-BroyD7fJ.js";import"./separator-DHYmz1t3.js";import"./spinner-DRNVi5y4.js";import"./rich-text-viewer-BSBJeLQu.js";import"./toggle-BMbEAlnU.js";import"./single-avatar-wnXI_WBb.js";import"./avatar-D8rSmvVF.js";import"./avatar.utils-Dke7mqRZ.js";import"./hover-card-CHSFQpYs.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-DOCUhCHG.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
