import{j as e,aa as g}from"./iframe-pCkdMSW4.js";import{h as m}from"./index-mKWxU678.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-_xJKB1jf.js";import{C as l,A as t}from"./applications-config-zQZqX64T.js";import{L as u}from"./notes-container-Ce4ECovy.js";import{n as p,g as _}from"./api-notes-DNtddi9b.js";import{a as c}from"./story-section-BWCYvdHs.js";import{d}from"./delay-DaT7VPfN.js";import{B as S}from"./chunk-QUQL4437-dDoHRhre.js";import"./preload-helper-PPVm8Dsz.js";import"./api-yJ76xPbE.js";import"./index-DyQxDMRQ.js";import"./index-wBlvzvCM.js";import"./sheet-BTCBiNgP.js";import"./index-B5D55Uuw.js";import"./x-C4OEjPPf.js";import"./i18n-Cv0t7e2j.js";import"./button-CvjWkbHj.js";import"./index-C-yKeQSQ.js";import"./action-button-CgBxcC7H.js";import"./dropdown-menu-pFkWlMk4.js";import"./index-BCDqYVKf.js";import"./index-B5hhSGrZ.js";import"./check-CHUKpJ0A.js";import"./circle-DE6Uhsos.js";import"./separator-BG0cX3CB.js";import"./spinner-Diu1sXFA.js";import"./rich-text-editor-j8ImSFkQ.js";import"./with-selector-CN20zQxa.js";import"./toggle-GzZhHexa.js";import"./popover-Dy1XtoDC.js";import"./input-Casv7tlD.js";import"./label-LYcp7-DU.js";import"./underline-DQMHAyGr.js";import"./user-avatar-9rmYFLmM.js";import"./avatar--cQNby1T.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Bv_aVabq.js";import"./anchor-link-Cfg9OFbh.js";import"./rich-text-viewer-BflHwkq3.js";import"./date-fDhaJMy8.js";import"./format-CIpe2__U.js";import"./skeleton-B9jB0vAE.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const pe=["Default","Loading","Empty"];export{a as Default,s as Empty,n as Loading,pe as __namedExportsOrder,me as default};
