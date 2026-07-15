import{j as e,ad as g}from"./iframe-B5m_r5t1.js";import{h as m}from"./index-BX8vut0h.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-BOzpKtiX.js";import{C as l,A as t}from"./applications-config-Dz2YnBWk.js";import{L as u}from"./notes-container-CIIV2A4S.js";import{n as p,g as _}from"./api-notes-CruAsb3N.js";import{a as c}from"./story-section-pH31KqSy.js";import{d}from"./delay-DeBlSXkd.js";import{B as S}from"./chunk-QUQL4437-K3W6dNsk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BPtrRWzB.js";import"./i18n-BHXPh8AP.js";import"./index-5c2p_uqG.js";import"./sheet-DzLMuNEB.js";import"./index-B8wx6LiN.js";import"./x-B3bKcLJ1.js";import"./use-tenant-D_E7f3mM.js";import"./api-BjHhlcVm.js";import"./button-DqX3TAag.js";import"./action-button-BOac_c5S.js";import"./dropdown-menu-r5w4W6fH.js";import"./index-D-iXBiuO.js";import"./index-BQW_qE22.js";import"./check-sbLhD5de.js";import"./circle-C4wI0UCh.js";import"./separator-Dk_QM_ol.js";import"./spinner-BiAJU5oF.js";import"./rich-text-editor-D42mFoSK.js";import"./with-selector-3G7FsKDh.js";import"./toggle-Bpy8qSZc.js";import"./popover-CxAyEJyA.js";import"./input-DXyGBBci.js";import"./label-B10Cb-6A.js";import"./underline-wBCl7z05.js";import"./user-avatar-Cuc1yI6u.js";import"./avatar-t8dhA__j.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-klwIHkyg.js";import"./anchor-link-B-VEzSZa.js";import"./rich-text-viewer-ck7UWz-f.js";import"./date-BlEOd4fl.js";import"./format-Cnzi_mc1.js";import"./skeleton-COSmEOST.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
