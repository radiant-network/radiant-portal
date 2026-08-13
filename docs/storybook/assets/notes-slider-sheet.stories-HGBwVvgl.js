import{j as e,ag as g}from"./iframe-BIXXYuBI.js";import{h as m}from"./index-DUCXLjYZ.js";import{S as o}from"./api-BPXQdJnN.js";import{N as i}from"./notes-slider-sheet-BjKIEcK5.js";import{C as l,A as t}from"./applications-config-DEK4SPXH.js";import{L as u}from"./notes-container-BJ-ibuoy.js";import{n as p,g as _}from"./api-notes-KqYOdlB3.js";import{a as c}from"./story-section-DE5REqsE.js";import{d}from"./delay-B3q2OnQw.js";import{B as S}from"./chunk-QUQL4437-9LXkS8Da.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DrtFoJ_2.js";import"./i18n-DzF9286q.js";import"./index-CFXxicox.js";import"./sheet-DbRa4NF7.js";import"./index-ZWv7JTrP.js";import"./x-P8l5shew.js";import"./use-tenant-DGG2Zd_8.js";import"./api-CzLmFqDN.js";import"./403-DH0l6nrE.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CtJnZkCg.js";import"./main-navbar-lang-switcher-C4h_uOJ6.js";import"./button-xPG5O6R2.js";import"./action-button-BSswwT5c.js";import"./dropdown-menu-DBlI4iuc.js";import"./index-BqZtMSNs.js";import"./index-D0c3HBoV.js";import"./check-BfX4x5II.js";import"./circle-CKfwywNe.js";import"./separator-B6mOwfzL.js";import"./spinner-BlvM0ycp.js";import"./rich-text-editor-DwujJmg2.js";import"./with-selector-C0eFGeOA.js";import"./toggle-DW-7anIL.js";import"./popover-DqgG4Blr.js";import"./input-KV_Gh6r-.js";import"./label-BVlxjPWm.js";import"./underline-CYBG3_fT.js";import"./user-avatar-C-vlX55I.js";import"./avatar-CaL6J1kR.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-RNT5rW2p.js";import"./anchor-link-CjI4IxhO.js";import"./rich-text-viewer-BkyZlNT6.js";import"./date-BfA0NUjY.js";import"./format-BEhPeiSc.js";import"./skeleton-BDass7SO.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
