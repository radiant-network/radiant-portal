import{j as e,ad as g}from"./iframe-BDYK6UvR.js";import{h as m}from"./index-bjEbbphn.js";import{S as o}from"./api-EcWoeBNP.js";import{N as i}from"./notes-slider-sheet-DqIUWncL.js";import{C as l,A as t}from"./applications-config-E939f-Wl.js";import{L as u}from"./notes-container-Ca1dYPQx.js";import{n as p,g as _}from"./api-notes-u03WFLqm.js";import{a as c}from"./story-section-FMAs1sHp.js";import{d}from"./delay-C5LsFA5b.js";import{B as S}from"./chunk-QUQL4437-FnWNOlwB.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cl0I9PGk.js";import"./i18n-DvEGfvD-.js";import"./index-C16L_Bj1.js";import"./sheet-I5gMTszO.js";import"./index-fywzTL9D.js";import"./x-tHk7glPu.js";import"./use-tenant-DjqJ7XG8.js";import"./api-LbIRQM0U.js";import"./button-B-L79fbv.js";import"./action-button-CdQlTKhi.js";import"./dropdown-menu-HkrpKjvg.js";import"./index-C87n2e9o.js";import"./index-B2uTVnY7.js";import"./check-mee2v7ix.js";import"./circle-CThf3Dtg.js";import"./separator-3qJkDnyN.js";import"./spinner-_yMskrI3.js";import"./rich-text-editor-Crx8krzN.js";import"./with-selector-vbAwXGhV.js";import"./toggle-C3usgfxn.js";import"./popover-8Po6Wjis.js";import"./input-Cy-aJqdJ.js";import"./label-CoZ0mBx7.js";import"./underline-BUoAx0O1.js";import"./user-avatar-DFv4laMV.js";import"./avatar-CXdA0VVQ.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-iE8hmlQ7.js";import"./anchor-link-B3t3Dpdr.js";import"./rich-text-viewer-h0T1UIdo.js";import"./date-CuUTq4CX.js";import"./format-BcqdjC5-.js";import"./skeleton-BKvEb3aE.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
