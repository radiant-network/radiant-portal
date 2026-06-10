import{j as e,a8 as g}from"./iframe-iTti_pyP.js";import{h as m}from"./index-D34OhmGL.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-DS5U5rvp.js";import{C as l,A as t}from"./applications-config-BBqjq0IL.js";import{L as u}from"./notes-container-DT7r41Dz.js";import{n as p,g as _}from"./api-notes-BtMsTUJR.js";import{a as c}from"./story-section-j7yPxqOK.js";import{d}from"./delay-BtZx1jvI.js";import{B as S}from"./chunk-QUQL4437-B96YQiWD.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DuAKrHCm.js";import"./index-DDx7eZJ9.js";import"./sheet-DzrweVrn.js";import"./index-DopUXQj0.js";import"./x-CnmNbzCA.js";import"./i18n-D7u3QZ6s.js";import"./button-cGiv4dYx.js";import"./index-Da66sVI7.js";import"./action-button-DqTAdIxg.js";import"./dropdown-menu-DjOLwECI.js";import"./index-DWvOSxA9.js";import"./index-gWb2WLOK.js";import"./check-6NEOXGRc.js";import"./circle-S0Ha6SNG.js";import"./separator-C80gP3l5.js";import"./spinner-BQ4JY4Gj.js";import"./rich-text-editor-Dkhj_LKi.js";import"./toggle-BAt8bBXC.js";import"./popover-DiblySSi.js";import"./input-D4m2QyW0.js";import"./label-DWNTdL0Z.js";import"./underline-BDoK53SN.js";import"./user-avatar-Czb55bFe.js";import"./avatar-rRsMYFuE.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CIPBb7Lf.js";import"./rich-text-viewer-Cstp3sd1.js";import"./date-ezlfxczH.js";import"./format-BeZXHQPF.js";import"./skeleton-jP3ldIdQ.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
