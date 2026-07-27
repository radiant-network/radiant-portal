import{j as e,ag as g}from"./iframe-DzVRG0r9.js";import{h as m}from"./index-BKJD7rXb.js";import{S as o}from"./api-DuoS2o1G.js";import{N as i}from"./notes-slider-sheet-DGeXH-uu.js";import{C as l,A as t}from"./applications-config-Di_8WoK7.js";import{L as u}from"./notes-container-Lr9Bdx-u.js";import{n as p,g as _}from"./api-notes-DrBfpKJW.js";import{a as c}from"./story-section-BRJcsgp1.js";import{d}from"./delay-vAa3dzCN.js";import{B as S}from"./chunk-QUQL4437-DWPaAJsn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DjZ7HRKs.js";import"./i18n-Bn2K8w1P.js";import"./index-C6QLw8t0.js";import"./sheet-DviPzoE3.js";import"./index-B26ktTTR.js";import"./x-B8zK8r-M.js";import"./use-tenant-HmfS7JDg.js";import"./api-DxuPvJi3.js";import"./403-mlWohY-o.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CPa5pX_c.js";import"./main-navbar-lang-switcher-CLnfX60N.js";import"./button-CC3aT9NM.js";import"./action-button-iayBLEBs.js";import"./dropdown-menu-pNKsTklX.js";import"./index-BJp1TG9L.js";import"./index-OG0Rd7xy.js";import"./check-qyzdVwIr.js";import"./circle-DNcTvxaO.js";import"./separator-ZGlyiOtt.js";import"./spinner-DPP3AqKV.js";import"./rich-text-editor-sBX4tG4d.js";import"./with-selector-RF2BZNHU.js";import"./toggle-Bf_u15iM.js";import"./popover-tbQLJwdT.js";import"./input-B8NtwMbX.js";import"./label-CKhmEl4b.js";import"./underline-SHu8Ya2g.js";import"./user-avatar-BMi2W9k9.js";import"./avatar-g0Xauy8W.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CeCZ6Q7L.js";import"./anchor-link-BbIZYjlP.js";import"./rich-text-viewer-D9JdeWSn.js";import"./date-DD3N0Vg3.js";import"./format-CMMaqQS8.js";import"./skeleton-Byofp1JD.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
