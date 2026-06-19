import{r as v,j as e,q as h,T as x,l as N,m as C,aa as S}from"./iframe-jcf7vZ_R.js";import{h as p}from"./index-BiD-JOhD.js";import{S as o}from"./api-C5s-SBNp.js";import{B as j}from"./button-Bifjei_v.js";import{P as T,a as E,b as I}from"./popover-B17-J3b5.js";import{u as q}from"./i18n-TdHrRC51.js";import{M as L,N as P,L as R}from"./notes-container-BYUuED5t.js";import{C as b,A as t}from"./applications-config-CrN8ifR1.js";import{n as c,g}from"./api-notes-CbvU1Af5.js";import{a as m}from"./story-section-Cpqu6Cmt.js";import{d}from"./delay-BO6BGdFV.js";import{B as w}from"./chunk-QUQL4437-NFsSyaH3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-z6U6JLum.js";import"./action-button-i99sGQY1.js";import"./dropdown-menu-HcH6XyTZ.js";import"./index-mGHp8w0J.js";import"./index-DCUZMTcN.js";import"./check-DnaYg78d.js";import"./circle-CbUZSSHN.js";import"./separator-etdbqUam.js";import"./index-B7ISGQ50.js";import"./index-CMj8FLxF.js";import"./api-BN29XHyi.js";import"./rich-text-editor-BPiKXp8d.js";import"./with-selector-C0wh6ev4.js";import"./toggle-CcHt0pqq.js";import"./input-CWzWdN3F.js";import"./label-C3r2BlYL.js";import"./x-CsZYw6Ul.js";import"./underline-YqX6x1qh.js";import"./user-avatar-DaXKis-i.js";import"./avatar-CAhGC5O5.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DDKC1EVg.js";import"./anchor-link-BYK_i9Of.js";import"./rich-text-viewer-ByrYCEN_.js";import"./date-D1ZESiCA.js";import"./format-CE6snWN5.js";import"./skeleton-Dh6-RIZO.js";function s({hasNotes:r,loading:_=!1,...f}){const{t:l}=q(),u=v.useCallback(y=>{document.querySelector('[role="alertdialog"]')&&y.preventDefault()},[]);return e.jsxs(T,{children:[e.jsx(h,{children:e.jsxs(x,{children:[e.jsx(N,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(j,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(L,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(C,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(I,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(P,{...f,enableSkeletonLoading:!1})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Ne={title:"Features/Notes/Notes Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(w,{children:e.jsx(b,{config:O,children:e.jsx(R,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await d(500),g()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(s,{...r})})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(s,{...r})})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(s,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
