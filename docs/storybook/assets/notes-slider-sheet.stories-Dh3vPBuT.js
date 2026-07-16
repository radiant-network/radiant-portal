import{j as e,ad as g}from"./iframe-D78160ma.js";import{h as m}from"./index-yNrGp-cp.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-Bluxwp2e.js";import{C as l,A as t}from"./applications-config-BZa-gdOF.js";import{L as u}from"./notes-container-lKsAtVlH.js";import{n as p,g as _}from"./api-notes-P0dqMKEj.js";import{a as c}from"./story-section-CJRHUJpZ.js";import{d}from"./delay-Bzaj2Uwa.js";import{B as S}from"./chunk-QUQL4437-7e4i9lPk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-8VL-PFaF.js";import"./i18n-BrjiU_bT.js";import"./index-BSsmB6Hv.js";import"./sheet-Dshvqm31.js";import"./index-x_9nQNJG.js";import"./x-cypWjlnE.js";import"./use-tenant-BXFQcKPS.js";import"./api-BjHhlcVm.js";import"./button-D31B_Gsf.js";import"./action-button-CXmwuvNv.js";import"./dropdown-menu-CFr9nLu7.js";import"./index-E6EEG8_q.js";import"./index-BJO3_Py_.js";import"./check-Dz-4uiGV.js";import"./circle-DO4DQqF4.js";import"./separator-C2Q6CsId.js";import"./spinner-Wfl2fRD0.js";import"./rich-text-editor-WM3IjNlh.js";import"./with-selector-N-Sib90P.js";import"./toggle-BznZcbkL.js";import"./popover-BrOVyTY-.js";import"./input-CR_iVGUi.js";import"./label-Li_1t0cO.js";import"./underline-Ce3fxbkz.js";import"./user-avatar-BTNIti3E.js";import"./avatar-5x2a4Wa1.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DlSZlD7-.js";import"./anchor-link-B1xlnlRW.js";import"./rich-text-viewer-CbDqqRVc.js";import"./date-DkTP6IBD.js";import"./format-CTj-HZwT.js";import"./skeleton-jhTyhUD-.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
