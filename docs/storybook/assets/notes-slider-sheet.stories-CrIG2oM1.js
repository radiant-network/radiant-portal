import{j as r}from"./iframe-wQ3-hBIM.js";import{h as i,H as S}from"./index-DDWG9vJi.js";import{N as o}from"./notes-slider-sheet-BSd8gSFO.js";import{C as j,A as t}from"./applications-config-DvUMgcKR.js";import{L as x}from"./notes-container-Lutc_SDy.js";import{n as m,g as w}from"./api-notes-Dk_WHbH7.js";import{d as p}from"./delay-DOVHDCgp.js";import{B as L}from"./chunk-UVKPFVEO-3nshXwu1.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DRI0-15e.js";import"./api-B3xiDz_1.js";import"./index-oqEa9vOT.js";import"./sheet-DDz8Dn6I.js";import"./index-DTknOOY5.js";import"./x-DnmVtlj1.js";import"./i18n-CWvWXk2X.js";import"./button-Bj2KR2dc.js";import"./index-BdVk7Sny.js";import"./action-button-Txs2q945.js";import"./dropdown-menu-6JkKY-VA.js";import"./index-DAyLWoxP.js";import"./circle-Bq7GqULo.js";import"./check-BTt_u77A.js";import"./separator-Bh0CWtfy.js";import"./spinner-fofLYpjT.js";import"./rich-text-viewer-CV-vuThZ.js";import"./toggle-CQ0ukpmi.js";import"./single-avatar-CueTyE1J.js";import"./avatar-zqHVP4cw.js";import"./avatar.utils-BM7T9WuN.js";import"./hover-card-DFopdfbq.js";import"./date-C9SH8rRN.js";import"./skeleton-DtNikeOp.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
