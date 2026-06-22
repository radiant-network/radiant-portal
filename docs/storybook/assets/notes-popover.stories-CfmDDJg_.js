import{r as v,j as e,s as h,T as x,l as N,m as C,ad as S}from"./iframe-CdF5EYmg.js";import{h as p}from"./index-DlbNcuff.js";import{S as o}from"./api-C5s-SBNp.js";import{B as j}from"./button-DAc04O7O.js";import{P as T,a as E,b as I}from"./popover-B076zbmv.js";import{u as L}from"./i18n-DK-5BTci.js";import{M as q,N as P,L as R}from"./notes-container-UsiZNs5j.js";import{C as b,A as t}from"./applications-config-2QMXSYav.js";import{n as c,g}from"./api-notes-BjJSVMzY.js";import{a as m}from"./story-section-D4XYOw5I.js";import{d}from"./delay-DOx9Y2wd.js";import{B as w}from"./chunk-QUQL4437-CEaj0cJF.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-B-isfSdX.js";import"./dropdown-menu-C0WhWNZB.js";import"./index-BBuEL3vt.js";import"./index-BViuv1GS.js";import"./check-DTlfPsbg.js";import"./circle-DBjNND0v.js";import"./separator-DtNz95I0.js";import"./index-Cp-tXBSJ.js";import"./api-BRruqAbc.js";import"./rich-text-editor-yCaSautH.js";import"./with-selector-AfVKEoZ0.js";import"./toggle-CAUG45k6.js";import"./input-7I5dAw3S.js";import"./label-BpIFLQV1.js";import"./x-Ka5G_vgD.js";import"./underline-BNBxtWSl.js";import"./user-avatar-Di-Qgq4T.js";import"./avatar-ZSgeKK97.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Bq2eIm9D.js";import"./anchor-link-WmGdnOZ3.js";import"./rich-text-viewer-CEihrz1Y.js";import"./date-CdcP65-c.js";import"./format-B0ZttnrE.js";import"./skeleton-BdSchkuJ.js";function s({hasNotes:r,loading:_=!1,...f}){const{t:l}=L(),u=v.useCallback(y=>{document.querySelector('[role="alertdialog"]')&&y.preventDefault()},[]);return e.jsxs(T,{children:[e.jsx(h,{children:e.jsxs(x,{children:[e.jsx(N,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(j,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(q,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(C,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(I,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(P,{...f,enableSkeletonLoading:!1})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},he={title:"Features/Notes/Notes Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(w,{children:e.jsx(b,{config:O,children:e.jsx(R,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await d(500),g()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(s,{...r})})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(s,{...r})})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(s,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const xe=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,xe as __namedExportsOrder,he as default};
