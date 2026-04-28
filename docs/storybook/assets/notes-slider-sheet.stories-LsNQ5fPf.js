import{j as r}from"./iframe-xGkqtlg9.js";import{h as i,H as S}from"./index-DrrsxIVV.js";import{N as o}from"./notes-slider-sheet-C7pEO2za.js";import{C as j,A as t}from"./applications-config-BTzzOLmm.js";import{L as x}from"./notes-container-CVVl4OYA.js";import{n as m,g as w}from"./api-notes-ByfnodAh.js";import{d as p}from"./delay-Dj3OMf1A.js";import{B as L}from"./chunk-UVKPFVEO-DdI5112M.js";import"./preload-helper-Dp1pzeXC.js";import"./index-C7B--a44.js";import"./api-B3xiDz_1.js";import"./index-BfOXvTVD.js";import"./sheet-C0VSpYKg.js";import"./index-B5BTRGrT.js";import"./x-GooFnSwI.js";import"./i18n-DS245Ekr.js";import"./button-BzI5Txcv.js";import"./index-DXx_HuLb.js";import"./action-button-IkQ9gKje.js";import"./dropdown-menu-B9HBkG3M.js";import"./index-BN2l1LOC.js";import"./circle-Dd8Am3-R.js";import"./check-8HsZpsjV.js";import"./separator-BM5cwLPt.js";import"./spinner-Dgi3nJ3I.js";import"./rich-text-viewer-BJWY-JSS.js";import"./toggle-DJZ6ioPj.js";import"./single-avatar-BXW3Z0Nj.js";import"./avatar-AIHr5bzy.js";import"./avatar.utils-CzjlwNJQ.js";import"./hover-card-j5PGHi2K.js";import"./date-D28dJgSv.js";import"./skeleton-uYceCD8w.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
