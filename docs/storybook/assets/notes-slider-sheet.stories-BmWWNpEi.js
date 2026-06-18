import{j as e,aa as g}from"./iframe-B_jnDYRw.js";import{h as m}from"./index-B9AgPsik.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-CxxJXWfZ.js";import{C as l,A as t}from"./applications-config-CKqGnMom.js";import{L as u}from"./notes-container-C7oDQ42b.js";import{n as p,g as _}from"./api-notes-B9-d5m-v.js";import{a as c}from"./story-section-4RqDghQR.js";import{d}from"./delay-B1FStHkS.js";import{B as S}from"./chunk-QUQL4437-vQztLMpV.js";import"./preload-helper-PPVm8Dsz.js";import"./api-7mgpSi2y.js";import"./index-BnQ-eqKb.js";import"./index-BLQqHNw6.js";import"./sheet-38OpoO1Z.js";import"./index-Cp2DBx3c.js";import"./x-Cv5nq-WI.js";import"./i18n-Dc-D14XP.js";import"./button-CspqOU_f.js";import"./index-DfeYIiAg.js";import"./action-button-sxXzUOnj.js";import"./dropdown-menu-DdhXS6nr.js";import"./index-3VdlNnLx.js";import"./index-J2Zi4jnN.js";import"./check-DnHgWdHC.js";import"./circle-DM65GupB.js";import"./separator-C2WPDGRO.js";import"./spinner-s-nhv69_.js";import"./rich-text-editor-CSNL0yWr.js";import"./with-selector-n1HbI5W4.js";import"./toggle-Cn4k8a_E.js";import"./popover-BBN0rCPQ.js";import"./input-DPMEKcCK.js";import"./label-93OlOPYV.js";import"./underline--KQH4efn.js";import"./user-avatar-Ba-p2KW_.js";import"./avatar-BJWH9mj-.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card--2KIBd55.js";import"./anchor-link-BZEUthqZ.js";import"./rich-text-viewer-tJvuztqO.js";import"./date-CSeZGEoh.js";import"./format-B_4FtrOH.js";import"./skeleton-B-qS3b8Q.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
