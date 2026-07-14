import{j as e,ad as g}from"./iframe-C3tcij1x.js";import{h as m}from"./index-DNuHDUQw.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-D62RCvSp.js";import{C as l,A as t}from"./applications-config-CZU46Nat.js";import{L as u}from"./notes-container-CDFexhxh.js";import{n as p,g as _}from"./api-notes-B9Zc5vev.js";import{a as c}from"./story-section-B3q-8Mn1.js";import{d}from"./delay-DSrMqRUY.js";import{B as S}from"./chunk-QUQL4437-arySQgr0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBVMqmR5.js";import"./i18n-D8kK_uUj.js";import"./index-Bdx6gjHI.js";import"./sheet-BZecdlC_.js";import"./index-DWmttFli.js";import"./x-CvlhwQHx.js";import"./use-tenant-D5zezOTX.js";import"./api-BjHhlcVm.js";import"./button-BKk6krlU.js";import"./action-button-BAh27q8n.js";import"./dropdown-menu-Dn-15FK6.js";import"./index-BAzJp_H4.js";import"./index-Bcsurlbo.js";import"./check-DQGIiX85.js";import"./circle-0K0XQElZ.js";import"./separator-C91uL2Ph.js";import"./spinner-BF5hDSOy.js";import"./rich-text-editor-CRuL0CiX.js";import"./with-selector-83GIaqnB.js";import"./toggle-R3GjbsYc.js";import"./popover-BKSntI8l.js";import"./input-yNi82T1P.js";import"./label-C5Yersku.js";import"./underline-D5tDO7lZ.js";import"./user-avatar-BCO3Ko9U.js";import"./avatar-CGsSh_dQ.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CeL7NtId.js";import"./anchor-link-So9k07Lh.js";import"./rich-text-viewer-R6us4Ypb.js";import"./date-BdhW2w85.js";import"./format-BIPsjV9q.js";import"./skeleton-Ci4Bhp0c.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
