import{j as e,ad as g}from"./iframe-CuWpm1qa.js";import{h as m}from"./index-C6lwpPZ2.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-CyGEd1h-.js";import{C as l,A as t}from"./applications-config-bsVpSCPZ.js";import{L as u}from"./notes-container-BYwbX3ud.js";import{n as p,g as _}from"./api-notes-CAtpsO3r.js";import{a as c}from"./story-section-w3-NF7Xp.js";import{d}from"./delay-CqQCeCbl.js";import{B as S}from"./chunk-QUQL4437-CXAMCr7o.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DSNW0WvP.js";import"./i18n-Dk4pliQz.js";import"./index-8BZx1Yb8.js";import"./sheet-BpMSIIDL.js";import"./index-Cs1WMc-C.js";import"./x-BvFgF3db.js";import"./use-tenant-DPtKG6c-.js";import"./api-BjHhlcVm.js";import"./button-CSz6EV4E.js";import"./action-button-lN5zPVbm.js";import"./dropdown-menu-BOERjw4c.js";import"./index-Dmb4mQ0b.js";import"./index-CJQJWHRc.js";import"./check-j36eKSHy.js";import"./circle-Dfldtqa6.js";import"./separator-BEF1T6M0.js";import"./spinner-EuH1Jjax.js";import"./rich-text-editor-CtEimLNU.js";import"./with-selector-idKWT4OI.js";import"./toggle-uPej7P5x.js";import"./popover-BajqPyEk.js";import"./input-DaYwgoyw.js";import"./label-BBpbnW0o.js";import"./underline-BUMuNBfA.js";import"./user-avatar-yzIgG_hq.js";import"./avatar-BTpGU2vp.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DsFMTtKT.js";import"./anchor-link-V1jbctmx.js";import"./rich-text-viewer-C5JgT0lN.js";import"./date-M6M5PNWs.js";import"./format-CL832mL-.js";import"./skeleton-BQ5jhFqg.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const pe=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,pe as __namedExportsOrder,me as default};
