import{j as e,ai as g}from"./iframe-BC4RzbTe.js";import{h as m}from"./index-DSqJTBTz.js";import{S as o}from"./api-C26xm_xg.js";import{N as i}from"./notes-slider-sheet-CiHpbmtS.js";import{C as l,A as t}from"./applications-config-CH_4GAIJ.js";import{L as u}from"./notes-container-D3cKqquF.js";import{n as p,g as _}from"./api-notes-Bl8aDbBN.js";import{a as c}from"./story-section-DPrmmWzN.js";import{d}from"./delay-DyxZSl6J.js";import{B as S}from"./chunk-QUQL4437-TVZeIKqt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CnFZJuWy.js";import"./i18n-B_9vMIaN.js";import"./index-nJ2VJ9o6.js";import"./sheet-BGFFNkFW.js";import"./index-DACLWZXy.js";import"./x-CE8BJu81.js";import"./use-tenant-CqvrZUVK.js";import"./api-C26LFTI9.js";import"./403-B2iaeOIn.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-L2aTJfGZ.js";import"./main-navbar-lang-switcher-BcKQCTah.js";import"./button-LUczZP4-.js";import"./action-button-CC0bpEam.js";import"./dropdown-menu-Baq_OXPj.js";import"./index-CbsMyLW-.js";import"./index-D1ZMpyoR.js";import"./check-CdGhgW-U.js";import"./circle-Ck_AokSU.js";import"./separator-C1ujT8UF.js";import"./spinner-DHbbDwnH.js";import"./rich-text-editor-BPM1Fqjm.js";import"./with-selector-CO2pk2GG.js";import"./toggle-Bx1qnUJv.js";import"./popover-DvqIF_Pg.js";import"./input-7rFWf7lc.js";import"./label-IdXerJGz.js";import"./underline-B00RBhOT.js";import"./user-avatar-DdrJ6YOc.js";import"./avatar-CjaGBlYx.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-0lnAxUvc.js";import"./anchor-link-DNwyGGhD.js";import"./rich-text-viewer-FdlS7oC8.js";import"./date-hXF5jisR.js";import"./format-BJJXtSYF.js";import"./skeleton-B5ieX502.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
