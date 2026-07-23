import{j as e,ae as g}from"./iframe-C6MOWQMA.js";import{h as m}from"./index-D1EkXOif.js";import{S as o}from"./api-D36EIwoJ.js";import{N as i}from"./notes-slider-sheet-w004Uxrl.js";import{C as l,A as t}from"./applications-config-C8uqiM5P.js";import{L as u}from"./notes-container-DCFD1A5I.js";import{n as p,g as _}from"./api-notes-Cjf0MgIZ.js";import{a as c}from"./story-section-_wEsjD86.js";import{d}from"./delay-D-OpxhOt.js";import{B as S}from"./chunk-QUQL4437-BVXGlzM1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Ba4bosxv.js";import"./i18n-CnXb1qax.js";import"./index-DP9hQ_sa.js";import"./sheet-oZhNHcBA.js";import"./index-6QwHF8TM.js";import"./x-CsidU9Vl.js";import"./use-tenant-BIsIlcOh.js";import"./api-BKer6Fgf.js";import"./403-DL1LiQpn.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-B5jTAEeT.js";import"./main-navbar-lang-switcher-BiAkk-2Y.js";import"./button-D9gCVoS4.js";import"./action-button-CZKHrL7b.js";import"./dropdown-menu-DhbUdTSy.js";import"./index-B2qiHt1l.js";import"./index-BrSS3xdM.js";import"./check-BS5Edn5_.js";import"./circle-C3Ir_esd.js";import"./separator-ChOm_zYy.js";import"./spinner-BunjgRxG.js";import"./rich-text-editor-D_509rL-.js";import"./with-selector-BZKxJCSn.js";import"./toggle-DPlct-BQ.js";import"./popover-B1mDzErw.js";import"./input-BACrWIYE.js";import"./label-QQ_bs6T_.js";import"./underline-ByBZ6K75.js";import"./user-avatar-Dpo734Y9.js";import"./avatar-BC9O0SKC.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DevreMgS.js";import"./anchor-link-BDYnkaCX.js";import"./rich-text-viewer-C_Suvo57.js";import"./date-6jfox-vQ.js";import"./format-BcOq8Tgx.js";import"./skeleton-CruioE2S.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
