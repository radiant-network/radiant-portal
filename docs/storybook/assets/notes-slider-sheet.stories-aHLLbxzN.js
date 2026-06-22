import{j as e,ad as g}from"./iframe-CdF5EYmg.js";import{h as m}from"./index-DlbNcuff.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-UXOiwYgZ.js";import{C as l,A as t}from"./applications-config-2QMXSYav.js";import{L as u}from"./notes-container-UsiZNs5j.js";import{n as p,g as _}from"./api-notes-BjJSVMzY.js";import{a as c}from"./story-section-D4XYOw5I.js";import{d}from"./delay-DOx9Y2wd.js";import{B as S}from"./chunk-QUQL4437-CEaj0cJF.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BRruqAbc.js";import"./i18n-DK-5BTci.js";import"./index-Cp-tXBSJ.js";import"./sheet-MsEmLoaR.js";import"./index-DfQn6S-B.js";import"./x-Ka5G_vgD.js";import"./button-DAc04O7O.js";import"./action-button-B-isfSdX.js";import"./dropdown-menu-C0WhWNZB.js";import"./index-BBuEL3vt.js";import"./index-BViuv1GS.js";import"./check-DTlfPsbg.js";import"./circle-DBjNND0v.js";import"./separator-DtNz95I0.js";import"./spinner-Gswrxx1j.js";import"./rich-text-editor-yCaSautH.js";import"./with-selector-AfVKEoZ0.js";import"./toggle-CAUG45k6.js";import"./popover-B076zbmv.js";import"./input-7I5dAw3S.js";import"./label-BpIFLQV1.js";import"./underline-BNBxtWSl.js";import"./user-avatar-Di-Qgq4T.js";import"./avatar-ZSgeKK97.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-Bq2eIm9D.js";import"./anchor-link-WmGdnOZ3.js";import"./rich-text-viewer-CEihrz1Y.js";import"./date-CdcP65-c.js";import"./format-B0ZttnrE.js";import"./skeleton-BdSchkuJ.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},se={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const ie=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,ie as __namedExportsOrder,se as default};
