import{j as e,aa as g}from"./iframe-D5nbMH0Z.js";import{h as m}from"./index-CI127spG.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-zecJjkxW.js";import{C as l,A as t}from"./applications-config-Dcz3osLJ.js";import{L as u}from"./notes-container-hzam9mzT.js";import{n as p,g as _}from"./api-notes-DRwOpHmq.js";import{a as c}from"./story-section-DfWRQdTn.js";import{d}from"./delay-BQm1R4TG.js";import{B as S}from"./chunk-QUQL4437-BYuO-HFN.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Dx_IKiyr.js";import"./index-inuiUwi3.js";import"./index-CJ_W4xqL.js";import"./sheet-hTrwDmiz.js";import"./index-PgRHxHuO.js";import"./x-CmBLWl3D.js";import"./i18n-Bdg0oCKu.js";import"./button-CivLk_fn.js";import"./index-Cc9ovpm8.js";import"./action-button-CRlVI-Q0.js";import"./dropdown-menu-DXt4HdYg.js";import"./index-Coy-0tiE.js";import"./index-C8YmK8nx.js";import"./check-DI_qTPcP.js";import"./circle-C9-1AW9v.js";import"./separator-DOf7FV04.js";import"./spinner-wL-kLztJ.js";import"./rich-text-editor-CX2ehHSq.js";import"./with-selector-BoxiSPNm.js";import"./toggle-BV2f9Tgq.js";import"./popover-DMlYzQoR.js";import"./input-BhuweRUC.js";import"./label-DAYBDqXe.js";import"./underline-C6jLrEnj.js";import"./user-avatar-B0BjTg3O.js";import"./avatar-BVBndLqk.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CEbsXQQ9.js";import"./anchor-link-BQhwfbEw.js";import"./rich-text-viewer-DOv5vmlR.js";import"./date-b2n-6bsv.js";import"./format-WF8Kw5zT.js";import"./skeleton-h3nIrjte.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
