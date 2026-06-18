import{j as e,aa as g}from"./iframe-C3tvUR1J.js";import{h as m}from"./index-DNxbsL1M.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-CgVRf0GS.js";import{C as l,A as t}from"./applications-config-CES-ACJK.js";import{L as u}from"./notes-container-BTIw1RwL.js";import{n as p,g as _}from"./api-notes-CjjZXi2H.js";import{a as c}from"./story-section-Cml820jU.js";import{d}from"./delay-Cv4sAvZf.js";import{B as S}from"./chunk-QUQL4437-CRphbiH_.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BzF852Vm.js";import"./index-COGJCRuB.js";import"./index-t1n2C8Aq.js";import"./sheet-QIgWpgOO.js";import"./index-Cmg-r0YW.js";import"./x-QdJ2UURP.js";import"./i18n-sXy_IXHd.js";import"./button-DBxIrY1M.js";import"./index-wNbfclQ1.js";import"./action-button-BNzMztdM.js";import"./dropdown-menu-6SkrUZiL.js";import"./index-B_di4gWb.js";import"./index-BQlRfD1v.js";import"./check-Cewv9fI2.js";import"./circle-B5BEDuQC.js";import"./separator-DYKEDePW.js";import"./spinner-Zvrh19Ne.js";import"./rich-text-editor-BvXW5Spn.js";import"./with-selector-DoHWs2Xc.js";import"./toggle-BucST8zx.js";import"./popover-BUglsqDq.js";import"./input-CaIta0Ot.js";import"./label-BAA81ssV.js";import"./underline-B9TmKBzC.js";import"./user-avatar-D7V1lWWZ.js";import"./avatar-DaoTP-xI.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DIdB2Klj.js";import"./anchor-link-BjDrLmdm.js";import"./rich-text-viewer-BFJ4mmzq.js";import"./date-DJGyLeCz.js";import"./format-C_hspgXm.js";import"./skeleton-B0doAO5A.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
