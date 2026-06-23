import{j as e,ad as g}from"./iframe-CUHTCraV.js";import{h as m}from"./index-COOt3gV6.js";import{S as o}from"./api-EcWoeBNP.js";import{N as i}from"./notes-slider-sheet-DV9fi9Me.js";import{C as l,A as t}from"./applications-config-hZ36acRU.js";import{L as u}from"./notes-container-C689Uz_7.js";import{n as p,g as _}from"./api-notes-1SMYxOCN.js";import{a as c}from"./story-section-B5jupzCR.js";import{d}from"./delay-ChY_chCC.js";import{B as S}from"./chunk-QUQL4437-CXCbdMIU.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CwGeJV9O.js";import"./i18n-CvIos0gf.js";import"./index-DpmgubW-.js";import"./sheet-CCYFX4Rj.js";import"./index-BChg1QB5.js";import"./x-CGOJ5MUH.js";import"./use-tenant-CSTecYKl.js";import"./api-LbIRQM0U.js";import"./button-CZjHTKQy.js";import"./action-button-CdHWYpUk.js";import"./dropdown-menu-IpbMOAkX.js";import"./index-Cvvrdsfd.js";import"./index-Dd0IXZ1B.js";import"./check-DnkkXyPO.js";import"./circle-CpDNkknX.js";import"./separator-Cfebd5mI.js";import"./spinner-DGXeMxLl.js";import"./rich-text-editor-C1oUkfhP.js";import"./with-selector-Bj1dbq41.js";import"./toggle-DVUNnKES.js";import"./popover-C_TEclPO.js";import"./input-BF2Ib3mk.js";import"./label-DzikIB7o.js";import"./underline-BI5IDYFG.js";import"./user-avatar-CFRpqpF7.js";import"./avatar-CbyYYNEz.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-BO_kSw34.js";import"./anchor-link-wiRIufci.js";import"./rich-text-viewer-CdKU4N6H.js";import"./date-CWGFNIpz.js";import"./format-D3YVrkJ2.js";import"./skeleton-D_hJKoMU.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
