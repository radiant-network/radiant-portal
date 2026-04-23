import{j as r}from"./iframe-D1O0fIzs.js";import{h as i,H as S}from"./index-M7ftm4_B.js";import{N as o}from"./notes-slider-sheet-DOCp7J2X.js";import{C as j,A as t}from"./applications-config-ScoXP_h_.js";import{L as x}from"./notes-container-CXZkZeKf.js";import{n as m,g as w}from"./api-notes-7FWZoQeL.js";import{d as p}from"./delay-BMq7YGTx.js";import{B as L}from"./chunk-UVKPFVEO-D9hcuDmi.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CmN4WOxI.js";import"./api-B3xiDz_1.js";import"./index-DIBzS8-U.js";import"./sheet-CwFMBYGB.js";import"./index-BTL5Lj23.js";import"./x-Bgdi1EK3.js";import"./i18n-CaxRaoGq.js";import"./button-CTx6P0Ya.js";import"./index-BzfNWmCa.js";import"./action-button-BDzRqary.js";import"./dropdown-menu-C5h0Lq7a.js";import"./index-CjdM_bb1.js";import"./circle-DyYcun8N.js";import"./check-DvH0iXvQ.js";import"./separator-B0csA_HG.js";import"./spinner-BCPSQgSp.js";import"./rich-text-viewer-Ren4u64D.js";import"./toggle-BQws94Bx.js";import"./single-avatar-DHt2omky.js";import"./avatar-D4-PgP2x.js";import"./avatar.utils-DnymdXfZ.js";import"./hover-card-CdMKpPQU.js";import"./date-CSSa-NnJ.js";import"./skeleton-CHW9FDTn.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
