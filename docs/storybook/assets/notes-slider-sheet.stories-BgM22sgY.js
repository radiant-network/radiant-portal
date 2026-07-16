import{j as e,ad as g}from"./iframe-CjjKcyRz.js";import{h as m}from"./index-Dvkqzho8.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-Behrm_kb.js";import{C as l,A as t}from"./applications-config-BeY8ydCl.js";import{L as u}from"./notes-container-CZ9jVx0B.js";import{n as p,g as _}from"./api-notes-0UYe93EZ.js";import{a as c}from"./story-section-CsOmwK7S.js";import{d}from"./delay-0XoLjyo1.js";import{B as S}from"./chunk-QUQL4437-CTy4a7fL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-qeNfCT1D.js";import"./i18n-BuVXszO5.js";import"./index-BqIV9asx.js";import"./sheet-D5U3fytm.js";import"./index-CzpwE_WM.js";import"./x-CtWOxN3V.js";import"./use-tenant-D9bGYSBx.js";import"./api-BjHhlcVm.js";import"./button-Dvk1HNzZ.js";import"./action-button-BwDlSnhC.js";import"./dropdown-menu-844EsJQI.js";import"./index-ClBgjtxQ.js";import"./index-xQrGmB3K.js";import"./check-C4P_JRtZ.js";import"./circle-BpRQY5cb.js";import"./separator-2VSHccwH.js";import"./spinner-CDpB6H94.js";import"./rich-text-editor-Cis6Uv_N.js";import"./with-selector-CnODjNik.js";import"./toggle-4IDQMJXA.js";import"./popover-1f47Y7VJ.js";import"./input-DeNM6IDL.js";import"./label-CfT3_fei.js";import"./underline-BkAnfIkC.js";import"./user-avatar-BG1hp76k.js";import"./avatar-CaLnGWoi.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DZO-ZvM6.js";import"./anchor-link-GTN-Xmjt.js";import"./rich-text-viewer-CiWi1T2l.js";import"./date-BGUCKvzK.js";import"./format-D-4s_YGd.js";import"./skeleton-CsI0WSbR.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
