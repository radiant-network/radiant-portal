import{j as e,ag as g}from"./iframe-BXBRzL1c.js";import{h as m}from"./index-NpwqAfcT.js";import{S as o}from"./api-IE258HGD.js";import{N as i}from"./notes-slider-sheet-BbCY0fOq.js";import{C as l,A as t}from"./applications-config-CmUEdNAO.js";import{L as u}from"./notes-container-B2JP-SSj.js";import{n as p,g as _}from"./api-notes-C4GhIzOV.js";import{a as c}from"./story-section-G0DD0yKl.js";import{d}from"./delay-CclrzcRy.js";import{B as S}from"./chunk-QUQL4437-DGUZn1R2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DkrYVHRy.js";import"./i18n-DUK-WuJ6.js";import"./index-DYAaY2Yf.js";import"./sheet-DlQ58pTW.js";import"./index-I9rBnVM7.js";import"./x-Ccdq7o_U.js";import"./use-tenant-BT7VDdFK.js";import"./api-CRj7GcIN.js";import"./403-BrxSxOJS.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-8PmMV6BK.js";import"./main-navbar-lang-switcher-C-18y_9g.js";import"./button-CnDkH2FJ.js";import"./action-button-CiX5XSNN.js";import"./dropdown-menu-Dj2Zjq4n.js";import"./index-Buei5AJu.js";import"./index-C0UyXbDn.js";import"./check-BOVnNvmn.js";import"./circle-ZGZFIAr_.js";import"./separator-D6E9NYhF.js";import"./spinner-BE6OLrdh.js";import"./rich-text-editor-CytpYzGq.js";import"./with-selector-BvSyrgVp.js";import"./toggle-D4NLL7iD.js";import"./popover-Df1FE77O.js";import"./input-ew69_th4.js";import"./label-FkSBQTJT.js";import"./underline-OvD_KUdK.js";import"./user-avatar-B89LT5Ia.js";import"./avatar-kT4cePYn.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BpuADPC0.js";import"./anchor-link-DElBJdeU.js";import"./rich-text-viewer-DiqVite0.js";import"./date-Cce3DZw4.js";import"./format-DaiZ9FI0.js";import"./skeleton-L9n2tz6Q.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
