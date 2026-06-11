import{j as e,a8 as g}from"./iframe-5hjCxaQ_.js";import{h as m}from"./index-fGIUz_G7.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-DTGJLFZU.js";import{C as l,A as t}from"./applications-config-CzXWmwjy.js";import{L as u}from"./notes-container-CVU2RAM-.js";import{n as p,g as _}from"./api-notes-DAVIGg9J.js";import{a as c}from"./story-section-Dz-VNK5b.js";import{d}from"./delay-DfLh6RFF.js";import{B as S}from"./chunk-QUQL4437-PW0-xcxl.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DR0nX1-y.js";import"./index-DwABPnsI.js";import"./sheet-CKMwOwq8.js";import"./index-Ct9zBHnP.js";import"./x-cqQ7vGF6.js";import"./i18n-BCVPTX9O.js";import"./button-BFdsQ3Kp.js";import"./index-526z61a1.js";import"./action-button-Cl-iR9-B.js";import"./dropdown-menu-BxaMWWIo.js";import"./index-NgiKxE6c.js";import"./index-DJkBUnxK.js";import"./check-DQDqWsNZ.js";import"./circle-D6MwNdjA.js";import"./separator-CdreFVRa.js";import"./spinner-Iif-h0Tq.js";import"./rich-text-editor-BsoB1Oi7.js";import"./toggle-CoaI0BNp.js";import"./popover-BSWOOXE3.js";import"./input-CmvY_rcH.js";import"./label-nLVE3ES4.js";import"./underline-vpJZ5WlK.js";import"./user-avatar-i4Ch274r.js";import"./avatar-BQLPh0lw.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-B16eRAQm.js";import"./rich-text-viewer-DoxA_KTL.js";import"./date-BqPoupRi.js";import"./format-CQRCws-N.js";import"./skeleton-Dv3AkMtm.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const se=["Default","Loading","Empty"];export{n as Default,s as Empty,a as Loading,se as __namedExportsOrder,ae as default};
