import{u as T,r as E,j as e,T as _,v as f,w as y,B as h,x as v,ay as I,S as s}from"./iframe-iq8cIiFW.js";import{h as p}from"./index-C-crkF--.js";import{P as b,a as q,b as w}from"./popover-CJCPa7zp.js";import{M as x,N as L,L as P}from"./notes-container-BewPUyy-.js";import{C as R,A as t}from"./applications-config-ic1eUZQg.js";import{n as d,g as j}from"./api-notes-DFX33cD4.js";import{a as l}from"./story-section-B8E7zijV.js";import{d as m}from"./delay-G21TFocC.js";import{B as O}from"./chunk-BV7QT456-DVWa4Q_8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CU5Gs7U5.js";import"./rich-text-editor-Clg3_5Wb.js";import"./with-selector-C0JoEFUh.js";import"./toggle-D2J3GUiQ.js";import"./input-BJUTYsRT.js";import"./label-eV0NUaQV.js";import"./x--JQCAyyF.js";import"./trash-BGWS2_mv.js";import"./underline-CM8YQjmT.js";import"./user-avatar-YUWxxDs0.js";import"./avatar-zVfamaG2.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-D9yxHMZn.js";import"./anchor-link-DpVBqbm_.js";import"./rich-text-viewer-BXJ9nahT.js";import"./date-kLqC-lf2.js";import"./format-DqTDWZyn.js";import"./skeleton-BgxuYm9_.js";function a({hasNotes:r,loading:N=!1,canComment:u=!0,...C}){const{t:c}=T(),g=E.useCallback(S=>{document.querySelector('[role="alertdialog"]')&&S.preventDefault()},[]);return!u&&!r?e.jsx(_,{children:e.jsxs(f,{children:[e.jsx(y,{asChild:!0,children:e.jsx(h,{className:"relative size-6 cursor-default hover:bg-transparent",iconOnly:!0,variant:"ghost","aria-disabled":!0,children:e.jsx(x,{className:"text-muted-foreground/40",size:16})})}),e.jsx(v,{children:c("notes.variant.tooltip.none")})]})}):e.jsxs(b,{children:[e.jsx(_,{children:e.jsxs(f,{children:[e.jsx(y,{asChild:!0,children:e.jsx(q,{asChild:!0,children:e.jsxs(h,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:N,children:[e.jsx(x,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(v,{children:c(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(w,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:g,onInteractOutside:g,children:e.jsx(L,{...C,canComment:u,enableSkeletonLoading:!1,withHeader:!0})})]})}a.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},withHeader:{required:!1,tsType:{name:"boolean"},description:""},canComment:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const M={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},de={title:"Features/Notes/Notes Popover",component:a,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(O,{children:e.jsx(R,{config:M,children:e.jsx(P,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[p.get(d,async()=>(await m(500),j()))]}},render:r=>e.jsx(l,{title:"Default",children:e.jsx(a,{...r})})},o={parameters:{msw:{handlers:[p.get(d,async()=>(await m(1e4),j()))]}},args:{seqId:2},render:r=>e.jsx(l,{title:"Loading",children:e.jsx(a,{...r})})},i={parameters:{msw:{handlers:[p.get(d,async()=>(await m(1e3),I.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(l,{title:"Empty",children:e.jsx(a,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const le=["Default","Loading","Empty"];export{n as Default,i as Empty,o as Loading,le as __namedExportsOrder,de as default};
