import{j as e,a8 as g}from"./iframe-Bmo5s0S7.js";import{h as m}from"./index-tSv9C1wR.js";import{S as o}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-DpuP3vMl.js";import{C as l,A as t}from"./applications-config-C3v4Kx5f.js";import{L as u}from"./notes-container-D-yaNhnO.js";import{n as p,g as _}from"./api-notes-Ca8FoUPx.js";import{a as c}from"./story-section-DK9Ca-WM.js";import{d}from"./delay-BNtC60k3.js";import{B as S}from"./chunk-QUQL4437-4eTQW-oi.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DZSw6L4j.js";import"./index-Ral5BcRB.js";import"./sheet-BNDsYGko.js";import"./index-DSjvIBWg.js";import"./x-CGJbRyc9.js";import"./i18n-Dk7NL_SC.js";import"./button---ZJYA-K.js";import"./index-fUmLsCzv.js";import"./action-button-BsC9knCl.js";import"./dropdown-menu-RHvipy6t.js";import"./index-CYQD8SjJ.js";import"./index-D_ub_t65.js";import"./check-32E8HpGv.js";import"./circle-C1aHhR8R.js";import"./separator-CQaINmcN.js";import"./spinner-MMZ-rVDX.js";import"./rich-text-editor-DfG2-ppb.js";import"./toggle-DHJlA2Mv.js";import"./popover-sD03Vi3k.js";import"./input-DKMllPhg.js";import"./label-C6nsYxZ0.js";import"./underline-k2KmXVvk.js";import"./user-avatar-CkMcMcGJ.js";import"./avatar-9wFmJ6Az.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-0QcWbEFs.js";import"./rich-text-viewer-Du3ZHm-o.js";import"./date-BJHiHvdq.js";import"./format-_ZpUrBR-.js";import"./skeleton-BcBjI8oP.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const se=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,se as __namedExportsOrder,ae as default};
