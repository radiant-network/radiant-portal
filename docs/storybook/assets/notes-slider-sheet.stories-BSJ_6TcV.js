import{j as e,ad as g}from"./iframe-GYMnz-7x.js";import{h as m}from"./index-B2PsYcUF.js";import{S as o}from"./api-EcWoeBNP.js";import{N as i}from"./notes-slider-sheet-BjPCDa1Z.js";import{C as l,A as t}from"./applications-config-DO7CSrqT.js";import{L as u}from"./notes-container-D97TgroA.js";import{n as p,g as _}from"./api-notes-CwrXYFVT.js";import{a as c}from"./story-section-B8hLDL9V.js";import{d}from"./delay-maBNLMVv.js";import{B as S}from"./chunk-QUQL4437-CI2-bQxg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DWwVjCJn.js";import"./i18n-LMd9zC7u.js";import"./index-CtN1RmEe.js";import"./sheet-kXt_Pb-i.js";import"./index-DBGP1jll.js";import"./x-B0j_u5GZ.js";import"./use-tenant-Dwdxak71.js";import"./api-LbIRQM0U.js";import"./button-BW7uYpsZ.js";import"./action-button-C5yNblEX.js";import"./dropdown-menu-D8RNBs8V.js";import"./index-DWsE9wOP.js";import"./index-OS3JsfxU.js";import"./check-BxNDYKk2.js";import"./circle-q-mOcdtX.js";import"./separator-CxIJlsta.js";import"./spinner-kDpd_s5I.js";import"./rich-text-editor-MgWfXnN8.js";import"./with-selector-CqhPWCSc.js";import"./toggle-Co5VhbxE.js";import"./popover-B8xXFIbE.js";import"./input-D7Dfp8eO.js";import"./label-C7sSkWa7.js";import"./underline-Bj9klKnk.js";import"./user-avatar-SFFCxjxL.js";import"./avatar-Z7WboOax.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-B0bPJZvB.js";import"./anchor-link-6vbMO4KR.js";import"./rich-text-viewer-D0CmLt-R.js";import"./date-CbAq5C5L.js";import"./format-g6YF7acM.js";import"./skeleton-B2fVud72.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
