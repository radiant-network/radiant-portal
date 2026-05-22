import{r as P,j as e,T as q,b as w,d as b,e as L}from"./iframe-DiSFfoD4.js";import{h as i,H as C}from"./index-DzagocFe.js";import{B as k}from"./button-BV9rrKND.js";import{P as A,a as E,b as H}from"./popover-Btvtjdcu.js";import{u as S}from"./i18n-0aycJ8bv.js";import{M,N as B,L as D}from"./notes-container-CMvbgF5L.js";import{C as O,A as s}from"./applications-config-XePMBFpQ.js";import{n as p,g as T}from"./api-notes-DS8ZSoli.js";import{d as m}from"./delay-BIYzoXrY.js";import{B as R}from"./chunk-UVKPFVEO-Dk2k7YJq.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BL8oEubm.js";import"./action-button-BLEZ4s-Z.js";import"./dropdown-menu-Co-ilK63.js";import"./index-Cg7zLYUJ.js";import"./index-BRwQSXJv.js";import"./check-jCtI0cKB.js";import"./circle-CvzX10sS.js";import"./separator-KK1C3d3J.js";import"./api-CinLHSl0.js";import"./index-SNNKgtnK.js";import"./api-QmR3WP_i.js";import"./rich-text-editor-xed6RyXU.js";import"./toggle-T_MucoYP.js";import"./input-C7_zKUAr.js";import"./label-DZcF-8sB.js";import"./x-CnTOoAws.js";import"./underline-CxcCCXOm.js";import"./single-avatar-B6hpng6S.js";import"./avatar-CxnfKJ-b.js";import"./avatar.utils-CCI6u3kt.js";import"./hover-card-CnN-jMqR.js";import"./rich-text-viewer-Bx-7OSuH.js";import"./date-DDEqOim8.js";import"./format-7VDSBl_O.js";import"./skeleton-D5mkhX1K.js";function t({hasNotes:r,loading:_=!1,...N}){const{t:d}=S(),c=P.useCallback(I=>{document.querySelector('[role="alertdialog"]')&&I.preventDefault()},[]);return e.jsxs(A,{children:[e.jsx(q,{children:e.jsxs(w,{children:[e.jsx(b,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(k,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(M,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(L,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(H,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:c,onInteractOutside:c,children:e.jsx(B,{...N})})]})}t.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const z={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},Ie={title:"Notes/Popover",component:t,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(R,{children:e.jsx(O,{config:z,children:e.jsx(D,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),T()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),T()))]}},args:{seqId:2},render:r=>e.jsx(t,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),C.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(t,{...r})};var l,u,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,f,x;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(x=(f=a.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var v,y,j;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(j=(y=n.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};const Pe=["Default","Loading","Empty"];export{o as Default,n as Empty,a as Loading,Pe as __namedExportsOrder,Ie as default};
