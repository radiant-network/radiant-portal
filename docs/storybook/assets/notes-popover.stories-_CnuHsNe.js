import{r as h,j as e,n as v,T as x,f as N,h as C,ab as S}from"./iframe--Wr8akaj.js";import{h as p}from"./index-BNvLVGFb.js";import{S as o}from"./api-5e3Wi7_0.js";import{B as j}from"./button-AGQ9gLKF.js";import{P as T,a as E,b as I}from"./popover-7gu0n4w5.js";import{u as b}from"./i18n-Bg6Ec5jw.js";import{M as q,N as w,L}from"./notes-container-BZ7ap0m9.js";import{C as P,A as t}from"./applications-config-Bam6cSsz.js";import{n as c,g}from"./api-notes-DoDRogIU.js";import{a as m}from"./story-section-mf2KVIsr.js";import{d}from"./delay-DaEuuihb.js";import{B as R}from"./chunk-QUQL4437-csEiRURN.js";import"./preload-helper-PPVm8Dsz.js";import"./action-button-B8HAWUkq.js";import"./dropdown-menu-D__ES2m4.js";import"./index-D5QIG_v-.js";import"./index-CHj75zQJ.js";import"./check-DN_rAFtv.js";import"./circle-kD5s09G8.js";import"./separator-DW3W07XT.js";import"./index-C36_LE4b.js";import"./index-CKFT6Hhx.js";import"./rich-text-editor-BKYgPqiZ.js";import"./with-selector-Dcx6IIHZ.js";import"./toggle-OtELxQzk.js";import"./input-BO0YpR5a.js";import"./label-BV5ASGe5.js";import"./x-D_rtmg3q.js";import"./underline-Bk2KUvOP.js";import"./use-tenant-CrIXgj1f.js";import"./api-CRUcq8iX.js";import"./user-avatar-CfWLGlse.js";import"./avatar-DkfATUhe.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-C1ku92eF.js";import"./anchor-link-B5Oq9MEF.js";import"./rich-text-viewer-DA7KRJEj.js";import"./date-BX4jta_o.js";import"./format-BotbkKlB.js";import"./skeleton-BMw6N2bI.js";function s({hasNotes:r,loading:_=!1,...f}){const{t:l}=b(),u=h.useCallback(y=>{document.querySelector('[role="alertdialog"]')&&y.preventDefault()},[]);return e.jsxs(T,{children:[e.jsx(v,{children:e.jsxs(x,{children:[e.jsx(N,{asChild:!0,children:e.jsx(E,{asChild:!0,children:e.jsxs(j,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(q,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(C,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(I,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(w,{...f,enableSkeletonLoading:!1,withHeader:!0})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},withHeader:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Ne={title:"Features/Notes/Notes Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(R,{children:e.jsx(P,{config:O,children:e.jsx(L,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await d(500),g()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(s,{...r})})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(s,{...r})})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await d(1e3),S.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(s,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
