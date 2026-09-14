import{j as e,ay as g,S as n}from"./iframe-DY5-UQdi.js";import{h as c}from"./index-CLsCKOiP.js";import{N as i}from"./notes-slider-sheet-BuXIV3qJ.js";import{C as l,A as t}from"./applications-config-JXvOJz-U.js";import{L as u}from"./notes-container-BJdENSie.js";import{n as p,g as _}from"./api-notes-BZoJSfdu.js";import{a as m}from"./story-section-BfGxLv6g.js";import{d}from"./delay-CckyptJX.js";import{B as S}from"./chunk-BV7QT456-BXYyrak3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DaT1HPA4.js";import"./sheet-m4XXWoGM.js";import"./index--NuN4mfZ.js";import"./x-CLuQ0dgg.js";import"./spinner-B_JbhKyH.js";import"./rich-text-editor-Cdw-aJFs.js";import"./with-selector-CJQ2HbEk.js";import"./toggle-CW3PSImR.js";import"./popover-B2llYNmG.js";import"./input-DtvqY5Jj.js";import"./label-CvVqBD9q.js";import"./trash-F8MC998X.js";import"./underline-B5oJnXKe.js";import"./user-avatar-ix4koLGU.js";import"./avatar-DQwZdOL_.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-6RmrH9Mr.js";import"./anchor-link-wD32XCkd.js";import"./rich-text-viewer-n8V3XdLd.js";import"./date-DyzZxSlA.js";import"./format-CPtKXGnk.js";import"./skeleton-Prw77uM6.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},X={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(i,{...r})})},o={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
