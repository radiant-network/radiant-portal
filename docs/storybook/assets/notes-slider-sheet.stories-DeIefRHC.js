import{j as e,ab as g}from"./iframe--Wr8akaj.js";import{h as m}from"./index-BNvLVGFb.js";import{S as o}from"./api-5e3Wi7_0.js";import{N as i}from"./notes-slider-sheet-D4mboTF2.js";import{C as l,A as t}from"./applications-config-Bam6cSsz.js";import{L as u}from"./notes-container-BZ7ap0m9.js";import{n as p,g as _}from"./api-notes-DoDRogIU.js";import{a as c}from"./story-section-mf2KVIsr.js";import{d}from"./delay-DaEuuihb.js";import{B as S}from"./chunk-QUQL4437-csEiRURN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CKFT6Hhx.js";import"./i18n-Bg6Ec5jw.js";import"./index-C36_LE4b.js";import"./sheet-rnnE-CUD.js";import"./index--mtDE1Bv.js";import"./x-D_rtmg3q.js";import"./use-tenant-CrIXgj1f.js";import"./api-CRUcq8iX.js";import"./button-AGQ9gLKF.js";import"./action-button-B8HAWUkq.js";import"./dropdown-menu-D__ES2m4.js";import"./index-D5QIG_v-.js";import"./index-CHj75zQJ.js";import"./check-DN_rAFtv.js";import"./circle-kD5s09G8.js";import"./separator-DW3W07XT.js";import"./spinner-BFqw7kVy.js";import"./rich-text-editor-BKYgPqiZ.js";import"./with-selector-Dcx6IIHZ.js";import"./toggle-OtELxQzk.js";import"./popover-7gu0n4w5.js";import"./input-BO0YpR5a.js";import"./label-BV5ASGe5.js";import"./underline-Bk2KUvOP.js";import"./user-avatar-CfWLGlse.js";import"./avatar-DkfATUhe.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-C1ku92eF.js";import"./anchor-link-B5Oq9MEF.js";import"./rich-text-viewer-DA7KRJEj.js";import"./date-BX4jta_o.js";import"./format-BotbkKlB.js";import"./skeleton-BMw6N2bI.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
