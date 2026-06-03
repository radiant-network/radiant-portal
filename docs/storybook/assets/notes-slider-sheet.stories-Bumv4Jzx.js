import{j as e,a8 as g}from"./iframe-KxDQxQDs.js";import{h as m}from"./index-CmOdadIk.js";import{S as o}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-D7hN--4v.js";import{C as l,A as t}from"./applications-config-CEk3Qm2l.js";import{L as u}from"./notes-container-DScDqrzM.js";import{n as p,g as _}from"./api-notes-DF6FtcN7.js";import{a as c}from"./story-section-B6HdLg4-.js";import{d}from"./delay-DdT-DvkL.js";import{B as S}from"./chunk-QUQL4437-8rS0-6jZ.js";import"./preload-helper-PPVm8Dsz.js";import"./api-D41u6Dnf.js";import"./index-CPmIy41W.js";import"./sheet-ERtYqCJu.js";import"./index-DgojPt6N.js";import"./x-8Vd-H5Q8.js";import"./i18n-BnCxB2cP.js";import"./button-DcEb2QoR.js";import"./index-DL5skkIA.js";import"./action-button-zarxO1Cp.js";import"./dropdown-menu-BKe34Zcm.js";import"./index-Obe_1VFm.js";import"./index-C9Hzv6Cn.js";import"./check-OcLjUnTR.js";import"./circle-YicaXG0V.js";import"./separator-RpiEdedA.js";import"./spinner-wh_bthM6.js";import"./rich-text-editor-f4JgZVtR.js";import"./toggle-bhoBcHN9.js";import"./popover-OtDG5t1c.js";import"./input-BTQft5GN.js";import"./label-CC-sdX0i.js";import"./underline-D4PuXece.js";import"./user-avatar-Bko8Zck7.js";import"./avatar-DhFpFpKQ.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-7yPMR1CW.js";import"./rich-text-viewer-DhjH_RDF.js";import"./date-uBlPjZgh.js";import"./format-DGVKtktM.js";import"./skeleton-BDS1U2kz.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
