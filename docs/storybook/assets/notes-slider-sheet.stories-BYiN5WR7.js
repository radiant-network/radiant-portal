import{j as r}from"./iframe-DeENhpj3.js";import{h as i,H as S}from"./index-BvaKqaQf.js";import{N as n}from"./notes-slider-sheet-Coy9mxYR.js";import{C as j,A as t}from"./applications-config-BQUbp24P.js";import{L as x}from"./notes-container-DD64NJHz.js";import{n as m,g as w}from"./api-notes-B2CHX6DF.js";import{d as p}from"./delay-DFo2OWui.js";import{B as L}from"./chunk-UVKPFVEO-BkFm6zil.js";import"./preload-helper-Dp1pzeXC.js";import"./api-C7CiEJth.js";import"./index-CgNcgPkP.js";import"./api-Bs_y-PxM.js";import"./sheet-diUXGAEt.js";import"./index-BoGo-HJH.js";import"./x-DzPdeYpW.js";import"./i18n-03jszPOH.js";import"./button-BwLNUtrw.js";import"./index-liVuYvd_.js";import"./action-button-CEuUK9Kv.js";import"./dropdown-menu-omAR5gxl.js";import"./index-BuDD1aRJ.js";import"./circle-ChnPvBa0.js";import"./check-DsCd6nqT.js";import"./separator-C8pgrcu4.js";import"./spinner-D7IZtZ2M.js";import"./rich-text-editor-B7mButc6.js";import"./toggle-wg8mAVsR.js";import"./single-avatar-zZOJQjtR.js";import"./avatar-DpargwbM.js";import"./avatar.utils-wksLMjDv.js";import"./hover-card-D8RDFuLF.js";import"./rich-text-viewer-ADxxg5CL.js";import"./date-F6XLvkFA.js";import"./format-DLfe9xJC.js";import"./skeleton-Can_aXr6.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ne={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(n,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(n,{...e})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(n,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
