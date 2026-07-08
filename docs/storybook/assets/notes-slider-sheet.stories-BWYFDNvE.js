import{j as e,ab as g}from"./iframe-AvqL8SKE.js";import{h as m}from"./index-CX0dfJkw.js";import{S as o}from"./api-5e3Wi7_0.js";import{N as i}from"./notes-slider-sheet-Dxo1ZBho.js";import{C as l,A as t}from"./applications-config-DZiFBhTt.js";import{L as u}from"./notes-container-DggfS6DP.js";import{n as p,g as _}from"./api-notes-C3TVeO9o.js";import{a as c}from"./story-section-SMd-_iOc.js";import{d}from"./delay-rgAsQtI3.js";import{B as S}from"./chunk-QUQL4437-ChXxCCdB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CO_E9RYG.js";import"./i18n-DBGkWSYQ.js";import"./index-R0HakiSX.js";import"./sheet-Cq_8grF8.js";import"./index-DQ3assxv.js";import"./x-BW3PQCY8.js";import"./use-tenant-CRygO0Wf.js";import"./api-CRUcq8iX.js";import"./button-ovvqhFmn.js";import"./action-button-ChVSKd_a.js";import"./dropdown-menu-D00C_V5S.js";import"./index-Bu3D54Rz.js";import"./index-pBdHyUKt.js";import"./check-YjMj3Oh7.js";import"./circle-BTQqcZGT.js";import"./separator-DDqetdKm.js";import"./spinner-CCcnX104.js";import"./rich-text-editor-tPMM9K83.js";import"./with-selector-61jiTFCR.js";import"./toggle-pVmvKFni.js";import"./popover-BcfLvNB9.js";import"./input-Ci1IIHfp.js";import"./label-CCwuG9YO.js";import"./underline-BXyao7Aw.js";import"./user-avatar-D4uYehOS.js";import"./avatar--CeGiXmr.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-hII71HOx.js";import"./anchor-link-BHVcYoAH.js";import"./rich-text-viewer-oKRsNUj_.js";import"./date-B5QV9KCX.js";import"./format-Bbx5h7lK.js";import"./skeleton-BYVsD9zf.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
