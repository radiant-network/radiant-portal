import{j as r}from"./iframe-DwV05S1p.js";import{h as i,H as S}from"./index-667wyI37.js";import{N as o}from"./notes-slider-sheet-0C_AqgZp.js";import{C as j,A as t}from"./applications-config-DqS3dtua.js";import{L as x}from"./notes-container-CiGUtziC.js";import{n as m,g as w}from"./api-notes-Bm5fNkk_.js";import{d as p}from"./delay-PUQyIFHG.js";import{B as L}from"./chunk-UVKPFVEO-DFWAGR3r.js";import"./preload-helper-Dp1pzeXC.js";import"./index-t_PxXkqr.js";import"./api-B3xiDz_1.js";import"./index-BYBWrGsO.js";import"./sheet-Y--qLDKn.js";import"./index-DaK-yDAC.js";import"./x-9Wg0hLG2.js";import"./i18n-BPwBx0U0.js";import"./button-B7S8DAML.js";import"./index-DkT9bF_G.js";import"./action-button-rf34Jql5.js";import"./dropdown-menu-Do4rV8AK.js";import"./index-COwLubOi.js";import"./circle-CvSlO3OY.js";import"./check-DgSxBg-m.js";import"./separator-2D9OjNsS.js";import"./spinner-DSHWI2kq.js";import"./rich-text-viewer-Uq3fXz53.js";import"./toggle-DBb3nCUb.js";import"./single-avatar-BseMkNfk.js";import"./avatar-CGkrhN_H.js";import"./avatar.utils-DSaUbG2Q.js";import"./hover-card-CH_a0KO1.js";import"./date-DrorWvgA.js";import"./skeleton-BYBETL6I.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
