import{j as e,ag as g}from"./iframe-BwgnBgbs.js";import{h as m}from"./index-BUC84PE7.js";import{S as o}from"./api-CbXfKFEH.js";import{N as i}from"./notes-slider-sheet-7Zv9MQ2g.js";import{C as l,A as t}from"./applications-config-82us2Psj.js";import{L as u}from"./notes-container-BsLm3HSo.js";import{n as p,g as _}from"./api-notes-CaxdXBKe.js";import{a as c}from"./story-section-CUmPhl8T.js";import{d}from"./delay-7953ktXM.js";import{B as S}from"./chunk-QUQL4437-BhUmmbyj.js";import"./preload-helper-PPVm8Dsz.js";import"./index-XsBXfm3q.js";import"./i18n-q3nsv9wg.js";import"./index-9G14H1gK.js";import"./sheet-DRddoXlo.js";import"./index-D5iQXz5Q.js";import"./x-CRkQviaL.js";import"./use-tenant-BmU-1imR.js";import"./api-J3_QhqET.js";import"./403-DTdwoXGJ.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Cz1IxsL7.js";import"./main-navbar-lang-switcher-CfCiSgPt.js";import"./button-CVRshTFc.js";import"./action-button-DfTzlCGI.js";import"./dropdown-menu-CUFPYByL.js";import"./index-E0yEPtnq.js";import"./index-BbLf2bTU.js";import"./check-BmfiAxZ2.js";import"./circle-C8kpohc-.js";import"./separator-B4ksv8En.js";import"./spinner-BfcNW3Oj.js";import"./rich-text-editor-NJi1S9p-.js";import"./with-selector-B8wOVOYe.js";import"./toggle-Br6HkIi1.js";import"./popover-CHTBBHtG.js";import"./input-byuIrEYD.js";import"./label-BMzq2NJa.js";import"./underline-Cir1YT6P.js";import"./user-avatar-DZLRSngu.js";import"./avatar-DlWtkI35.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-GuM5mDdr.js";import"./anchor-link-CIUThgX3.js";import"./rich-text-viewer-BxCsH4Za.js";import"./date-DgTxUvVu.js";import"./format-2kixvCns.js";import"./skeleton-Bla1fROo.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
