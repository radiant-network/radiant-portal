import{j as r}from"./iframe-DS1Fm7X-.js";import{h as i,H as S}from"./index-D2NCd5sN.js";import{N as o}from"./notes-slider-sheet-DlxPY6r7.js";import{C as j,A as t}from"./applications-config-CAvQMD8t.js";import{L as x}from"./notes-container-Cse2UQjf.js";import{n as m,g as w}from"./api-notes-B3ZHTLNt.js";import{d as p}from"./delay-CElFtB0D.js";import{B as L}from"./chunk-UVKPFVEO-BOun_a4c.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BDQe4weP.js";import"./api-B3xiDz_1.js";import"./index-G9VYMG24.js";import"./sheet-B7RJqo9J.js";import"./index-C9FT5irX.js";import"./x-DaBH8kTC.js";import"./i18n-D1vs1B9V.js";import"./button-BalFLK94.js";import"./index-BrVm3R5S.js";import"./action-button-h14xGsDw.js";import"./dropdown-menu-srrablED.js";import"./index-C_P4DlMj.js";import"./circle-BEjJTeaZ.js";import"./check-BaEquuuu.js";import"./separator-Du257jra.js";import"./spinner-8Eft4ZO_.js";import"./rich-text-viewer-Cc_VTHun.js";import"./toggle-CYKbAki7.js";import"./single-avatar-DLzHEUeD.js";import"./avatar-C-tqC5QR.js";import"./avatar.utils-K22vcKzp.js";import"./hover-card-CGqX9laL.js";import"./date-Y8DwkfjS.js";import"./skeleton-CI8ZB7Zg.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
