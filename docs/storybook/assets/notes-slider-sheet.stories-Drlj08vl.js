import{j as e,ad as g}from"./iframe-x0eT-xyE.js";import{h as m}from"./index-MDABB6Dl.js";import{S as o}from"./api-EcWoeBNP.js";import{N as i}from"./notes-slider-sheet-lqlNN9cR.js";import{C as l,A as t}from"./applications-config-C4TDF07c.js";import{L as u}from"./notes-container-bb_62hO3.js";import{n as p,g as _}from"./api-notes-D4mZ262e.js";import{a as c}from"./story-section-B-UwUZjU.js";import{d}from"./delay-yVNDWB-p.js";import{B as S}from"./chunk-QUQL4437-BkwlIvAv.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BUGZ6WPd.js";import"./i18n-ETpqMXvg.js";import"./index-DFPPf6dC.js";import"./sheet-Dzgo8qok.js";import"./index-CjK4zf9t.js";import"./x-DVu1g7Yb.js";import"./use-tenant-Do1Cm8JO.js";import"./api-LbIRQM0U.js";import"./button-DKCq0MjW.js";import"./action-button-BSoyb7Vm.js";import"./dropdown-menu-B_gNLwrH.js";import"./index-dE50l6Wk.js";import"./index-Ol_TykaS.js";import"./check-C2XjndMj.js";import"./circle-B80l30cz.js";import"./separator-Da2YlRWj.js";import"./spinner-uj2mALQE.js";import"./rich-text-editor-Dv6TLgLT.js";import"./with-selector-BgQPLf4b.js";import"./toggle-FjPGq1c-.js";import"./popover-CVbvMQOt.js";import"./input-BUsSqvEc.js";import"./label-UxOfftzp.js";import"./underline-B0ACVAfo.js";import"./user-avatar-CzTkOEpS.js";import"./avatar-Cd2CjVNW.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BI1oiLZ7.js";import"./anchor-link-CdZGig-E.js";import"./rich-text-viewer-Bi5zthPS.js";import"./date-Dq2iC9vX.js";import"./format-CJfV15lE.js";import"./skeleton-kTUcZWj-.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
