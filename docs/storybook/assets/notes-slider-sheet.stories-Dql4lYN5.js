import{j as e}from"./iframe-yUfF9TIc.js";import{h as i,H as _}from"./index-Bhj4jC6z.js";import{N as n}from"./notes-slider-sheet-ChmsrQZZ.js";import{C as j,A as t}from"./applications-config-CyRBT9P8.js";import{L as x}from"./notes-container-CX-R4EsE.js";import{n as m,g as S}from"./api-notes-CaK0_sJS.js";import{d as p}from"./delay-DDGlJxhM.js";import{B as L}from"./chunk-UVKPFVEO-B5y1qpRp.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BrkryTY3.js";import"./api-DjXONTrW.js";import"./index-BYaagrOR.js";import"./sheet-D4PIwKH-.js";import"./index--pcmwiUT.js";import"./x-CQFDkt5w.js";import"./i18n-D5-yTOs2.js";import"./button-DzCnVXi9.js";import"./index-Cz7BRqZL.js";import"./action-button-_1mg2YCc.js";import"./dropdown-menu-jyCWUAQn.js";import"./index-B00Ep4-c.js";import"./circle-DfDoC5sj.js";import"./check-CIqPLRIg.js";import"./separator-B6T5EJNA.js";import"./spinner-_bBq9HSt.js";import"./rich-text-viewer-Dqd92_gJ.js";import"./toggle-C7maD0IM.js";import"./single-avatar-CwPxvcla.js";import"./avatar-DUKxvziY.js";import"./avatar.utils-CxlA0IJH.js";import"./hover-card-DakVeW3S.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-CkY9kIWW.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
