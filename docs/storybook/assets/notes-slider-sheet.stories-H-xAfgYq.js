import{j as e,ad as g}from"./iframe-BOkj70l8.js";import{h as m}from"./index-BJMbDJFV.js";import{S as o}from"./api-D36EIwoJ.js";import{N as i}from"./notes-slider-sheet-DkU1a5A8.js";import{C as l,A as t}from"./applications-config-JBnwvOX3.js";import{L as u}from"./notes-container-DsJwGlL0.js";import{n as p,g as _}from"./api-notes-54ktIuY8.js";import{a as c}from"./story-section-DQYgi0mB.js";import{d}from"./delay-opbjd-4x.js";import{B as S}from"./chunk-QUQL4437-G0f9rGug.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D3LHxnuQ.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";import"./sheet-C3sH5Zme.js";import"./index-DIeKv6Rw.js";import"./x-BN09ysZY.js";import"./use-tenant-0ss66-Wz.js";import"./api-BKer6Fgf.js";import"./403-DkKXtwq_.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-KTxQKqZ0.js";import"./main-navbar-lang-switcher-U0BgklKh.js";import"./button-tn5oIYKb.js";import"./action-button-CeXyayKt.js";import"./dropdown-menu-CQVY1paU.js";import"./index-CTJyEr6n.js";import"./index-fVILgqWX.js";import"./check-DI71rXD4.js";import"./circle-BIlPbk8H.js";import"./separator-MMk7clR0.js";import"./spinner-CmQl4dVH.js";import"./rich-text-editor-C6w5-yqd.js";import"./with-selector-lTLF1HBk.js";import"./toggle-BCEhUGtp.js";import"./popover-Bs2KN7gB.js";import"./input-NnRsrRSq.js";import"./label-0Y6SZoH6.js";import"./underline-CK3p736D.js";import"./user-avatar-DqTyJbcu.js";import"./avatar-Bw2he69f.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DlDiUYpb.js";import"./anchor-link-Dzyi45dj.js";import"./rich-text-viewer-ChwDe04u.js";import"./date-C7aTpNhI.js";import"./format-5Ic6o0K0.js";import"./skeleton-yvCFhn6H.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
