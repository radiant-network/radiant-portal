import{j as r}from"./iframe-Cjvt2qOF.js";import{h as i,H as S}from"./index-DGq_8iqW.js";import{N as o}from"./notes-slider-sheet-CTHRd20m.js";import{C as j,A as t}from"./applications-config-CvuYNe9c.js";import{L as x}from"./notes-container-CAjYS7CY.js";import{n as m,g as w}from"./api-notes-DPonke_E.js";import{d as p}from"./delay-SXKy90T2.js";import{B as L}from"./chunk-UVKPFVEO-BFJGVNwp.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BTgHPM2l.js";import"./api-B3xiDz_1.js";import"./index-Bhn0BmqL.js";import"./sheet-DcXbXXud.js";import"./index-LyEionHn.js";import"./x-DnYZPIfo.js";import"./i18n-Dnv80NNE.js";import"./button-31A3H1QR.js";import"./index-hYefdW70.js";import"./action-button-DpQP58Hu.js";import"./dropdown-menu-0dsgiVyr.js";import"./index-lwMICRJh.js";import"./circle-DLZqJxqN.js";import"./check-C-jOFTXU.js";import"./separator-xFgR_GDd.js";import"./spinner-BmnxKGrI.js";import"./rich-text-viewer-BuWpKYiZ.js";import"./toggle-C4819WG0.js";import"./single-avatar-ZlINT_lr.js";import"./avatar-DgtsYQWU.js";import"./avatar.utils-EAWS68on.js";import"./hover-card-BM6l5Z19.js";import"./date-bJL7ZfHL.js";import"./skeleton-DUy6XORO.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
