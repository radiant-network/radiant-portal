import{r as P,j as e,T as q,b as w,d as b,e as L}from"./iframe-GdxnesVn.js";import{h as i,H as C}from"./index-Hy8dHOKY.js";import{B as k}from"./button-ClPsGv-5.js";import{P as A,a as E,b as H}from"./popover-CPeYGo9v.js";import{u as S}from"./i18n-DzmMPxCa.js";import{M,N as B,L as D}from"./notes-container-Br3o54wd.js";import{C as O,A as s}from"./applications-config-BKnXAE14.js";import{n as p,g as T}from"./api-notes-CvI5RTeR.js";import{d as m}from"./delay-DxaevPtx.js";import{B as R}from"./chunk-UVKPFVEO-DmnjYX4q.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CCfaDUsQ.js";import"./action-button-DdwRbbYb.js";import"./dropdown-menu-Bt4yU2yO.js";import"./index-lbgyfsZT.js";import"./index-CohetcGb.js";import"./check-83bVRx4O.js";import"./circle-vuLCNpQ4.js";import"./separator-BeWp1rgn.js";import"./api-Dv-D8lFH.js";import"./index-BtVIboGS.js";import"./api-QmR3WP_i.js";import"./rich-text-editor-5EUEC8qr.js";import"./toggle-DuMP_hb3.js";import"./input-DOfCsDEw.js";import"./label-P9_Lcewp.js";import"./x-BiI2aFGl.js";import"./underline-NkShAbMo.js";import"./single-avatar-DhZO_qki.js";import"./avatar-DT6-fkef.js";import"./avatar.utils-BM9bevqO.js";import"./hover-card-CkEBySaI.js";import"./rich-text-viewer-O8pKHT-K.js";import"./date-CHYPQXl4.js";import"./format-XEWUsUf5.js";import"./skeleton-C9LrNl4S.js";function t({hasNotes:r,loading:_=!1,...N}){const{t:d}=S(),c=P.useCallback(I=>{document.querySelector('[role="alertdialog"]')&&I.preventDefault()},[]);return e.jsxs(A,{children:[e.jsx(q,{children:e.jsxs(w,{children:[e.jsx(b,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(k,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(M,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(L,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(H,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:c,onInteractOutside:c,children:e.jsx(B,{...N})})]})}t.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const z={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},Ie={title:"Notes/Popover",component:t,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(R,{children:e.jsx(O,{config:z,children:e.jsx(D,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),T()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),T()))]}},args:{seqId:2},render:r=>e.jsx(t,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),C.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(t,{...r})};var l,u,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
