import{j as e,ad as g}from"./iframe-Db3o0LSj.js";import{h as m}from"./index-jvyZU23r.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-BfAOmHms.js";import{C as l,A as t}from"./applications-config-yWal7jqS.js";import{L as u}from"./notes-container-CWXgvEx7.js";import{n as p,g as _}from"./api-notes-U2j6OsF3.js";import{a as c}from"./story-section-Fx7Lxy_f.js";import{d}from"./delay-3Ng5XpsC.js";import{B as S}from"./chunk-QUQL4437-B0jLa5Sb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BAjxIrlq.js";import"./i18n-GmxgkmV0.js";import"./index-Bik4dCkf.js";import"./sheet-B_EfukYS.js";import"./index-BVRvTzh1.js";import"./x-7deDFknf.js";import"./use-tenant-Drdmbs9d.js";import"./api-BjHhlcVm.js";import"./button-DnRKu5DY.js";import"./action-button-DxWVTeY0.js";import"./dropdown-menu-BCBXWB-L.js";import"./index-U9TelM_w.js";import"./index-COcKmsT0.js";import"./check-Lhm-1YCq.js";import"./circle-Cd5P2_hB.js";import"./separator-BlWkC-It.js";import"./spinner-BEHTWga2.js";import"./rich-text-editor-BDEOFBUW.js";import"./with-selector-D4vnsymw.js";import"./toggle-Bw3ybThK.js";import"./popover-bK8khcvk.js";import"./input-BgQY0yTc.js";import"./label-H8u0zyu0.js";import"./underline-BkF2pZLo.js";import"./user-avatar-M0S20HP2.js";import"./avatar-Cop5yZpH.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-GVvGJh64.js";import"./anchor-link-Cfru5KZA.js";import"./rich-text-viewer-ofvFQkbO.js";import"./date-Du-Fz78G.js";import"./format-DqL4UM9m.js";import"./skeleton-D8FzGnhh.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const pe=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,pe as __namedExportsOrder,me as default};
