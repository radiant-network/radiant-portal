import{r as v,j as e,k as h,T as x,e as N,f as C,a8 as S}from"./iframe-Dt4dd9_L.js";import{h as p}from"./index-DSw4xTCz.js";import{S as o}from"./api-CNFUPySA.js";import{B as j}from"./button-BHpOt1n5.js";import{P as T,a as E,b as I}from"./popover-DCNuZ3RF.js";import{u as L}from"./i18n-Buhp04UG.js";import{M as q,N as P,L as R}from"./notes-container-B4ouFjb5.js";import{C as b,A as t}from"./applications-config-BQIHy1i7.js";import{n as c,g}from"./api-notes-DHfKGGlk.js";import{a as m}from"./story-section-Ba8l4DMz.js";import{d}from"./delay-BBK_r3Z_.js";import{B as w}from"./chunk-QUQL4437-BTVBKelx.js";import"./preload-helper-PPVm8Dsz.js";import"./index--YEVJleu.js";import"./action-button-CUVXthKf.js";import"./dropdown-menu-Db1zsnSb.js";import"./index-B3Y_IRPe.js";import"./index-DydgcOJb.js";import"./check-BkrZypcC.js";import"./circle-CQ2dwaF5.js";import"./separator-CHrX4g91.js";import"./index-t9s_g_zt.js";import"./api-C7m0mtH6.js";import"./rich-text-editor-CG0fIc4-.js";import"./toggle-BdeDLJU1.js";import"./input-CK8eo80s.js";import"./label-DK9k00Nb.js";import"./x-CPSnwLTF.js";import"./underline-DHG6qIP2.js";import"./user-avatar-BLXmnD0D.js";import"./avatar-DP2zl4_L.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Cow8AfsI.js";import"./rich-text-viewer-CdTucUkk.js";import"./date-BifFTD-P.js";import"./format-BE7tt4ZM.js";import"./skeleton-DumOnALl.js";function s({hasNotes:r,loading:_=!1,...f}){const{t:l}=L(),u=v.useCallback(y=>{document.querySelector('[role="alertdialog"]')&&y.preventDefault()},[]);return e.jsxs(T,{children:[e.jsx(h,{children:e.jsxs(x,{children:[e.jsx(N,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(j,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(q,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(C,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(I,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(P,{...f,enableSkeletonLoading:!1})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Notes/Notes Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(w,{children:e.jsx(b,{config:O,children:e.jsx(R,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await d(500),g()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(s,{...r})})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(s,{...r})})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(s,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const he=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,he as __namedExportsOrder,ve as default};
