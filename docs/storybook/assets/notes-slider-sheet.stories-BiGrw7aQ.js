import{j as e,ay as g,S as n}from"./iframe-CgZaKe5d.js";import{h as c}from"./index-Co9-r5az.js";import{N as i}from"./notes-slider-sheet-C-4BQ73E.js";import{C as l,A as t}from"./applications-config-Ci4Z5Tuj.js";import{L as u}from"./notes-container-B7_cs08c.js";import{n as p,g as _}from"./api-notes-DxMJgrxz.js";import{a as m}from"./story-section-Cd-IQlgl.js";import{d}from"./delay-DinrZnzi.js";import{B as S}from"./chunk-QUQL4437-kktIQY6E.js";import"./preload-helper-PPVm8Dsz.js";import"./index-UdOaDqtK.js";import"./sheet-B4fhyPm2.js";import"./index-DOoNJz6V.js";import"./x-C9LJTscZ.js";import"./spinner-BA9X1XnJ.js";import"./rich-text-editor-XW5B4rAa.js";import"./with-selector-pinLDNQu.js";import"./toggle-CDqT2PMS.js";import"./popover-DDZSXOOd.js";import"./input-wTxIY8D5.js";import"./label-C-mLdX7m.js";import"./underline-CMuPCCtW.js";import"./user-avatar-BlpHYrG_.js";import"./avatar-Nf1uBbU2.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-B6w2KuxO.js";import"./anchor-link-Bd_UBClM.js";import"./rich-text-viewer-vI9BRb1w.js";import"./date-DlVQo-n6.js";import"./format-Bz_cgPFc.js";import"./skeleton-Y9K1ks3z.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},W={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(m,{title:"Default",children:e.jsx(i,{...r})})},o={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(m,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[c.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(m,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const X=["Default","Loading","Empty"];export{a as Default,s as Empty,o as Loading,X as __namedExportsOrder,W as default};
