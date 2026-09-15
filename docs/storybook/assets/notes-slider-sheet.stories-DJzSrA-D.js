import{j as e,ay as g,S as n}from"./iframe-iq8cIiFW.js";import{h as c}from"./index-C-crkF--.js";import{N as i}from"./notes-slider-sheet-CUT-xJ8l.js";import{C as l,A as t}from"./applications-config-ic1eUZQg.js";import{L as u}from"./notes-container-BewPUyy-.js";import{n as p,g as _}from"./api-notes-DFX33cD4.js";import{a as m}from"./story-section-B8E7zijV.js";import{d}from"./delay-G21TFocC.js";import{B as S}from"./chunk-BV7QT456-DVWa4Q_8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CU5Gs7U5.js";import"./sheet-DIfyLXWq.js";import"./index-DtHAEm5X.js";import"./x--JQCAyyF.js";import"./spinner-tnIGuzI3.js";import"./rich-text-editor-Clg3_5Wb.js";import"./with-selector-C0JoEFUh.js";import"./toggle-D2J3GUiQ.js";import"./popover-CJCPa7zp.js";import"./input-BJUTYsRT.js";import"./label-eV0NUaQV.js";import"./trash-BGWS2_mv.js";import"./underline-CM8YQjmT.js";import"./user-avatar-YUWxxDs0.js";import"./avatar-zVfamaG2.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-D9yxHMZn.js";import"./anchor-link-DpVBqbm_.js";import"./rich-text-viewer-BXJ9nahT.js";import"./date-kLqC-lf2.js";import"./format-DqTDWZyn.js";import"./skeleton-BgxuYm9_.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},X={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(i,{...r})})},o={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Y=["Default","Loading","Empty"];export{a as Default,s as Empty,o as Loading,Y as __namedExportsOrder,X as default};
