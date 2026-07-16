import{j as e,ad as g}from"./iframe-CZw1qZGW.js";import{h as m}from"./index-B1DCnIQ_.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-MblOIpbF.js";import{C as l,A as t}from"./applications-config-efffUDMI.js";import{L as u}from"./notes-container-DrEUH2JB.js";import{n as p,g as _}from"./api-notes-Cubs7ycK.js";import{a as c}from"./story-section-YSzHW9zx.js";import{d}from"./delay-uEiidd0m.js";import{B as S}from"./chunk-QUQL4437-6K-0RhBk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CH0McT4R.js";import"./i18n-D6woSMGU.js";import"./index-MRM-u4eM.js";import"./sheet-bNIbkoBG.js";import"./index-BS5cBNq9.js";import"./x-B7FhkScA.js";import"./use-tenant-CqPEL-IC.js";import"./api-BjHhlcVm.js";import"./button-CGR4UfFv.js";import"./action-button-kKLU-hab.js";import"./dropdown-menu-Dzzvo9yA.js";import"./index-BLv7cGbS.js";import"./index-22t25koy.js";import"./check-CFQ8FQQb.js";import"./circle-DcsoVGej.js";import"./separator-imWwe0EG.js";import"./spinner-CR70hxNp.js";import"./rich-text-editor-_LvqClgb.js";import"./with-selector-DHBpch2o.js";import"./toggle-Dp5OByQ9.js";import"./popover-DcYTjvAO.js";import"./input-vlMtCela.js";import"./label-__kq4pkx.js";import"./underline-C19ofPwM.js";import"./user-avatar-C5lTc0HT.js";import"./avatar-D2x9SLkF.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BAbMwBo-.js";import"./anchor-link-uHYNo-_N.js";import"./rich-text-viewer-DvykILIt.js";import"./date-Y2pmLwcG.js";import"./format-KgAKvqnD.js";import"./skeleton-CvbM1CrZ.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
