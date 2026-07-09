import{r as h,j as e,n as v,T as x,f as N,h as C,ad as S}from"./iframe-C5ghdKPC.js";import{h as p}from"./index-Sy_ni6Cx.js";import{S as o}from"./api-DxXkaL5r.js";import{B as j}from"./button-Bv6IhCvK.js";import{P as T,a as E,b as I}from"./popover-kheK7n3c.js";import{u as q}from"./i18n-BPASaW18.js";import{M as w,N as L,L as b}from"./notes-container-DfSBOVTH.js";import{C as P,A as t}from"./applications-config-DFulkYeq.js";import{n as c,g}from"./api-notes-Vxr9hzGw.js";import{a as m}from"./story-section-CLlhZcHq.js";import{d}from"./delay-nr-rWshI.js";import{B as R}from"./chunk-QUQL4437-C3I5PKxO.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-DJGIFk-q.js";import"./dropdown-menu-DoOCM-LE.js";import"./index-B--nswC9.js";import"./index-ARASfFZ8.js";import"./check-CWaWZXj3.js";import"./circle-IiyuoDyT.js";import"./separator-Pm6qs9Vj.js";import"./index-BhpGQa6j.js";import"./index-V3egl2xV.js";import"./rich-text-editor-DsIGpRSn.js";import"./with-selector-JcvuweIp.js";import"./toggle-DUD10rGP.js";import"./input-CEOktzmf.js";import"./label-Babr-5Nq.js";import"./x-DLnpHguX.js";import"./underline-aGGmGeIa.js";import"./use-tenant-CO_xBvZf.js";import"./api-BjHhlcVm.js";import"./user-avatar-BhRZWDFl.js";import"./avatar-DXdcEYNi.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-C6Lgvvgt.js";import"./anchor-link-BTq9AcqX.js";import"./rich-text-viewer-QVtN9z-7.js";import"./date-CVg6bLJ-.js";import"./format-BTKiQJtV.js";import"./skeleton-B-iZZ6gN.js";function s({hasNotes:r,loading:_=!1,...f}){const{t:l}=q(),u=h.useCallback(y=>{document.querySelector('[role="alertdialog"]')&&y.preventDefault()},[]);return e.jsxs(T,{children:[e.jsx(v,{children:e.jsxs(x,{children:[e.jsx(N,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(j,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(w,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(C,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(I,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(L,{...f,enableSkeletonLoading:!1,withHeader:!0})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},withHeader:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Ne={title:"Features/Notes/Notes Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(R,{children:e.jsx(P,{config:O,children:e.jsx(b,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await d(500),g()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(s,{...r})})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(s,{...r})})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(s,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const Ce=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,Ce as __namedExportsOrder,Ne as default};
