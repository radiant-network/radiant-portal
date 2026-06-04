import{j as e,a8 as g}from"./iframe-C_PWKKnV.js";import{h as m}from"./index-BQR_gsab.js";import{S as o}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-C6sfd1JI.js";import{C as l,A as t}from"./applications-config-CFmbQdDr.js";import{L as u}from"./notes-container-BXi9btv2.js";import{n as p,g as _}from"./api-notes-DXWnl9fp.js";import{a as c}from"./story-section-CfmadKEP.js";import{d}from"./delay-Bi2Ph0iA.js";import{B as S}from"./chunk-QUQL4437-Br79iyOx.js";import"./preload-helper-PPVm8Dsz.js";import"./api-8h-D-eJL.js";import"./index-pWOEJb2O.js";import"./sheet-CzQVdsC9.js";import"./index-Bgd6UV2h.js";import"./x-BsW-yT5v.js";import"./i18n-4DRFLHh0.js";import"./button-4T5xrZWi.js";import"./index-uHTs5ds7.js";import"./action-button-BwT2quuH.js";import"./dropdown-menu-CrzQycMh.js";import"./index-DYLnjilj.js";import"./index-DRcjtbHr.js";import"./check-clqCtUO9.js";import"./circle-D7Nufxf-.js";import"./separator-C7JFg-YV.js";import"./spinner-B0Xf2SKx.js";import"./rich-text-editor-BuY2GnYW.js";import"./toggle-qju1Ge_3.js";import"./popover-BdDUETSa.js";import"./input-DyF3jaRR.js";import"./label-D0gQMbwZ.js";import"./underline-BNa4sChF.js";import"./user-avatar-Cyha7HF1.js";import"./avatar-CxuWgGEf.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Bai8tMyi.js";import"./rich-text-viewer-B9YBm1pQ.js";import"./date-BqfWntvM.js";import"./format-DxyX1KkO.js";import"./skeleton-UNB62nCV.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
