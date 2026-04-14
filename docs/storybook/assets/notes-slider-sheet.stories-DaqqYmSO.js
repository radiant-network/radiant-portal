import{j as e}from"./iframe-Mj4zOzjn.js";import{h as i,H as _}from"./index-dLRvGw0Q.js";import{N as n}from"./notes-slider-sheet-B4eu0TR8.js";import{C as j,A as t}from"./applications-config-DNpI5EDA.js";import{L as x}from"./notes-container-DHKdHPZQ.js";import{n as m,g as S}from"./api-notes-BbrPcgLC.js";import{d as p}from"./delay-Bs6t2GdC.js";import{B as L}from"./chunk-UVKPFVEO-D7P_gnJt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BvO95tI6.js";import"./api-CKEtK0ZG.js";import"./index-D50TqUHX.js";import"./sheet-CMXLcGCJ.js";import"./index-BODgoOwb.js";import"./x-B4hNLC2m.js";import"./i18n-D7CQrfw4.js";import"./button-Baro89Xr.js";import"./index-CGnO8p89.js";import"./action-button-B7DtYGkA.js";import"./dropdown-menu-XuAE7AD4.js";import"./index-DCSw9bU0.js";import"./circle-Ctha_G79.js";import"./check-CxA7LB38.js";import"./separator-U58rRJAm.js";import"./spinner-BJlxtKRw.js";import"./rich-text-viewer-CD6tT3lZ.js";import"./toggle-D31iP8BD.js";import"./single-avatar-B9cL9u04.js";import"./avatar-DZmaeWTk.js";import"./avatar.utils-DjxM4hwu.js";import"./hover-card-PsTrNrsI.js";import"./date-BD_RlUG8.js";import"./skeleton-CB-GuFSC.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
