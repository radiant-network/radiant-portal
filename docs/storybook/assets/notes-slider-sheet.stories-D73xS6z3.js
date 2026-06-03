import{j as e,a8 as g}from"./iframe-ELwkN4WH.js";import{h as m}from"./index-C_1ReyYL.js";import{S as o}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-B6BZGYZ7.js";import{C as l,A as t}from"./applications-config-DpY0c-HV.js";import{L as u}from"./notes-container-Bovd5VuM.js";import{n as p,g as _}from"./api-notes-cg2NQAkN.js";import{a as c}from"./story-section-BW9mZuMq.js";import{d}from"./delay-BWq7GKU2.js";import{B as S}from"./chunk-QUQL4437-Bw3QsHpJ.js";import"./preload-helper-PPVm8Dsz.js";import"./api-1Xb3GPSC.js";import"./index-BIP8QzMY.js";import"./sheet-zzkrkD5K.js";import"./index-CJWjGNSh.js";import"./x-DqX6VLl3.js";import"./i18n-DRl3AD0J.js";import"./button-DVxJRXa8.js";import"./index-Ct7crFnJ.js";import"./action-button-B8RD553Y.js";import"./dropdown-menu-B5W2V41I.js";import"./index-DrATjyRU.js";import"./index-Ts0_7Z4Q.js";import"./check-BwKrSwsD.js";import"./circle-BM1LvZdU.js";import"./separator-DOzexuXx.js";import"./spinner-B8UQJ9w9.js";import"./rich-text-editor-NNXLNuKd.js";import"./toggle-DXlKYeWZ.js";import"./popover-BKZ5uJ45.js";import"./input-B7kvEuIQ.js";import"./label-DyZuULkd.js";import"./underline-BbMEdcqg.js";import"./user-avatar-DQ9VG6gF.js";import"./avatar-r4cPMU1r.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-agvuHtEg.js";import"./rich-text-viewer-DW_8HnEP.js";import"./date-BMm8DmGa.js";import"./format-BGyaI-Dh.js";import"./skeleton-BIHzEaix.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
