import{j as e,ay as g,S as n}from"./iframe-CEIjD8md.js";import{h as c}from"./index-wCXzeHxf.js";import{N as i}from"./notes-slider-sheet-AbDisBU0.js";import{C as l,A as t}from"./applications-config-CNrpF8an.js";import{L as u}from"./notes-container-Wqet9nsK.js";import{n as p,g as _}from"./api-notes-CrymbHOi.js";import{a as m}from"./story-section-akNb6BHm.js";import{d}from"./delay-CTB4kDbc.js";import{B as S}from"./chunk-QUQL4437-CMT0E8nl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CznPFmdJ.js";import"./sheet-nc5NI_Hd.js";import"./index-DrHHB82D.js";import"./x-BF0Xdm60.js";import"./spinner-CPSZ386e.js";import"./rich-text-editor-rgTd8M_l.js";import"./with-selector-BqvfG7bj.js";import"./toggle-gho7eM0S.js";import"./popover-B4minZ3i.js";import"./input-D5oIp6d4.js";import"./label-B7YzvmnB.js";import"./underline-i7fVGtby.js";import"./user-avatar-D9WOBja2.js";import"./avatar-CZBu9N-3.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BqfHxqWo.js";import"./anchor-link-DtpP6Lj5.js";import"./rich-text-viewer-BqK03qs5.js";import"./date-TiyhVf8b.js";import"./format-BBUjve0x.js";import"./skeleton-txNlXTbo.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},W={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(i,{...r})})},o={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const X=["Default","Loading","Empty"];export{a as Default,s as Empty,o as Loading,X as __namedExportsOrder,W as default};
