import{j as r}from"./iframe-BnhjNFOh.js";import{h as i,H as S}from"./index-DCYfCeTI.js";import{N as o}from"./notes-slider-sheet-2v3twDZT.js";import{C as j,A as t}from"./applications-config-DJ0L5svg.js";import{L as x}from"./notes-container-D0HJegj-.js";import{n as m,g as w}from"./api-notes-DnsSVPVk.js";import{d as p}from"./delay-Csbhqj95.js";import{B as L}from"./chunk-UVKPFVEO-5LvaRrcg.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BneP6Gfp.js";import"./api-B3xiDz_1.js";import"./index-DPU7ePy0.js";import"./sheet-TqobyQWt.js";import"./index-Bv73IXSx.js";import"./x-D7ocP_V2.js";import"./i18n-DXfzEXk-.js";import"./button-Bf___iVz.js";import"./index-B_TnZ6Np.js";import"./action-button-9l21L4qf.js";import"./dropdown-menu-BpLbmaEh.js";import"./index-BiPK5MjX.js";import"./circle-DLWsm5xp.js";import"./check-CDufVTAT.js";import"./separator-B7WHZjk7.js";import"./spinner-JqwqWsfj.js";import"./rich-text-viewer-aq7GJp_K.js";import"./toggle-Bv_MmOlt.js";import"./single-avatar-ChC2p12e.js";import"./avatar-CxDtaSSr.js";import"./avatar.utils-ASIlG-ab.js";import"./hover-card-Dw4FceE3.js";import"./date-DOkfKTV3.js";import"./skeleton-9d3sL9uE.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
