import{j as e}from"./iframe-Bra7BrzY.js";import{h as i,H as _}from"./index-Dc7Hk5s2.js";import{N as n}from"./notes-slider-sheet-DMDAxmjD.js";import{C as j,A as t}from"./applications-config-DW3qryTR.js";import{L as x}from"./notes-container-DY2gKxKj.js";import{n as m,g as S}from"./api-notes-D8o8lW1U.js";import{d as p}from"./delay-BrjsuMDz.js";import{B as L}from"./chunk-UVKPFVEO-DYFVhshW.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BsA1xiPU.js";import"./api-D4LlywOg.js";import"./index-DeHbfRdg.js";import"./sheet-Ai8225aI.js";import"./index-D5dIcKly.js";import"./x-DbNIPTI-.js";import"./i18n-CFoYhjc3.js";import"./button-CSB0kMy7.js";import"./index-NT_GO876.js";import"./action-button-CuOj0rQo.js";import"./dropdown-menu-BRnHxzTv.js";import"./index-CplJWOBr.js";import"./circle-hSp_5v-D.js";import"./check-BUKGNLUc.js";import"./separator-B1o4r62N.js";import"./spinner-i_-ptaNJ.js";import"./rich-text-viewer-Cet2eAfi.js";import"./toggle-DjDuNayk.js";import"./single-avatar-CXV_3O9h.js";import"./avatar-CnXf4LDP.js";import"./avatar.utils-CyVyhLqL.js";import"./hover-card-BumForlE.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-DvHtnFI7.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var y,f,w;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(w=(f=o.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const or=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,or as __namedExportsOrder,ar as default};
