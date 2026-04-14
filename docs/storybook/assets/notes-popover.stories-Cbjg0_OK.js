import{r as P,j as e,T as w,b as _,d as q,e as b}from"./iframe-Mj4zOzjn.js";import{h as i,H as L}from"./index-dLRvGw0Q.js";import{B as C}from"./button-Baro89Xr.js";import{P as k,a as A,b as E}from"./popover-CaiHIWqZ.js";import{u as H}from"./i18n-D7CQrfw4.js";import{M as S,N as M,L as B}from"./notes-container-DHKdHPZQ.js";import{C as D,A as s}from"./applications-config-DNpI5EDA.js";import{n as p,g as T}from"./api-notes-BbrPcgLC.js";import{d as m}from"./delay-Bs6t2GdC.js";import{B as O}from"./chunk-UVKPFVEO-D7P_gnJt.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CGnO8p89.js";import"./action-button-B7DtYGkA.js";import"./dropdown-menu-XuAE7AD4.js";import"./index-DCSw9bU0.js";import"./circle-Ctha_G79.js";import"./check-CxA7LB38.js";import"./separator-U58rRJAm.js";import"./index-BvO95tI6.js";import"./api-CKEtK0ZG.js";import"./index-D50TqUHX.js";import"./rich-text-viewer-CD6tT3lZ.js";import"./toggle-D31iP8BD.js";import"./single-avatar-B9cL9u04.js";import"./avatar-DZmaeWTk.js";import"./avatar.utils-DjxM4hwu.js";import"./hover-card-PsTrNrsI.js";import"./date-BD_RlUG8.js";import"./skeleton-CB-GuFSC.js";function t({hasNotes:r,...N}){const{t:c}=H(),d=P.useCallback(I=>{document.querySelector('[role="alertdialog"]')&&I.preventDefault()},[]);return e.jsxs(k,{children:[e.jsx(w,{children:e.jsxs(_,{children:[e.jsx(q,{asChild:!0,children:e.jsx(A,{asChild:!0,children:e.jsxs(C,{className:"relative size-6",iconOnly:!0,variant:"ghost",children:[e.jsx(S,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(b,{children:c(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(E,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:d,onInteractOutside:d,children:e.jsx(M,{...N})})]})}t.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""}}};const R={variant_entity:{app_id:s.variant_entity},snv_occurrence:{app_id:s.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:s.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},xe={title:"Notes/Popover",component:t,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(O,{children:e.jsx(D,{config:R,children:e.jsx(B,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),T()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),T()))]}},args:{seqId:2},render:r=>e.jsx(t,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),L.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(t,{...r})};var l,u,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,x,f;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(10000);
        return getHTTPMockNotesList();
      })]
    }
  },
  args: {
    seqId: 2
  },
  render: args => <NotesPopover {...args} />
}`,...(f=(x=a.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var v,y,j;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })]
    }
  },
  args: {
    hasNotes: false,
    seqId: 3
  },
  render: args => <NotesPopover {...args} />
}`,...(j=(y=n.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};const fe=["Default","Loading","Empty"];export{o as Default,n as Empty,a as Loading,fe as __namedExportsOrder,xe as default};
