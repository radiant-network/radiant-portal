import{j as e,ag as g}from"./iframe-C3lqtK7e.js";import{h as m}from"./index-BmxUvt3T.js";import{S as o}from"./api-BIv-E9PX.js";import{N as i}from"./notes-slider-sheet-C9BLFO2V.js";import{C as l,A as t}from"./applications-config-C-nASJ9y.js";import{L as u}from"./notes-container-fz-usTO1.js";import{n as p,g as _}from"./api-notes-Bt9irEf8.js";import{a as c}from"./story-section-D0dJtQQI.js";import{d}from"./delay-xR_CvgEY.js";import{B as S}from"./chunk-QUQL4437-B_Zgs8qF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CVQi8D0f.js";import"./i18n-C-yF7uB7.js";import"./index-IdUrPHK1.js";import"./sheet-D4dG5E_2.js";import"./index-DrJKvLIs.js";import"./x-561tnh8w.js";import"./use-tenant-CnX9eyC8.js";import"./api-BgVePoRM.js";import"./403-DrklEced.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-6QTMFxzQ.js";import"./main-navbar-lang-switcher-DwxyejR1.js";import"./button-C8Vp7O6w.js";import"./action-button-CE80NZKJ.js";import"./dropdown-menu-Bpvq-6ng.js";import"./index-CH0eao47.js";import"./index-CAl0gmco.js";import"./check-BRJQ9cv8.js";import"./circle-CfQ2AHwq.js";import"./separator-BKwaqk6V.js";import"./spinner-BjSATF-R.js";import"./rich-text-editor-CUxDT4hq.js";import"./with-selector-9ogyiiHm.js";import"./toggle-CSL9JS6X.js";import"./popover-DbCrnPTB.js";import"./input-CCenKBLE.js";import"./label-CZdJaqCy.js";import"./underline-DeKbA_X3.js";import"./user-avatar-Caix7HUv.js";import"./avatar-Bu0l0R3l.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DfCvtKv1.js";import"./anchor-link-C3eeWezY.js";import"./rich-text-viewer-Du56CQXJ.js";import"./date-D4YBNkV1.js";import"./format-BXGjKb1s.js";import"./skeleton-CBSxM5zK.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
