import{j as e,a8 as g}from"./iframe-B_cUq_Z_.js";import{h as m}from"./index-Co1zSUVJ.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet--MohUXiL.js";import{C as l,A as t}from"./applications-config-B_8aquWO.js";import{L as u}from"./notes-container-Bfx5pibj.js";import{n as p,g as _}from"./api-notes-DrFx3dxa.js";import{a as c}from"./story-section-ClDCqoX4.js";import{d}from"./delay-DvW7W-2m.js";import{B as S}from"./chunk-QUQL4437-DuyGLUAa.js";import"./preload-helper-PPVm8Dsz.js";import"./api-D0G0Ywfn.js";import"./index-CRHX0MN7.js";import"./sheet-vWtLFKt-.js";import"./index-BNWV2dUc.js";import"./x-BMqHCxKs.js";import"./i18n-y5n1cA5u.js";import"./button-D0XB-Gvv.js";import"./index-Bd4j15Rn.js";import"./action-button-B_DYhR_Z.js";import"./dropdown-menu-DW18XKtK.js";import"./index--VPkyeI8.js";import"./index-Bs7sbtKD.js";import"./check-Co9nfzYN.js";import"./circle-D2PEC1dM.js";import"./separator-BpM3i5JH.js";import"./spinner-DXSrfHqX.js";import"./rich-text-editor-Dnn6VeTu.js";import"./toggle-BMUnR4ZM.js";import"./popover-CLYP1dW3.js";import"./input-DXai4oDK.js";import"./label-CWvKwiGG.js";import"./underline-Bcz_7PMN.js";import"./user-avatar-B9E4T2ps.js";import"./avatar-D7zzSgHP.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CpUH8_a0.js";import"./anchor-link-CC3BKZhn.js";import"./rich-text-viewer-DY7WXV1I.js";import"./date-DeL8O54Q.js";import"./format-CX6d4T8Q.js";import"./skeleton-du8NMDDw.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},se={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
