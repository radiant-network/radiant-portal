import{j as e,ag as g}from"./iframe-C1PXzlQr.js";import{h as m}from"./index-DZjg1TSV.js";import{S as o}from"./api-DmeYhNec.js";import{N as i}from"./notes-slider-sheet-DJZDZsfv.js";import{C as l,A as t}from"./applications-config-C9JK8qgY.js";import{L as u}from"./notes-container-DZZaddvc.js";import{n as p,g as _}from"./api-notes-GT-q0jto.js";import{a as c}from"./story-section-DU0BBdYN.js";import{d}from"./delay--e5ZMqmu.js";import{B as S}from"./chunk-QUQL4437-CC8OhIAa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CPCGe-J3.js";import"./i18n-DyD82Oox.js";import"./index-CFbB05VZ.js";import"./sheet-DKr8mYwx.js";import"./index-Bo6H6TB6.js";import"./x-DrrIs9A1.js";import"./use-tenant-D8azKnqJ.js";import"./api-D8acGGK4.js";import"./403-BdAStAuy.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Bk-ZlSN3.js";import"./main-navbar-lang-switcher-DiX6UWOM.js";import"./button-D_iE8cRH.js";import"./action-button-DcJ-KAIJ.js";import"./dropdown-menu-C9oF-YYO.js";import"./index-7dqFgjTR.js";import"./index-Dr-u9fEo.js";import"./check-BkiSwNoP.js";import"./circle-BFYtYw3N.js";import"./separator-Crx5b7zS.js";import"./spinner-BOfS6hjq.js";import"./rich-text-editor-dNyW7aQc.js";import"./with-selector-DekZptnf.js";import"./toggle-YymdWXef.js";import"./popover-jheXUdeV.js";import"./input-BTAA0hsE.js";import"./label-BmHZ1dl2.js";import"./underline-C_0sgo6i.js";import"./user-avatar-C4P_R9jj.js";import"./avatar-B8yqDlnw.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Bmq_A4qY.js";import"./anchor-link-vxW5q_Wf.js";import"./rich-text-viewer-DabuhYXC.js";import"./date-omZi3u8K.js";import"./format-CSZfWJwj.js";import"./skeleton-BQGjVSS1.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
