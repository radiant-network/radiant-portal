import{r as v,j as e,T as y,b as h,d as C,e as N,aa as x}from"./iframe-CgYzld9M.js";import{h as p}from"./index-DjF2ghAa.js";import{S as s}from"./api-CNFUPySA.js";import{B as T}from"./button-BB6JTV7B.js";import{P as j,a as I,b as E}from"./popover-CgcTZUAv.js";import{u as b}from"./i18n-BhtfqN2W.js";import{M as q,N as P,L as R}from"./notes-container-SUlsKhYj.js";import{C as S,A as t}from"./applications-config-DSaueCPj.js";import{n as c,g as u}from"./api-notes-C-JN49ae.js";import{d as m}from"./delay-yxgQ8DhP.js";import{B as w}from"./chunk-QUQL4437-Blla3tfU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-0Ui6iiVS.js";import"./action-button-Dd50ZnSl.js";import"./dropdown-menu-CCEHsgQp.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./check-DrnC7o8K.js";import"./circle-BJPs1Iry.js";import"./separator-BXAAQkGD.js";import"./index-BJLMTLPT.js";import"./api-C1_4ex4N.js";import"./rich-text-editor-E4qJXcsS.js";import"./toggle-at5pgcRR.js";import"./input-BVLSUFFJ.js";import"./label-DmVEf26Q.js";import"./x-B30BiZwY.js";import"./underline-BqnNrRat.js";import"./single-avatar-CsBSBvSX.js";import"./avatar-BZBile2U.js";import"./avatar.utils-BVJE-8hd.js";import"./hover-card-DZhlzgad.js";import"./rich-text-viewer-Bm2hPW8r.js";import"./date-8mJxKa3d.js";import"./format-DgGmklzE.js";import"./skeleton-BS9ObOBk.js";function o({hasNotes:r,loading:g=!1,..._}){const{t:d}=b(),l=v.useCallback(f=>{document.querySelector('[role="alertdialog"]')&&f.preventDefault()},[]);return e.jsxs(j,{children:[e.jsx(y,{children:e.jsxs(h,{children:[e.jsx(C,{asChild:!0,children:e.jsx(I,{asChild:!0,children:e.jsxs(T,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:g,children:[e.jsx(q,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(N,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(E,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:l,onInteractOutside:l,children:e.jsx(P,{..._,enableSkeletonLoading:!1})})]})}o.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const L={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},fe={title:"Notes/Popover",component:o,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(w,{children:e.jsx(S,{config:L,children:e.jsx(R,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await m(500),u()))]}},render:r=>e.jsx(o,{...r})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e4),u()))]}},args:{seqId:2},render:r=>e.jsx(o,{...r})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e3),x.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(o,{...r})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
