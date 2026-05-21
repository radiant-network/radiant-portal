import{r as I,j as e,T as P,b as w,d as q,e as b}from"./iframe-DPCX_vyO.js";import{h as i,H as L}from"./index-DpNATUyD.js";import{B as C}from"./button-DGbd45qr.js";import{P as k,a as A,b as E}from"./popover-Bm69QTgr.js";import{u as H}from"./i18n-B5rlBJwG.js";import{M as S,N as M,L as B}from"./notes-container-BpgpyEZ7.js";import{C as D,A as s}from"./applications-config-D3m0Bzir.js";import{n as p,g as T}from"./api-notes-CFy8xkhL.js";import{d as m}from"./delay-Csw9jBGj.js";import{B as O}from"./chunk-UVKPFVEO-B3d5HzQh.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DBmHguou.js";import"./action-button-B2f6sewW.js";import"./dropdown-menu-Do2hewv7.js";import"./index-Bz-Twzm4.js";import"./index-4f4sMJQ-.js";import"./check-Cva_u8Wi.js";import"./circle-_vVbOuMs.js";import"./separator-DG3bXgVX.js";import"./api-CLexyRe_.js";import"./index-DWJAa04P.js";import"./api-8Q83AOwn.js";import"./rich-text-editor-CzE7eudT.js";import"./toggle-2fL9jnLF.js";import"./input-DiHA6mxe.js";import"./label-BVQe2CMK.js";import"./x-DQKG1W33.js";import"./underline-BQMlUF3Y.js";import"./single-avatar-Bo7uvwBd.js";import"./avatar-ELX0pBcY.js";import"./avatar.utils-CUhhzDiJ.js";import"./hover-card-DBcJKeGH.js";import"./rich-text-viewer-CLCZQefs.js";import"./date-BBJ7JINU.js";import"./format-Cyc88-m9.js";import"./skeleton-DOKN9Rap.js";function t({hasNotes:r,..._}){const{t:c}=H(),d=I.useCallback(N=>{document.querySelector('[role="alertdialog"]')&&N.preventDefault()},[]);return e.jsxs(k,{children:[e.jsx(P,{children:e.jsxs(w,{children:[e.jsx(q,{asChild:!0,children:e.jsx(A,{asChild:!0,children:e.jsxs(C,{className:"relative size-6",iconOnly:!0,variant:"ghost",children:[e.jsx(S,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(b,{children:c(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(E,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:d,onInteractOutside:d,children:e.jsx(M,{..._})})]})}t.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""}}};const R={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},Ne={title:"Notes/Popover",component:t,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(O,{children:e.jsx(D,{config:R,children:e.jsx(B,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),T()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),T()))]}},args:{seqId:2},render:r=>e.jsx(t,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),L.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(t,{...r})};var l,u,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
