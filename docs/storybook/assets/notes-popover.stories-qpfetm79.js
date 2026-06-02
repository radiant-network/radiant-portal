import{r as v,j as e,T as y,b as h,d as C,e as N,aa as x}from"./iframe-BH3MSqWK.js";import{h as p}from"./index-CJX5yBN4.js";import{S as s}from"./api-CNFUPySA.js";import{B as T}from"./button-BxP9PPaa.js";import{P as j,a as I,b as E}from"./popover-BMngGd2f.js";import{u as b}from"./i18n-MpjanH8G.js";import{M as q,N as P,L as R}from"./notes-container-BIV3lx5D.js";import{C as S,A as t}from"./applications-config-BSntMn92.js";import{n as c,g as u}from"./api-notes-BcoHz14J.js";import{d as m}from"./delay-J5Xhhn2A.js";import{B as w}from"./chunk-QUQL4437-DecpjHsp.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CfauPKxk.js";import"./action-button-DjPcyzdS.js";import"./dropdown-menu-DwRYTMWI.js";import"./index-B6DCGoSV.js";import"./index-Cipz7JOz.js";import"./check-Bk5l44Qw.js";import"./circle-Cyir8aSn.js";import"./separator-DyfWTagX.js";import"./index-BSwCZ4xH.js";import"./api-CW7YpE16.js";import"./rich-text-editor-ft2EOrpj.js";import"./toggle-BYnfgVa8.js";import"./input-h6d6rGg7.js";import"./label-CbaNIhYw.js";import"./x-D_WMbL1s.js";import"./underline-D843-jnD.js";import"./single-avatar-Ds76-A21.js";import"./avatar-DB1ZneiA.js";import"./avatar.utils-C5SUAW_9.js";import"./hover-card-CiyUyn9y.js";import"./rich-text-viewer-CWkAo8Cx.js";import"./date-C92wp4cq.js";import"./format-C4517A07.js";import"./skeleton-D3nQRcXW.js";function o({hasNotes:r,loading:g=!1,..._}){const{t:d}=b(),l=v.useCallback(f=>{document.querySelector('[role="alertdialog"]')&&f.preventDefault()},[]);return e.jsxs(j,{children:[e.jsx(y,{children:e.jsxs(h,{children:[e.jsx(C,{asChild:!0,children:e.jsx(I,{asChild:!0,children:e.jsxs(T,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:g,children:[e.jsx(q,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(N,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(E,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:l,onInteractOutside:l,children:e.jsx(P,{..._,enableSkeletonLoading:!1})})]})}o.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const L={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},fe={title:"Notes/Popover",component:o,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(w,{children:e.jsx(S,{config:L,children:e.jsx(R,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await m(500),u()))]}},render:r=>e.jsx(o,{...r})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e4),u()))]}},args:{seqId:2},render:r=>e.jsx(o,{...r})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e3),x.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(o,{...r})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ve=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,ve as __namedExportsOrder,fe as default};
