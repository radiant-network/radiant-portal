import{j as e,ab as g}from"./iframe-jfSntGFs.js";import{h as m}from"./index-B1bgWAFU.js";import{S as o}from"./api-5e3Wi7_0.js";import{N as i}from"./notes-slider-sheet-CGjiaT0I.js";import{C as l,A as t}from"./applications-config-MZKwyF-l.js";import{L as u}from"./notes-container-Bgz0B5SJ.js";import{n as p,g as _}from"./api-notes-CFG5Vzg1.js";import{a as c}from"./story-section-r6zyD_Yn.js";import{d}from"./delay-uj73SSJt.js";import{B as S}from"./chunk-QUQL4437-BJ_q9AOa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BX1QaFoP.js";import"./i18n-DbzI5Go-.js";import"./index-BY4vqhHc.js";import"./sheet-CPIoyM7E.js";import"./index-CFsicUf2.js";import"./x-BPVOKH4R.js";import"./use-tenant-Dhby9B6w.js";import"./api-CRUcq8iX.js";import"./button-CAlT18JI.js";import"./action-button-DZrA5QIj.js";import"./dropdown-menu-BpGYzQEF.js";import"./index-CBbYNmYq.js";import"./index-DkhoqGQW.js";import"./check-2HNr6tyJ.js";import"./circle-DNNkSORW.js";import"./separator-D0D5PPNv.js";import"./spinner-QPD35Bo0.js";import"./rich-text-editor-CKFIUFl-.js";import"./with-selector-B47eHHEm.js";import"./toggle-DRg_D_j2.js";import"./popover-CpAJw3Kd.js";import"./input-B3qs15DT.js";import"./label-BNd_VEZG.js";import"./underline-8YYMJNl0.js";import"./user-avatar-Cc7PZ8zl.js";import"./avatar-D79AMEmt.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BViGnGqA.js";import"./anchor-link-DkBXkhTC.js";import"./rich-text-viewer-8wvbzlAD.js";import"./date-CEvLXXLy.js";import"./format-BMY9bWlt.js";import"./skeleton-DyY0-JG0.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
