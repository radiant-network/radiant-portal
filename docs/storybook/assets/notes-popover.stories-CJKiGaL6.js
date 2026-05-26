import{r as E,j as e,T as b,b as q,d as P,e as R}from"./iframe-UzZZM96I.js";import{h as p,H as S}from"./index-D3PW6uPH.js";import{S as s}from"./api-ok7Ado9G.js";import{B as w}from"./button-BWuJ3ILY.js";import{P as L,a as O,b as M}from"./popover-apmwcABE.js";import{u as A}from"./i18n-DIReciWC.js";import{M as k,N as H,L as V}from"./notes-container-BA7dGceg.js";import{C as U,A as t}from"./applications-config-C04VUxYV.js";import{n as c,g as x}from"./api-notes-Bybw49sa.js";import{d as m}from"./delay-CKXeUJET.js";import{B}from"./chunk-UVKPFVEO-DM0BTXi2.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BRUfjbBU.js";import"./action-button-ZppnzVQS.js";import"./dropdown-menu-C5x8kC1L.js";import"./index-CvKgbFy1.js";import"./index-BhlzdYk0.js";import"./check-Dbn9Sbvo.js";import"./circle-CnVfFRjs.js";import"./separator-D16OPgLn.js";import"./api-tdfUFFl-.js";import"./index-DIXd3_X8.js";import"./rich-text-editor-DvkY6taN.js";import"./toggle-BUG2PAUN.js";import"./input-CZmZM7P6.js";import"./label-DVaYV4Xo.js";import"./x-BqTFwZaJ.js";import"./underline-BvroCfXw.js";import"./single-avatar-B-0opr8M.js";import"./avatar-DGNbfxwC.js";import"./avatar.utils-Fpl7rb73.js";import"./hover-card-C9TuCPar.js";import"./rich-text-viewer-BYR-o1bH.js";import"./date-B7miXHZH.js";import"./format-eJu3MRBX.js";import"./skeleton-CBlVKJ-V.js";function o({hasNotes:r,loading:T=!1,...j}){const{t:d}=A(),l=E.useCallback(I=>{document.querySelector('[role="alertdialog"]')&&I.preventDefault()},[]);return e.jsxs(L,{children:[e.jsx(b,{children:e.jsxs(q,{children:[e.jsx(P,{asChild:!0,children:e.jsx(O,{asChild:!0,children:e.jsxs(w,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:T,children:[e.jsx(k,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(R,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(M,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:l,onInteractOutside:l,children:e.jsx(H,{...j,enableSkeletonLoading:!1})})]})}o.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const D={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Ie={title:"Notes/Popover",component:o,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(B,{children:e.jsx(U,{config:D,children:e.jsx(V,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await m(500),x()))]}},render:r=>e.jsx(o,{...r})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e4),x()))]}},args:{seqId:2},render:r=>e.jsx(o,{...r})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(o,{...r})};var u,g,_;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...(_=(g=a.parameters)==null?void 0:g.docs)==null?void 0:_.source}}};var f,v,y;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(y=(v=n.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var h,C,N;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(N=(C=i.parameters)==null?void 0:C.docs)==null?void 0:N.source}}};const Ee=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,Ee as __namedExportsOrder,Ie as default};
