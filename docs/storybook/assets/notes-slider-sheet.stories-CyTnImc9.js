import{j as e,ag as g}from"./iframe-CeWulF4T.js";import{h as m}from"./index-zWKvIigW.js";import{S as o}from"./api-ChpJqhV9.js";import{N as i}from"./notes-slider-sheet-yxc5oSyT.js";import{C as l,A as t}from"./applications-config-BE8xLZLI.js";import{L as u}from"./notes-container-BDxh5mLO.js";import{n as p,g as _}from"./api-notes-CE2EGVnU.js";import{a as c}from"./story-section-H6_Fle6z.js";import{d}from"./delay-C1CvmhTj.js";import{B as S}from"./chunk-QUQL4437-BDdlCdpn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CXQKkJn0.js";import"./i18n-Cey8cEyU.js";import"./index-Dqf5nBEg.js";import"./sheet-Cy-pQU36.js";import"./index-C0gnKytj.js";import"./x-D_1RLYu7.js";import"./use-tenant-3LE2_ShP.js";import"./api-GWblJYZ_.js";import"./403-DSGzOC_g.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CgTKKqMj.js";import"./main-navbar-lang-switcher-CHdPPl3m.js";import"./button-C683gQgD.js";import"./action-button-fSpfUlMg.js";import"./dropdown-menu-KIY2RxO3.js";import"./index-Derf9KHZ.js";import"./index-R0RQN4yR.js";import"./check-HHIYmnL4.js";import"./circle-DXv1Vmv4.js";import"./separator-CfpQj-nU.js";import"./spinner-DOa2G9ez.js";import"./rich-text-editor-DT2MtOYH.js";import"./with-selector-BIbeB_JH.js";import"./toggle-Oac5NA5N.js";import"./popover-Bk7RKWY1.js";import"./input-DRoC1zNI.js";import"./label-D1HwKpbR.js";import"./underline-DwoMPVbc.js";import"./user-avatar-DkAXlnwq.js";import"./avatar-CUXlJbjq.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DaKE0M3q.js";import"./anchor-link-sEB1tO_A.js";import"./rich-text-viewer-xVqXOTjp.js";import"./date-CjanyfMy.js";import"./format-BdYBncCQ.js";import"./skeleton-CROhWoqt.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const ge=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,ge as __namedExportsOrder,_e as default};
