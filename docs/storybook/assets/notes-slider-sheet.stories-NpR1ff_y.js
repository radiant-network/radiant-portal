import{j as r}from"./iframe-DuLG7CzE.js";import{h as i,H as S}from"./index-BZMh0cGY.js";import{N as o}from"./notes-slider-sheet-MXmcof4k.js";import{C as j,A as t}from"./applications-config-CsOtMLIq.js";import{L as x}from"./notes-container-BoeWnNOI.js";import{n as m,g as w}from"./api-notes-DomNMkru.js";import{d as p}from"./delay-Dt5YVD71.js";import{B as L}from"./chunk-UVKPFVEO-By4fVI7q.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DcpGw4_y.js";import"./api-B3xiDz_1.js";import"./index-DcfDzLtM.js";import"./sheet-C59TQYDK.js";import"./index-DyrWHFXw.js";import"./x-BZVkhNqM.js";import"./i18n-D2xdIxoW.js";import"./button-CUsPlIo2.js";import"./index-Bx95i1qM.js";import"./action-button-CSEEgQHQ.js";import"./dropdown-menu-Cs2vU4HI.js";import"./index-BLyKH7C8.js";import"./circle-Ae1tqnjS.js";import"./check-BcUof3b6.js";import"./separator-B9AcXafd.js";import"./spinner-BAEr12jG.js";import"./rich-text-viewer-Dcc4uSlZ.js";import"./toggle-BP3bvnwN.js";import"./single-avatar-BEgdRScD.js";import"./avatar-CDCund1N.js";import"./avatar.utils--ZG_xE66.js";import"./hover-card-tXRI_LZ_.js";import"./date-BhfZk0e3.js";import"./skeleton-BaOZ8ww4.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
