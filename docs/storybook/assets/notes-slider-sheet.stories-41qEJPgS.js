import{j as r}from"./iframe-DWjgVUMq.js";import{h as i,H as S}from"./index-Cd0OR6Pq.js";import{N as n}from"./notes-slider-sheet-BOjTVQBd.js";import{C as j,A as t}from"./applications-config-zISIMikj.js";import{L as x}from"./notes-container-Dd7hn6Du.js";import{n as m,g as w}from"./api-notes-biOGh4tS.js";import{d as p}from"./delay-w-4xwr23.js";import{B as L}from"./chunk-UVKPFVEO-D1hSeZDO.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DeSFnYYz.js";import"./index-C1hiBCVo.js";import"./api-Bs_y-PxM.js";import"./sheet-BMZzE26b.js";import"./index-DduKEAgd.js";import"./x-C7x8Bac6.js";import"./i18n-Cvdk8XAK.js";import"./button-AKfI-ujp.js";import"./index-DX1RJuPt.js";import"./action-button-uBBNzLjE.js";import"./dropdown-menu-BvruUYIF.js";import"./index-VEESf9AA.js";import"./circle-DuBuILkt.js";import"./check-BmPo_W3p.js";import"./separator-C6P9C4bz.js";import"./spinner-DCBLxpGn.js";import"./rich-text-editor-Bi4vsRZo.js";import"./toggle-DCiE0dzA.js";import"./single-avatar-DLLboCWE.js";import"./avatar-BiVo41Mo.js";import"./avatar.utils-DFtH1jlK.js";import"./hover-card-EEGONXCg.js";import"./rich-text-viewer-BoOjYY3T.js";import"./date-CQuqUEoD.js";import"./format-C1bjJRhj.js";import"./skeleton-Dh-FCSHj.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ne={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(n,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(n,{...e})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(n,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var _,y,f;o.parameters={...o.parameters,docs:{...(_=o.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(f=(y=o.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const ie=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,ie as __namedExportsOrder,ne as default};
