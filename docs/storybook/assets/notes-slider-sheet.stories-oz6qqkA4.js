import{j as e,a8 as g}from"./iframe-BlZH41kV.js";import{h as m}from"./index-Cp_2wG8W.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-BzU4J5ZS.js";import{C as l,A as t}from"./applications-config-DaJ9d0xW.js";import{L as u}from"./notes-container-BOUN6QjP.js";import{n as p,g as _}from"./api-notes-DAITXp5Y.js";import{a as c}from"./story-section-B_UFTDX5.js";import{d}from"./delay-B-jxD-Cb.js";import{B as S}from"./chunk-QUQL4437-D32aNXP8.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BqlfMO08.js";import"./index-C23weHmj.js";import"./sheet-CKFhh-hV.js";import"./index-BLijLHbd.js";import"./x-BL4BZFhT.js";import"./i18n-CwekqNtM.js";import"./button-CqF4mGFC.js";import"./index-DwsKsEj-.js";import"./action-button-Cf_N4wCi.js";import"./dropdown-menu-DY3d4vy_.js";import"./index-Dbpq7NXz.js";import"./index-D1tyQsCC.js";import"./check-D4JmoqeB.js";import"./circle-C5iPYBJL.js";import"./separator-D9vn1ACq.js";import"./spinner-T7s0GJQu.js";import"./rich-text-editor-DtrN0C3O.js";import"./toggle-Dp_JeMox.js";import"./popover-B4_Qcqg0.js";import"./input-BJvy2A5M.js";import"./label-DhLG2huY.js";import"./underline-Csb1qFUb.js";import"./user-avatar-BE1l4R3U.js";import"./avatar-CmGfU_pC.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DLzZPb0M.js";import"./rich-text-viewer-Br7mkn5k.js";import"./date-UBK9Tbg7.js";import"./format-DhBMdyay.js";import"./skeleton-CkIhl-Ul.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
