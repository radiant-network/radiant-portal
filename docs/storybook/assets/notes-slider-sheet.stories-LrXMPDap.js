import{j as e,a8 as g}from"./iframe-Cbdknb1k.js";import{h as m}from"./index-Cbsos1Om.js";import{S as o}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-Bkn1VFbc.js";import{C as l,A as t}from"./applications-config-CNEk6IF6.js";import{L as u}from"./notes-container-BAqDFS7W.js";import{n as p,g as _}from"./api-notes-CPJIgPxr.js";import{a as c}from"./story-section-BVaUEtis.js";import{d}from"./delay-BNEme9iR.js";import{B as S}from"./chunk-QUQL4437-CorQw_Pn.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DwaRmgHt.js";import"./index-C6yqdqIH.js";import"./sheet-CX9tEiV7.js";import"./index-BJ2AJWjj.js";import"./x-jGcVnGJc.js";import"./i18n-D-yzr8ya.js";import"./button-B2dwLL0F.js";import"./index-87WvwnWY.js";import"./action-button-vyGBaIAJ.js";import"./dropdown-menu-BHyRkyrg.js";import"./index-Cz_krX8a.js";import"./index-vbxHKvSM.js";import"./check-DPpRClnn.js";import"./circle-CJX0r14w.js";import"./separator-Bq5mxrnm.js";import"./spinner-fglN_CVb.js";import"./rich-text-editor-BsqTpIhZ.js";import"./toggle-BtEiF80m.js";import"./popover-FM2MpKK-.js";import"./input-DRo4I_Cn.js";import"./label-BQwkdKDu.js";import"./underline-B7-2tsXm.js";import"./user-avatar-BMI9yyJK.js";import"./avatar-BBqE_gmA.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CmAxRe47.js";import"./rich-text-viewer-BG8yO5Uf.js";import"./date-CepL35j8.js";import"./format-Bo_O5ukr.js";import"./skeleton-BLK-BKPp.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const se=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,se as __namedExportsOrder,ae as default};
