import{r as v,j as e,s as h,T as x,l as N,m as C,ad as S}from"./iframe-GYMnz-7x.js";import{h as p}from"./index-B2PsYcUF.js";import{S as o}from"./api-EcWoeBNP.js";import{B as j}from"./button-BW7uYpsZ.js";import{P as T,a as E,b as I}from"./popover-B8xXFIbE.js";import{u as q}from"./i18n-LMd9zC7u.js";import{M as w,N as L,L as b}from"./notes-container-D97TgroA.js";import{C as P,A as t}from"./applications-config-DO7CSrqT.js";import{n as c,g}from"./api-notes-CwrXYFVT.js";import{a as m}from"./story-section-B8hLDL9V.js";import{d}from"./delay-maBNLMVv.js";import{B as R}from"./chunk-QUQL4437-CI2-bQxg.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-C5yNblEX.js";import"./dropdown-menu-D8RNBs8V.js";import"./index-DWsE9wOP.js";import"./index-OS3JsfxU.js";import"./check-BxNDYKk2.js";import"./circle-q-mOcdtX.js";import"./separator-CxIJlsta.js";import"./index-CtN1RmEe.js";import"./index-DWwVjCJn.js";import"./rich-text-editor-MgWfXnN8.js";import"./with-selector-CqhPWCSc.js";import"./toggle-Co5VhbxE.js";import"./input-D7Dfp8eO.js";import"./label-C7sSkWa7.js";import"./x-B0j_u5GZ.js";import"./underline-Bj9klKnk.js";import"./use-tenant-Dwdxak71.js";import"./api-LbIRQM0U.js";import"./user-avatar-SFFCxjxL.js";import"./avatar-Z7WboOax.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-B0bPJZvB.js";import"./anchor-link-6vbMO4KR.js";import"./rich-text-viewer-D0CmLt-R.js";import"./date-CbAq5C5L.js";import"./format-g6YF7acM.js";import"./skeleton-B2fVud72.js";function s({hasNotes:r,loading:_=!1,...f}){const{t:l}=q(),u=v.useCallback(y=>{document.querySelector('[role="alertdialog"]')&&y.preventDefault()},[]);return e.jsxs(T,{children:[e.jsx(h,{children:e.jsxs(x,{children:[e.jsx(N,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(j,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(w,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(C,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(I,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(L,{...f,enableSkeletonLoading:!1,withHeader:!0})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},withHeader:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Ne={title:"Features/Notes/Notes Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(R,{children:e.jsx(P,{config:O,children:e.jsx(b,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await d(500),g()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(s,{...r})})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(s,{...r})})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(s,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
