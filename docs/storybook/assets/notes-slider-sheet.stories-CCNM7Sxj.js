import{j as e,ai as g}from"./iframe-CsmmCDil.js";import{h as m}from"./index-C0zb2qvr.js";import{S as o}from"./api-Dg2ayPVZ.js";import{N as i}from"./notes-slider-sheet-B5mXlTED.js";import{C as l,A as t}from"./applications-config-hzvsWAMN.js";import{L as u}from"./notes-container-CM_mOzdc.js";import{n as p,g as _}from"./api-notes-B8MpL1UU.js";import{a as c}from"./story-section-BruI3BJC.js";import{d}from"./delay-CFAq5tak.js";import{B as S}from"./chunk-QUQL4437-Bk5fkFNP.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DKAlTEAc.js";import"./i18n-CivhJ0zv.js";import"./index-BiNs9BjM.js";import"./sheet-cnzhvc2F.js";import"./index-Cz814i2K.js";import"./x-CdDvdrZW.js";import"./use-tenant-Cq-YZt5w.js";import"./api-BpqDmW87.js";import"./403-D7pTzzlT.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Bw8S1Ypq.js";import"./main-navbar-lang-switcher-CBFMNA_f.js";import"./button-CLdXJbIO.js";import"./action-button-BXvWHX1M.js";import"./dropdown-menu-CMD-kT8U.js";import"./index-okOsg7fW.js";import"./index-DHlLYSd4.js";import"./check-Bvaswsz_.js";import"./circle-Bw4VVGH9.js";import"./separator-Blqqu4Ag.js";import"./spinner-NvISg5bd.js";import"./rich-text-editor-CeVwNYxm.js";import"./with-selector-CFmGyZXA.js";import"./toggle-AH9fYlqY.js";import"./popover-CFdfykkf.js";import"./input-BXiYb8rI.js";import"./label-8wYWr6_s.js";import"./underline-DDaNRlq5.js";import"./user-avatar-Bp0WrQq-.js";import"./avatar-Dp-YDiQ-.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CgB4gOqY.js";import"./anchor-link-D1sRV5AJ.js";import"./rich-text-viewer-CSJcMdT0.js";import"./date-dwJITHIM.js";import"./format-CetIDy12.js";import"./skeleton-DeKWitoV.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
