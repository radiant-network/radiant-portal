import{j as e,ag as g}from"./iframe-D7ER49TR.js";import{h as m}from"./index-MdIc24GS.js";import{S as o}from"./api-V3_aiIEN.js";import{N as i}from"./notes-slider-sheet-klnFE_Wn.js";import{C as l,A as t}from"./applications-config-ChR6cj1x.js";import{L as u}from"./notes-container-qoZM0E5r.js";import{n as p,g as _}from"./api-notes-Bal1VtU3.js";import{a as c}from"./story-section-T7092GL1.js";import{d}from"./delay-BU1ua2jq.js";import{B as S}from"./chunk-QUQL4437-XgJlaJMU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BCwoMdXb.js";import"./i18n-D0rznIQh.js";import"./index-oucxxOkI.js";import"./sheet-CJMa_evh.js";import"./index-Bk6opAzS.js";import"./x-DaMWe1QI.js";import"./use-tenant-rYDy-wfc.js";import"./api-D846dPTc.js";import"./403-CG26SCdL.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-DLZizhCh.js";import"./main-navbar-lang-switcher-DOeBKQKA.js";import"./button-P2tNjpVJ.js";import"./action-button-D6y5Szv8.js";import"./dropdown-menu-DgcnzvDN.js";import"./index-B6dqpAEy.js";import"./index-Dud_FKwN.js";import"./check-Dm7HKO46.js";import"./circle-CgC-JePX.js";import"./separator-BkZFpBO0.js";import"./spinner-CJL8bVYM.js";import"./rich-text-editor-BOoAH1z9.js";import"./with-selector-DEMYebQl.js";import"./toggle-CdIszvhF.js";import"./popover-DJVuQtpP.js";import"./input-CDEKI0ES.js";import"./label-COAHrHCp.js";import"./underline-FqEXJDAW.js";import"./user-avatar-CZiitelU.js";import"./avatar-BeuKKXtP.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BI62MO5W.js";import"./anchor-link-B-aRk5PG.js";import"./rich-text-viewer-s9NX8RHC.js";import"./date-DsoBZeVB.js";import"./format-CPtr5-dl.js";import"./skeleton-D1YXgtsx.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
