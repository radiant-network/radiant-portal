import{j as e,ay as g,S as n}from"./iframe-CaCkF73x.js";import{h as c}from"./index-BjnU0SdH.js";import{N as i}from"./notes-slider-sheet-1jgBR2Nr.js";import{C as l,A as t}from"./applications-config-CO4Kr_GC.js";import{L as u}from"./notes-container-D6zCPv_1.js";import{n as p,g as _}from"./api-notes-CO_wcC4V.js";import{a as m}from"./story-section-BzjNo_xI.js";import{d}from"./delay-DHGA8dJG.js";import{B as S}from"./chunk-BV7QT456-CnLZDjif.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CY5PYx5o.js";import"./sheet-Cgbm20-A.js";import"./index-CX1GHf_h.js";import"./x-M9Dp6o6f.js";import"./spinner-hLM1fVGq.js";import"./rich-text-editor-VhD60Rtj.js";import"./with-selector-BIcfjmYR.js";import"./toggle-Bee5q-3T.js";import"./popover-C9836Iqo.js";import"./input-BlGgpyCQ.js";import"./label-DBt1t2N1.js";import"./trash-Ckn1HOll.js";import"./underline-B66IwYNr.js";import"./user-avatar-fXqHBttG.js";import"./avatar-CmWNrEEf.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Dy0M9kfu.js";import"./anchor-link-BusgW-e4.js";import"./rich-text-viewer-BKjspsjM.js";import"./date-DAi4XAz0.js";import"./format-D9g8TslO.js";import"./skeleton-il9ODNWx.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},X={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(i,{...r})})},o={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
