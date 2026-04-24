import{j as r}from"./iframe-CRRv_ibS.js";import{h as i,H as S}from"./index-Ded7NQSS.js";import{N as o}from"./notes-slider-sheet-i3KCL2HA.js";import{C as j,A as t}from"./applications-config-DHEF0ajK.js";import{L as x}from"./notes-container-CkKXX-W6.js";import{n as m,g as w}from"./api-notes-DJnmLYVc.js";import{d as p}from"./delay-BHR0Q-aM.js";import{B as L}from"./chunk-UVKPFVEO-Co8HoQJe.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Be5NAWPT.js";import"./api-B3xiDz_1.js";import"./index-CBwMcGuW.js";import"./sheet-BwziYHZI.js";import"./index-DbXZYZ88.js";import"./x-DFGLtELr.js";import"./i18n-Cl__0Jt0.js";import"./button-CGUfaMs5.js";import"./index-BEmc1KKo.js";import"./action-button-DixJPHxK.js";import"./dropdown-menu-PTnS0g7N.js";import"./index-D5YiG8wC.js";import"./circle-DN0KfahX.js";import"./check-BvdvHDVF.js";import"./separator-B2H8WKeE.js";import"./spinner-Ch0G_cRA.js";import"./rich-text-viewer-BOK4wPl5.js";import"./toggle-BAxxgI2m.js";import"./single-avatar-CVwB3fVv.js";import"./avatar-D2gLt9PF.js";import"./avatar.utils-02K-YOZO.js";import"./hover-card-BRbQ_-Bm.js";import"./date-gYePC2nU.js";import"./skeleton-Cbw-sO5o.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
