import{j as e,a8 as g}from"./iframe-CKiE6Nsl.js";import{h as m}from"./index-DysA4fPc.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-B-n9HYpl.js";import{C as l,A as t}from"./applications-config-Bv1-2iPl.js";import{L as u}from"./notes-container-D9NPgS3r.js";import{n as p,g as _}from"./api-notes-BjyRMq6R.js";import{a as c}from"./story-section-CH_OnjTD.js";import{d}from"./delay-Dt5S2ElY.js";import{B as S}from"./chunk-QUQL4437-D4CS2_l7.js";import"./preload-helper-PPVm8Dsz.js";import"./api-8ZXOsH5S.js";import"./index-CAH79BqJ.js";import"./sheet-KCaMo0Rq.js";import"./index-CKcm3iJX.js";import"./x-j4ecrtl6.js";import"./i18n-ZTG9nugd.js";import"./button-Cy6cW3zr.js";import"./index-9FrZzKeW.js";import"./action-button-skYf-9FP.js";import"./dropdown-menu-DVEsqO9M.js";import"./index-CpQDBSVi.js";import"./index-CZWpuSYx.js";import"./check-CQNASh0O.js";import"./circle-B0UttFdb.js";import"./separator-D0Yo1ak_.js";import"./spinner-B_QBWadz.js";import"./rich-text-editor-D4BNf8e-.js";import"./toggle-e0DWQKjQ.js";import"./popover-B5qWksmY.js";import"./input-CsDYrOFL.js";import"./label-DNWBVb5X.js";import"./underline-C2MbaOT4.js";import"./user-avatar-fnV-Exg0.js";import"./avatar-BxlXBEen.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BnSN3Qls.js";import"./rich-text-viewer-xmMGD392.js";import"./date-XdW8TK1B.js";import"./format-B2E2bzsQ.js";import"./skeleton-CfrEoLZT.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
