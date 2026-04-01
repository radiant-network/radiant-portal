import{j as e}from"./iframe-C7jn1w-3.js";import{h as i,H as _}from"./index-DkEcBht-.js";import{N as n}from"./notes-slider-sheet-Cg4Iphey.js";import{C as j,A as t}from"./applications-config-Bk65MKSm.js";import{L as x}from"./notes-container-CEHTWWQt.js";import{n as m,g as S}from"./api-notes-Ce71ajS3.js";import{d as p}from"./delay-CZ8QCqQG.js";import{B as L}from"./chunk-UVKPFVEO-CJBhAclt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DZ_YjmMj.js";import"./api-D4LlywOg.js";import"./index-CeDEb3VP.js";import"./sheet-C5Cfv2ar.js";import"./index-wJIafMwJ.js";import"./x-DXi24WI2.js";import"./i18n-CdKKW1PB.js";import"./button-CTjlFfje.js";import"./index-BWcCf9gX.js";import"./action-button-Dl7JXJeE.js";import"./dropdown-menu-DKdo4esO.js";import"./index-Clq7xlMW.js";import"./circle-D-fvj2ls.js";import"./check-D4rH88n2.js";import"./separator-CvaK_05O.js";import"./spinner-DzT8EY-K.js";import"./rich-text-viewer-C96TTV-X.js";import"./toggle-CAi5rd75.js";import"./single-avatar-DO1sYgN3.js";import"./avatar-CD9a1WE3.js";import"./avatar.utils-inIEacG_.js";import"./hover-card-DPaOvKtt.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-CXqC3TN3.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
