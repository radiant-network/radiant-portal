import{j as e,ag as g}from"./iframe-c2IPk3oe.js";import{h as m}from"./index-Be4Sy7Es.js";import{S as o}from"./api-Dm71OR6H.js";import{N as i}from"./notes-slider-sheet-BZaM7LpN.js";import{C as l,A as t}from"./applications-config-CDi0XW_r.js";import{L as u}from"./notes-container-B3XwfZ4k.js";import{n as p,g as _}from"./api-notes-BJY7MQ73.js";import{a as c}from"./story-section-CAEPkWC7.js";import{d}from"./delay-DsCZxnb0.js";import{B as S}from"./chunk-QUQL4437-EUh0k2Sg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B39quYzB.js";import"./i18n-CfOqn4nZ.js";import"./index-Bk_1Mjxr.js";import"./sheet-Q_yx1JUO.js";import"./index-DcVNmSmV.js";import"./x-DSPDcSor.js";import"./use-tenant-Cfm7aHlC.js";import"./api-D4WrX2Ug.js";import"./403-CR-QzuB-.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BW-ZcWxC.js";import"./main-navbar-lang-switcher--5ICBnep.js";import"./button-Bjl3P42F.js";import"./action-button-C7Rwv-R7.js";import"./dropdown-menu-abCbWXC_.js";import"./index-BxFSGfgl.js";import"./index-AnShAb8S.js";import"./check-DUGuR0C1.js";import"./circle-RRa7pUsB.js";import"./separator-CC9AvFe8.js";import"./spinner-DaAyvhPL.js";import"./rich-text-editor-3r_Ig5sc.js";import"./with-selector-DouIXjga.js";import"./toggle-BgSsHrcX.js";import"./popover-DMX6qJch.js";import"./input-B2-ilDsB.js";import"./label-DO7cBuUl.js";import"./underline-Dn8ZDBDF.js";import"./user-avatar-EOuD-mYa.js";import"./avatar-sVQpfDVJ.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BzsJ7RIs.js";import"./anchor-link-BAK9T0JK.js";import"./rich-text-viewer-CnRmZg9O.js";import"./date-C5QupdGd.js";import"./format-Dwk99mKl.js";import"./skeleton-ZCtiSdbX.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
