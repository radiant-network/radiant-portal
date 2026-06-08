import{j as e,a8 as g}from"./iframe-Dt4dd9_L.js";import{h as m}from"./index-DSw4xTCz.js";import{S as o}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-DXOedWF0.js";import{C as l,A as t}from"./applications-config-BQIHy1i7.js";import{L as u}from"./notes-container-B4ouFjb5.js";import{n as p,g as _}from"./api-notes-DHfKGGlk.js";import{a as c}from"./story-section-Ba8l4DMz.js";import{d}from"./delay-BBK_r3Z_.js";import{B as S}from"./chunk-QUQL4437-BTVBKelx.js";import"./preload-helper-PPVm8Dsz.js";import"./api-C7m0mtH6.js";import"./index-t9s_g_zt.js";import"./sheet-C7REd8NV.js";import"./index-CYVFGJ3R.js";import"./x-CPSnwLTF.js";import"./i18n-Buhp04UG.js";import"./button-BHpOt1n5.js";import"./index--YEVJleu.js";import"./action-button-CUVXthKf.js";import"./dropdown-menu-Db1zsnSb.js";import"./index-B3Y_IRPe.js";import"./index-DydgcOJb.js";import"./check-BkrZypcC.js";import"./circle-CQ2dwaF5.js";import"./separator-CHrX4g91.js";import"./spinner-BeoLIkqV.js";import"./rich-text-editor-CG0fIc4-.js";import"./toggle-BdeDLJU1.js";import"./popover-DCNuZ3RF.js";import"./input-CK8eo80s.js";import"./label-DK9k00Nb.js";import"./underline-DHG6qIP2.js";import"./user-avatar-BLXmnD0D.js";import"./avatar-DP2zl4_L.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Cow8AfsI.js";import"./rich-text-viewer-CdTucUkk.js";import"./date-BifFTD-P.js";import"./format-BE7tt4ZM.js";import"./skeleton-DumOnALl.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
