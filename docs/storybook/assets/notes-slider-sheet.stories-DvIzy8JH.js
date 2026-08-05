import{j as e,ag as g}from"./iframe-BzMpq4Hc.js";import{h as m}from"./index-Dm7V6hb3.js";import{S as o}from"./api-vC-PrVf7.js";import{N as i}from"./notes-slider-sheet-D6RKj3FT.js";import{C as l,A as t}from"./applications-config-rcqX5GIb.js";import{L as u}from"./notes-container-Dr6k8hJ_.js";import{n as p,g as _}from"./api-notes-BeOHR6zP.js";import{a as c}from"./story-section-DVNANUlR.js";import{d}from"./delay-LZSAYtxA.js";import{B as S}from"./chunk-QUQL4437-D-PGPLAV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-oZlYwCv4.js";import"./i18n-DgcYhEYb.js";import"./index-DsnHWkyF.js";import"./sheet-C2U54wEI.js";import"./index-B5eiDOej.js";import"./x-CT18IQ0f.js";import"./use-tenant-D2mTa-W_.js";import"./api-CoLy23bT.js";import"./403-e4xwTdy_.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CiniFUrW.js";import"./main-navbar-lang-switcher-CcQBAGiE.js";import"./button-G_7WvFjb.js";import"./action-button-f97mKVJz.js";import"./dropdown-menu-dmEKL98B.js";import"./index-BG0WSpn-.js";import"./index-Cc45Ah96.js";import"./check-BBp2wSs8.js";import"./circle-Cikc3-Oi.js";import"./separator-BoZNDwc5.js";import"./spinner-BhQW7Z4M.js";import"./rich-text-editor-BWkg7BaJ.js";import"./with-selector-DTrVbCCP.js";import"./toggle-BSXGH4LG.js";import"./popover-CzuN8fzY.js";import"./input-D5Ga5Y8M.js";import"./label-CSyXSd-r.js";import"./underline-DD9q4Hn0.js";import"./user-avatar-esXWLJ77.js";import"./avatar-BaSVbNy6.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-MWFIxo2p.js";import"./anchor-link-mMfGRbMc.js";import"./rich-text-viewer-uvkxy4lf.js";import"./date-DCunjgVf.js";import"./format-CaXjhxa0.js";import"./skeleton-liXsRL7_.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
