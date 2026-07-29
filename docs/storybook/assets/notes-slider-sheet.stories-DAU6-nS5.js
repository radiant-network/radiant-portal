import{j as e,ag as g}from"./iframe-Ba5Iybcr.js";import{h as m}from"./index-BCplTPHn.js";import{S as o}from"./api-C40SyScH.js";import{N as i}from"./notes-slider-sheet-DCejr0gx.js";import{C as l,A as t}from"./applications-config-Dr5Y5jyF.js";import{L as u}from"./notes-container-DERZLjWB.js";import{n as p,g as _}from"./api-notes-Dqh0RVNa.js";import{a as c}from"./story-section-5UYrVqPJ.js";import{d}from"./delay-CLI3nn-g.js";import{B as S}from"./chunk-QUQL4437-D51zFiot.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CSFIdw_x.js";import"./i18n-Cy0oM3Ki.js";import"./index-FDvGsyLv.js";import"./sheet-Bnkwjo89.js";import"./index-CrXRIAvv.js";import"./x-_znAeN6V.js";import"./use-tenant-WZX5s9Of.js";import"./api-CWZDGZT1.js";import"./403-CedN9Usd.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-reRDKzjJ.js";import"./main-navbar-lang-switcher-CldiV7B3.js";import"./button-Pc7aOWRa.js";import"./action-button-BrZzZe-c.js";import"./dropdown-menu-58R_cXZJ.js";import"./index-DB383bCH.js";import"./index-E7Q1ks-D.js";import"./check-C9wVWpMx.js";import"./circle-DwJaPj0_.js";import"./separator-D1idYbj8.js";import"./spinner-BcBTcsEb.js";import"./rich-text-editor-DkwLkHEg.js";import"./with-selector-B00jLIIk.js";import"./toggle-53zgnZNj.js";import"./popover-v89jKE_n.js";import"./input-BHugA2_p.js";import"./label-B7UtrO04.js";import"./underline-DjBuamuu.js";import"./user-avatar-CSqGhcTr.js";import"./avatar-P0hV2YGJ.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Ca9rpbWo.js";import"./anchor-link-uhelaj9J.js";import"./rich-text-viewer-D2ixq-BZ.js";import"./date-ejKjibP7.js";import"./format-DE401MTO.js";import"./skeleton-Bcw6SOMK.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
