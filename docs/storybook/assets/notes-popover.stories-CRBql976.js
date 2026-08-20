import{r as v,j as e,w as h,T as x,o as N,p as C,ag as S}from"./iframe-c2IPk3oe.js";import{h as p}from"./index-Be4Sy7Es.js";import{S as o}from"./api-Dm71OR6H.js";import{B as j}from"./button-Bjl3P42F.js";import{P as T,a as E,b as I}from"./popover-DMX6qJch.js";import{u as w}from"./i18n-CfOqn4nZ.js";import{M as q,N as L,L as b}from"./notes-container-B3XwfZ4k.js";import{C as P,A as t}from"./applications-config-CDi0XW_r.js";import{n as c,g}from"./api-notes-BJY7MQ73.js";import{a as m}from"./story-section-CAEPkWC7.js";import{d}from"./delay-DsCZxnb0.js";import{B as R}from"./chunk-QUQL4437-EUh0k2Sg.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-C7Rwv-R7.js";import"./dropdown-menu-abCbWXC_.js";import"./index-BxFSGfgl.js";import"./index-AnShAb8S.js";import"./check-DUGuR0C1.js";import"./circle-RRa7pUsB.js";import"./separator-CC9AvFe8.js";import"./index-Bk_1Mjxr.js";import"./index-B39quYzB.js";import"./rich-text-editor-3r_Ig5sc.js";import"./with-selector-DouIXjga.js";import"./toggle-BgSsHrcX.js";import"./input-B2-ilDsB.js";import"./label-DO7cBuUl.js";import"./x-DSPDcSor.js";import"./underline-Dn8ZDBDF.js";import"./use-tenant-Cfm7aHlC.js";import"./api-D4WrX2Ug.js";import"./403-CR-QzuB-.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BW-ZcWxC.js";import"./main-navbar-lang-switcher--5ICBnep.js";import"./user-avatar-EOuD-mYa.js";import"./avatar-sVQpfDVJ.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BzsJ7RIs.js";import"./anchor-link-BAK9T0JK.js";import"./rich-text-viewer-CnRmZg9O.js";import"./date-C5QupdGd.js";import"./format-Dwk99mKl.js";import"./skeleton-ZCtiSdbX.js";function s({hasNotes:r,loading:_=!1,...f}){const{t:l}=w(),u=v.useCallback(y=>{document.querySelector('[role="alertdialog"]')&&y.preventDefault()},[]);return e.jsxs(T,{children:[e.jsx(h,{children:e.jsxs(x,{children:[e.jsx(N,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(j,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(q,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(C,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(I,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(L,{...f,enableSkeletonLoading:!1,withHeader:!0})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},withHeader:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Te={title:"Features/Notes/Notes Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(R,{children:e.jsx(P,{config:O,children:e.jsx(b,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await d(500),g()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(s,{...r})})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(s,{...r})})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(s,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <StorySection title="Default">
      <NotesPopover {...args} />
    </StorySection>
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
  render: args => <StorySection title="Loading">
      <NotesPopover {...args} />
    </StorySection>
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
  render: args => <StorySection title="Empty">
      <NotesPopover {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};const Ee=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,Ee as __namedExportsOrder,Te as default};
