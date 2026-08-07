import{j as e,ag as g}from"./iframe-DiGfbfp3.js";import{h as m}from"./index-3-hNE-RT.js";import{S as o}from"./api-43ChDoPP.js";import{N as i}from"./notes-slider-sheet-UaXB9ApW.js";import{C as l,A as t}from"./applications-config-3zgw8Mk1.js";import{L as u}from"./notes-container-BJkxdKYc.js";import{n as p,g as _}from"./api-notes-nuAsHnij.js";import{a as c}from"./story-section-DME95Whn.js";import{d}from"./delay-N9CDzM0B.js";import{B as S}from"./chunk-QUQL4437-Deci752E.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CmFihODA.js";import"./i18n-uvvEETAD.js";import"./index-Cn_qWDha.js";import"./sheet-BXKy38GZ.js";import"./index-DI_ycpoJ.js";import"./x-J1a-oCAV.js";import"./use-tenant-CibSZkCI.js";import"./api-3AJ9fHfo.js";import"./403-EYJulvnc.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Dl_2Bzuf.js";import"./main-navbar-lang-switcher-PvotzuLX.js";import"./button-Bo0DQutg.js";import"./action-button-De4ur-7I.js";import"./dropdown-menu-CNdkncgA.js";import"./index-D8Osr2Vx.js";import"./index-BZGt5Ho_.js";import"./check-IkDt6mIM.js";import"./circle-BTr0m0BF.js";import"./separator-Dj9939qF.js";import"./spinner-C5A6eSO9.js";import"./rich-text-editor-B59wlQAq.js";import"./with-selector-Dq015z4S.js";import"./toggle-D4BMVXwe.js";import"./popover-CYLzFWNX.js";import"./input-CuiOqIFL.js";import"./label-CtMxYPGJ.js";import"./underline-DNZyacjT.js";import"./user-avatar-CRu8Wh7_.js";import"./avatar-B5nzsK59.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DPdnQNw9.js";import"./anchor-link-CKHy9GRN.js";import"./rich-text-viewer-fupiuvlw.js";import"./date-BCTAc7Rz.js";import"./format-D-tYAd5P.js";import"./skeleton-CSZoEeGy.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
