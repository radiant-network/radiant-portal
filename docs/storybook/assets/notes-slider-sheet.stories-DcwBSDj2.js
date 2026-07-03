import{j as e,ad as g}from"./iframe-Clj-cmbv.js";import{h as m}from"./index-CTjUq99K.js";import{S as o}from"./api-EcWoeBNP.js";import{N as i}from"./notes-slider-sheet--kP6O3uF.js";import{C as l,A as t}from"./applications-config-DNIbusgh.js";import{L as u}from"./notes-container-DzXStSJB.js";import{n as p,g as _}from"./api-notes-DcSS28Ho.js";import{a as c}from"./story-section-DCzIVbFj.js";import{d}from"./delay-D47IiMhP.js";import{B as S}from"./chunk-QUQL4437-CuPL5rLy.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bu2xSwIs.js";import"./i18n-CteUV2dW.js";import"./index-BRQotc69.js";import"./sheet-Dcv2L3b1.js";import"./index-DCRZ6HlD.js";import"./x-BOxx-XgJ.js";import"./use-tenant-CqYcL_t5.js";import"./api-LbIRQM0U.js";import"./button-CpjCmLUP.js";import"./action-button-B-B5BuJQ.js";import"./dropdown-menu-D1F9T0ri.js";import"./index-LQNM7kie.js";import"./index-DujBfDZp.js";import"./check-DR5_QgnI.js";import"./circle-RCbrrEpe.js";import"./separator-BkoI8fxB.js";import"./spinner-Be7kWH29.js";import"./rich-text-editor-CqjAFJCg.js";import"./with-selector-BY-Uqnfv.js";import"./toggle-CuPxFv1u.js";import"./popover-mYB4IRDq.js";import"./input-BLVDsk37.js";import"./label-QaK_1ghx.js";import"./underline-BzmfrBzw.js";import"./user-avatar-D3dNFnzG.js";import"./avatar-B71JDA9N.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-eMBWPFvF.js";import"./anchor-link-CE4MEJI7.js";import"./rich-text-viewer-bjzPk3qL.js";import"./date-DHU1cgJs.js";import"./format-BAf-sZZ3.js";import"./skeleton-Bc6-r1_Z.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
