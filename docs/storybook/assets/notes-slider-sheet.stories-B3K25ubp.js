import{j as e,ad as g}from"./iframe-CXwxzQgG.js";import{h as m}from"./index-DT4SZJfw.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-CreBdRkA.js";import{C as l,A as t}from"./applications-config-DR9nMiIG.js";import{L as u}from"./notes-container-C5we_GHu.js";import{n as p,g as _}from"./api-notes-CTm9CfV4.js";import{a as c}from"./story-section-puWRqKt8.js";import{d}from"./delay-B78FEcN0.js";import{B as S}from"./chunk-QUQL4437-umhhK5tm.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Cu6r-uCJ.js";import"./i18n-gHAOwTiM.js";import"./index-DCs8_3sr.js";import"./sheet-IaQK7tvZ.js";import"./index-DHBZBHAn.js";import"./x-Bto3vMF3.js";import"./button-Cxobtibg.js";import"./action-button-DPj_xv_y.js";import"./dropdown-menu-D5pHqyQ1.js";import"./index-Taq0aAWj.js";import"./index-DScWjfT-.js";import"./check-j-xk93RG.js";import"./circle-Dnell8nw.js";import"./separator-pzXO6oVw.js";import"./spinner-C13-5uTG.js";import"./rich-text-editor-mIbSRj7G.js";import"./with-selector-KZidptC8.js";import"./toggle-D1nFozg3.js";import"./popover-DLbcTx_m.js";import"./input-DH-i1PAH.js";import"./label-BpKmJ4D-.js";import"./underline-DUtSeKjY.js";import"./user-avatar-DQ_UFIdc.js";import"./avatar-Cl8tJavu.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CZnBIeOZ.js";import"./anchor-link-OCo75QyI.js";import"./rich-text-viewer-ANuhg4Hp.js";import"./date-Dggjzfun.js";import"./format-UXM3cYd_.js";import"./skeleton-t8m5eO8i.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},se={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const ie=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,ie as __namedExportsOrder,se as default};
