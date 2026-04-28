import{j as r}from"./iframe-C7m9FALj.js";import{h as i,H as S}from"./index-OMp-yhBJ.js";import{N as o}from"./notes-slider-sheet-znAQrAg7.js";import{C as j,A as t}from"./applications-config-Ca17-4U4.js";import{L as x}from"./notes-container-CoVyyJ5m.js";import{n as m,g as w}from"./api-notes-QNMBcjyS.js";import{d as p}from"./delay-oqe9X9zo.js";import{B as L}from"./chunk-UVKPFVEO-4G5nDoTu.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BFN4FIOF.js";import"./api-B3xiDz_1.js";import"./index-4Grb2BEh.js";import"./sheet-cqQJx6QD.js";import"./index-8VSVzrX8.js";import"./x-COkob3Py.js";import"./i18n-BEVU7gS4.js";import"./button-Bpqmwvt6.js";import"./index-D6-EMVHO.js";import"./action-button-Ct3rsJfW.js";import"./dropdown-menu-qKMd4mlg.js";import"./index-B4o9B4_n.js";import"./circle-Bk-w7dXK.js";import"./check-CljsLVET.js";import"./separator-BX9a_Pn9.js";import"./spinner-BEqvFN7j.js";import"./rich-text-viewer-D8FOA-DR.js";import"./toggle-Cs4LEC7_.js";import"./single-avatar-CioMpLbf.js";import"./avatar-Duh0z3ph.js";import"./avatar.utils-BXs6EqKH.js";import"./hover-card-sK8-SnVf.js";import"./date-BOdti70M.js";import"./skeleton-CgHwS9px.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
