import{j as e,ag as g}from"./iframe-C_dP7gnO.js";import{h as m}from"./index-mfVtaXpC.js";import{S as o}from"./api-CBLDrJEx.js";import{N as i}from"./notes-slider-sheet-DwzKTFF3.js";import{C as l,A as t}from"./applications-config-BL-gJrO0.js";import{L as u}from"./notes-container-CxRYs92T.js";import{n as p,g as _}from"./api-notes-CMuhbtrz.js";import{a as c}from"./story-section-J70NlQOA.js";import{d}from"./delay-oGLnXpoZ.js";import{B as S}from"./chunk-QUQL4437-D01hVGK2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DTYlbHpz.js";import"./i18n-3IdnC225.js";import"./index-BeB-c5z7.js";import"./sheet-CMo5380Q.js";import"./index-Dbp-Hxy3.js";import"./x-CaTxMj_B.js";import"./use-tenant-BSWFgFxB.js";import"./api-CW_xkoj1.js";import"./403-C0H6pQo-.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-f8Hia41T.js";import"./main-navbar-lang-switcher-Br2HJpPu.js";import"./button-BlI6yvoB.js";import"./action-button-DmaA9Ug6.js";import"./dropdown-menu-CkkqqYnf.js";import"./index-BiuKl8gy.js";import"./index-B6yDnkAE.js";import"./check-CtmdECFN.js";import"./circle-Cag81XI_.js";import"./separator-D3keCDl2.js";import"./spinner-Cvbe7dvO.js";import"./rich-text-editor-CNvRMjU9.js";import"./with-selector-DPiph172.js";import"./toggle-CadR4DCf.js";import"./popover-Cifa0nlP.js";import"./input-CJVvcl29.js";import"./label-CT5jJSHz.js";import"./underline-BcKEt21g.js";import"./user-avatar-C5_hkrNJ.js";import"./avatar-r6aSt3qv.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BpPwWcNu.js";import"./anchor-link-CyAXAHmt.js";import"./rich-text-viewer-CR_xgsx6.js";import"./date-BvozVtHv.js";import"./format-BeAQ3eIt.js";import"./skeleton-BiReTMOi.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
