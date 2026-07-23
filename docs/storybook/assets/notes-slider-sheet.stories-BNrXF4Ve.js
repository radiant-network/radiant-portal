import{j as e,ae as g}from"./iframe-DUYxWSE4.js";import{h as m}from"./index-BftQByyn.js";import{S as o}from"./api-D36EIwoJ.js";import{N as i}from"./notes-slider-sheet-B7MhsKD5.js";import{C as l,A as t}from"./applications-config-Q6r4cHCd.js";import{L as u}from"./notes-container-DPGHJV2W.js";import{n as p,g as _}from"./api-notes-DI-_pDYz.js";import{a as c}from"./story-section-BP93x530.js";import{d}from"./delay-DQXf5d6S.js";import{B as S}from"./chunk-QUQL4437-B7OJzLlm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C3HhZF5z.js";import"./i18n-DhdwcvPn.js";import"./index-0l6j4kdI.js";import"./sheet-DLYBoNay.js";import"./index-3mYks1_5.js";import"./x-CPRp0o__.js";import"./use-tenant-k8UKazYJ.js";import"./api-BKer6Fgf.js";import"./403-BeP5wQyt.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-D2BC-JFJ.js";import"./main-navbar-lang-switcher-BYUG0V5q.js";import"./button-BoxscECB.js";import"./action-button-BfqUh_3H.js";import"./dropdown-menu-Dw6dDXhx.js";import"./index-d-V1lAha.js";import"./index-CIzFjBAZ.js";import"./check-CXWDQykU.js";import"./circle-CnzHj9YT.js";import"./separator-BLzsWlgt.js";import"./spinner-BOfRo5Gy.js";import"./rich-text-editor-DVpmYY7t.js";import"./with-selector-D8mSHMqY.js";import"./toggle-BVe47DA6.js";import"./popover-D9w6bh6M.js";import"./input-B1eEa02a.js";import"./label-BLKEaCQs.js";import"./underline-vANOLMXF.js";import"./user-avatar-D31O0Dr2.js";import"./avatar-DrKZ1Oke.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BFpBkS18.js";import"./anchor-link-C16qo_OQ.js";import"./rich-text-viewer-6r7tMJzP.js";import"./date-DtSVuZk5.js";import"./format-hBTAcdw5.js";import"./skeleton-DZxfzVQv.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
