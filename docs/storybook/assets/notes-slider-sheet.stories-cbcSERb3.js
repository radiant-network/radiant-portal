import{j as e,ad as g}from"./iframe-Bl6A8JHh.js";import{h as m}from"./index-DnucU2v0.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-BH-ZBs6d.js";import{C as l,A as t}from"./applications-config-IUrzjtem.js";import{L as u}from"./notes-container-DgHoqY6l.js";import{n as p,g as _}from"./api-notes-CHVjG-Po.js";import{a as c}from"./story-section-Buu6OzgL.js";import{d}from"./delay-Dpcfxxbv.js";import{B as S}from"./chunk-QUQL4437-BWpyoHQN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CUWZ69Sp.js";import"./i18n-CU5lE6mY.js";import"./index-EbWQjguD.js";import"./sheet-Cw525Vi8.js";import"./index-oaMoOequ.js";import"./x-CPOpEMiU.js";import"./use-tenant-D4d-d1lx.js";import"./api-BjHhlcVm.js";import"./button-CtPLaqJS.js";import"./action-button-YErJw3iJ.js";import"./dropdown-menu-B_s2SHH-.js";import"./index-LoDBT14K.js";import"./index-D7r_obL0.js";import"./check-unQJhoTi.js";import"./circle-BRirejCk.js";import"./separator-C0nFDG4e.js";import"./spinner-DW1lbzGE.js";import"./rich-text-editor-DY4bJ42a.js";import"./with-selector-PIaAeJdc.js";import"./toggle-BUJ3n9nX.js";import"./popover-HC32ocFi.js";import"./input-D0PRAIuy.js";import"./label-DA7PVQJW.js";import"./underline-DuaC6_RQ.js";import"./user-avatar-Cw1q8bq5.js";import"./avatar-Bgbl8cJ_.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-B0dXJQeN.js";import"./anchor-link-DYfh5J6C.js";import"./rich-text-viewer-BBcjVNZQ.js";import"./date-CO4V2h5o.js";import"./format-DA6pFlu4.js";import"./skeleton-tXG1-Wzm.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
