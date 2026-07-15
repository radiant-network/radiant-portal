import{j as e,ad as g}from"./iframe-BJ0KBJU7.js";import{h as m}from"./index-Cdyp0lg5.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-v6BQ1tgH.js";import{C as l,A as t}from"./applications-config-jLjJTtO3.js";import{L as u}from"./notes-container-Drew_U_t.js";import{n as p,g as _}from"./api-notes-5bQj51tu.js";import{a as c}from"./story-section-BU2eJCi3.js";import{d}from"./delay-CQ7YfHBJ.js";import{B as S}from"./chunk-QUQL4437-BuLqhNDi.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_ELw9K6.js";import"./i18n-DmjSHWrQ.js";import"./index-B78TygC3.js";import"./sheet-CUr3O2Fy.js";import"./index-5XgH6jTT.js";import"./x-D8ravScC.js";import"./use-tenant-CzIHPu-A.js";import"./api-BjHhlcVm.js";import"./button-DFGR7V5l.js";import"./action-button-C928MkJM.js";import"./dropdown-menu-D5WDI4zP.js";import"./index-DfueDfU3.js";import"./index-DjBvZjcf.js";import"./check-Dg29415_.js";import"./circle-B1ny9b-U.js";import"./separator-CKp5KkZQ.js";import"./spinner-CZ3PSfvE.js";import"./rich-text-editor-DVvf_xUF.js";import"./with-selector-CCXCSjaV.js";import"./toggle-BaULUfAn.js";import"./popover-Bt4cgKoE.js";import"./input-B9PMAus_.js";import"./label-DRF3oeBn.js";import"./underline-D4qICuGx.js";import"./user-avatar-CLdnolgs.js";import"./avatar-BqKu3iqi.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DUbWZf-C.js";import"./anchor-link-GcOmQYMo.js";import"./rich-text-viewer-CiESNJ7i.js";import"./date-bljI_VOj.js";import"./format-gJRyvbcD.js";import"./skeleton-B1dmiM7_.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const pe=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,pe as __namedExportsOrder,me as default};
