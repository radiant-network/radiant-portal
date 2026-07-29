import{j as e,ag as g}from"./iframe-BCdw1Zpv.js";import{h as m}from"./index-DBNMvnS4.js";import{S as o}from"./api-LxSE38Xs.js";import{N as i}from"./notes-slider-sheet-B0SYchFw.js";import{C as l,A as t}from"./applications-config-Bkpf8T2V.js";import{L as u}from"./notes-container-qu-de8ax.js";import{n as p,g as _}from"./api-notes-BTc-SEyk.js";import{a as c}from"./story-section-DgtXw29J.js";import{d}from"./delay-CL0wl2LW.js";import{B as S}from"./chunk-QUQL4437-BYT-TXVN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-FltF3-ml.js";import"./i18n-BerkWO00.js";import"./index-mpFtsMNW.js";import"./sheet-DJsB89Mb.js";import"./index-DZiK57Da.js";import"./x-DwSUWTV9.js";import"./use-tenant-D8ccltDD.js";import"./api-CwOGLQEC.js";import"./403-BpbSm9dO.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BaR1FEqz.js";import"./main-navbar-lang-switcher-DZu3K9fR.js";import"./button-CCDrrqA6.js";import"./action-button-C_F8twkk.js";import"./dropdown-menu-HBuGdxYI.js";import"./index-BS8cZKMG.js";import"./index-COD-M8Go.js";import"./check-DAngudb0.js";import"./circle-DY_U8LIw.js";import"./separator-CxLC1eka.js";import"./spinner-Dz11J8UI.js";import"./rich-text-editor-fslUTc0u.js";import"./with-selector-Bt7m2J4R.js";import"./toggle-DxYlSBXO.js";import"./popover-C-rOVDDe.js";import"./input-BSJreeT5.js";import"./label-l8FzOQVN.js";import"./underline-BpF-M-GA.js";import"./user-avatar-CMGyBRe3.js";import"./avatar-CJ-JGX0t.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-47ZMflt3.js";import"./anchor-link-Buae5vp2.js";import"./rich-text-viewer-DHO087yC.js";import"./date-BzdWp25m.js";import"./format-Jz64ZtaI.js";import"./skeleton-BC0oTTyA.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
