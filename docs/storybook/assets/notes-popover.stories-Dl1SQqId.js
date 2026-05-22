import{r as I,j as e,T as P,b as w,d as q,e as b}from"./iframe-DZxGQyD0.js";import{h as i,H as L}from"./index-DvOG8Qo-.js";import{B as C}from"./button-1W1d7xAn.js";import{P as k,a as A,b as E}from"./popover-DmAQc1Td.js";import{u as H}from"./i18n-C2h1o0aw.js";import{M as S,N as M,L as B}from"./notes-container-DdQe2HNB.js";import{C as D,A as s}from"./applications-config-Dm8iSn42.js";import{n as p,g as T}from"./api-notes-DUU9PM7j.js";import{d as m}from"./delay-CJDHVVV8.js";import{B as O}from"./chunk-UVKPFVEO-DevS1Rzl.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Busr1vTm.js";import"./action-button-tMYSlpGq.js";import"./dropdown-menu-LRGitqO-.js";import"./index-Do7m-0ZR.js";import"./index-B5XFpENV.js";import"./check-CYxpBnf-.js";import"./circle-CNziIkuH.js";import"./separator-DW3ZXT-L.js";import"./api-wIXIxrPs.js";import"./index-CtOZwwKW.js";import"./api-QmR3WP_i.js";import"./rich-text-editor-C1T-Wf3D.js";import"./toggle-BNSY36yt.js";import"./input-DOSbHBHI.js";import"./label-BW_LS4F4.js";import"./x-BOWcXDh5.js";import"./underline-Bsa7goLn.js";import"./single-avatar-DFDoKzPE.js";import"./avatar-Lsu8cxYA.js";import"./avatar.utils-D5ID22AQ.js";import"./hover-card-COU_VZ-Z.js";import"./rich-text-viewer-wsmSnaln.js";import"./date-Dap1gZCo.js";import"./format-B8OuGClS.js";import"./skeleton-DyLF_-eO.js";function t({hasNotes:r,..._}){const{t:c}=H(),d=I.useCallback(N=>{document.querySelector('[role="alertdialog"]')&&N.preventDefault()},[]);return e.jsxs(k,{children:[e.jsx(P,{children:e.jsxs(w,{children:[e.jsx(q,{asChild:!0,children:e.jsx(A,{asChild:!0,children:e.jsxs(C,{className:"relative size-6",iconOnly:!0,variant:"ghost",children:[e.jsx(S,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(b,{children:c(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(E,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:d,onInteractOutside:d,children:e.jsx(M,{..._})})]})}t.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""}}};const R={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},Ne={title:"Notes/Popover",component:t,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(O,{children:e.jsx(D,{config:R,children:e.jsx(B,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),T()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),T()))]}},args:{seqId:2},render:r=>e.jsx(t,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),L.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(t,{...r})};var l,u,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(j=(y=n.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};const Ie=["Default","Loading","Empty"];export{o as Default,n as Empty,a as Loading,Ie as __namedExportsOrder,Ne as default};
