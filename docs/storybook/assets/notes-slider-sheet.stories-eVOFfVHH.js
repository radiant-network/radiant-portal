import{j as e,ad as g}from"./iframe-C5ghdKPC.js";import{h as m}from"./index-Sy_ni6Cx.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-DNToNmZL.js";import{C as l,A as t}from"./applications-config-DFulkYeq.js";import{L as u}from"./notes-container-DfSBOVTH.js";import{n as p,g as _}from"./api-notes-Vxr9hzGw.js";import{a as c}from"./story-section-CLlhZcHq.js";import{d}from"./delay-nr-rWshI.js";import{B as S}from"./chunk-QUQL4437-C3I5PKxO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-V3egl2xV.js";import"./i18n-BPASaW18.js";import"./index-BhpGQa6j.js";import"./sheet-BfHgk51q.js";import"./index-CrptZkfT.js";import"./x-DLnpHguX.js";import"./use-tenant-CO_xBvZf.js";import"./api-BjHhlcVm.js";import"./button-Bv6IhCvK.js";import"./action-button-DJGIFk-q.js";import"./dropdown-menu-DoOCM-LE.js";import"./index-B--nswC9.js";import"./index-ARASfFZ8.js";import"./check-CWaWZXj3.js";import"./circle-IiyuoDyT.js";import"./separator-Pm6qs9Vj.js";import"./spinner-wC0xyq0g.js";import"./rich-text-editor-DsIGpRSn.js";import"./with-selector-JcvuweIp.js";import"./toggle-DUD10rGP.js";import"./popover-kheK7n3c.js";import"./input-CEOktzmf.js";import"./label-Babr-5Nq.js";import"./underline-aGGmGeIa.js";import"./user-avatar-BhRZWDFl.js";import"./avatar-DXdcEYNi.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-C6Lgvvgt.js";import"./anchor-link-BTq9AcqX.js";import"./rich-text-viewer-QVtN9z-7.js";import"./date-CVg6bLJ-.js";import"./format-BTKiQJtV.js";import"./skeleton-B-iZZ6gN.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
