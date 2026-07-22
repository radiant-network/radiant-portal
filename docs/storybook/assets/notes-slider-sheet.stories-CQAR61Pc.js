import{j as e,ae as g}from"./iframe-ikmO-G8w.js";import{h as m}from"./index-B1zcIUZJ.js";import{S as o}from"./api-D36EIwoJ.js";import{N as i}from"./notes-slider-sheet-C06RTRD-.js";import{C as l,A as t}from"./applications-config-T5aOb8IG.js";import{L as u}from"./notes-container-DAK_tuF3.js";import{n as p,g as _}from"./api-notes-LYJTEEKo.js";import{a as c}from"./story-section-Do19LCYz.js";import{d}from"./delay-BwbZClKa.js";import{B as S}from"./chunk-QUQL4437-C1BHFs88.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Ctxs9dV7.js";import"./i18n--cYKJdvf.js";import"./index-TBEFmxjP.js";import"./sheet-Bo3rwkR9.js";import"./index-vwb8wDz1.js";import"./x-leFJ26lF.js";import"./use-tenant-IjUrKsi0.js";import"./api-BKer6Fgf.js";import"./403-C-N4niER.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-YtrE2F-n.js";import"./main-navbar-lang-switcher-CaKzGhRi.js";import"./button-f2BnibuH.js";import"./action-button-DslSGgMW.js";import"./dropdown-menu-Djo0E1ip.js";import"./index-DLIPavft.js";import"./index-LNYO5vkT.js";import"./check-DFIBGLZn.js";import"./circle-HHVicZ3t.js";import"./separator-DvGIa4AD.js";import"./spinner-95BmaB56.js";import"./rich-text-editor-7-q_TIFT.js";import"./with-selector-CoUNRHdH.js";import"./toggle-wS9kAqun.js";import"./popover-B5JBIamW.js";import"./input-CG0Dxzxz.js";import"./label-CsLLmXOT.js";import"./underline-D1cvwt5J.js";import"./user-avatar-CEYxTjEp.js";import"./avatar-BozmlW2A.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DtPT4C8n.js";import"./anchor-link-Dpd25CfW.js";import"./rich-text-viewer-2vh4lsV_.js";import"./date-BdNLhML2.js";import"./format-NE9mwnVe.js";import"./skeleton-DBzD6UYr.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <StorySection title="Default">
      <NotesSliderSheet {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(10000);
        return getHTTPMockNotesList();
      })]
    }
  },
  args: {
    seqId: 3
  },
  render: args => <StorySection title="Loading">
      <NotesSliderSheet {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })]
    }
  },
  args: {
    seqId: 4
  },
  render: args => <StorySection title="Empty">
      <NotesSliderSheet {...args} />
    </StorySection>
}`,...s.parameters?.docs?.source}}};const ge=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,ge as __namedExportsOrder,_e as default};
