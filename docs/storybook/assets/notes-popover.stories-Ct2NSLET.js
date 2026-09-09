import{u as v,r as h,j as e,T as x,v as N,w as C,B as S,x as j,ay as T,S as s}from"./iframe-CgZaKe5d.js";import{h as c}from"./index-Co9-r5az.js";import{P as E,a as I,b as w}from"./popover-DDZSXOOd.js";import{M as q,N as L,L as b}from"./notes-container-B7_cs08c.js";import{C as P,A as t}from"./applications-config-Ci4Z5Tuj.js";import{n as p,g}from"./api-notes-DxMJgrxz.js";import{a as d}from"./story-section-Cd-IQlgl.js";import{d as m}from"./delay-DinrZnzi.js";import{B as R}from"./chunk-QUQL4437-kktIQY6E.js";import"./preload-helper-PPVm8Dsz.js";import"./index-UdOaDqtK.js";import"./rich-text-editor-XW5B4rAa.js";import"./with-selector-pinLDNQu.js";import"./toggle-CDqT2PMS.js";import"./input-wTxIY8D5.js";import"./label-C-mLdX7m.js";import"./x-C9LJTscZ.js";import"./underline-CMuPCCtW.js";import"./user-avatar-BlpHYrG_.js";import"./avatar-Nf1uBbU2.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-B6w2KuxO.js";import"./anchor-link-Bd_UBClM.js";import"./rich-text-viewer-vI9BRb1w.js";import"./date-DlVQo-n6.js";import"./format-Bz_cgPFc.js";import"./skeleton-Y9K1ks3z.js";function a({hasNotes:r,loading:_=!1,...y}){const{t:l}=v(),u=h.useCallback(f=>{document.querySelector('[role="alertdialog"]')&&f.preventDefault()},[]);return e.jsxs(E,{children:[e.jsx(x,{children:e.jsxs(N,{children:[e.jsx(C,{asChild:!0,children:e.jsx(I,{asChild:!0,children:e.jsxs(S,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:_,children:[e.jsx(q,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(j,{children:l(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(w,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:u,onInteractOutside:u,children:e.jsx(L,{...y,enableSkeletonLoading:!1,withHeader:!0})})]})}a.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},withHeader:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const O={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ce={title:"Features/Notes/Notes Popover",component:a,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(R,{children:e.jsx(P,{config:O,children:e.jsx(b,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[c.get(p,async()=>(await m(500),g()))]}},render:r=>e.jsx(d,{title:"Default",children:e.jsx(a,{...r})})},n={parameters:{msw:{handlers:[c.get(p,async()=>(await m(1e4),g()))]}},args:{seqId:2},render:r=>e.jsx(d,{title:"Loading",children:e.jsx(a,{...r})})},i={parameters:{msw:{handlers:[c.get(p,async()=>(await m(1e3),T.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(d,{title:"Empty",children:e.jsx(a,{...r})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const pe=["Default","Loading","Empty"];export{o as Default,i as Empty,n as Loading,pe as __namedExportsOrder,ce as default};
