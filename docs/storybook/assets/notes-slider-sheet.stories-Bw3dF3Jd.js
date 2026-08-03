import{j as e,ag as g}from"./iframe-_3pDU_m1.js";import{h as m}from"./index-C4xy9ce3.js";import{S as o}from"./api-BIpRWWq8.js";import{N as i}from"./notes-slider-sheet-D-WbkCmn.js";import{C as l,A as t}from"./applications-config-DizvBihq.js";import{L as u}from"./notes-container-DphqdKkV.js";import{n as p,g as _}from"./api-notes-BkMEGR_o.js";import{a as c}from"./story-section-9tet9DgD.js";import{d}from"./delay-ejhlUXGT.js";import{B as S}from"./chunk-QUQL4437-d4PiYMsh.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B4sJkqS6.js";import"./i18n-DIfamP6U.js";import"./index-D93W_M_b.js";import"./sheet-C8wBsBIU.js";import"./index-DSZtqkGG.js";import"./x-5OkV8dD4.js";import"./use-tenant-BOr68fwC.js";import"./api-BkktyXdT.js";import"./403-u67hT6it.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BTbLxMxW.js";import"./main-navbar-lang-switcher-DcrTIoCT.js";import"./button-B7AkeCKU.js";import"./action-button-BLggGiKX.js";import"./dropdown-menu-DkZCJalM.js";import"./index-BKRaFSoB.js";import"./index-7oRQ5vhD.js";import"./check-DZQ1hz2N.js";import"./circle-B6SE5RnA.js";import"./separator-CIL6Up82.js";import"./spinner-CKkzgO2s.js";import"./rich-text-editor-VtVmWE0t.js";import"./with-selector-C0zJBQzn.js";import"./toggle-DwHUgtz8.js";import"./popover-DKYSjZY8.js";import"./input-7KRj1inv.js";import"./label-C7drXKr7.js";import"./underline-mcJzmHgt.js";import"./user-avatar-D_PRz8qx.js";import"./avatar-DRQtuNC_.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-C86Z9vnK.js";import"./anchor-link-X_NmIQ4s.js";import"./rich-text-viewer-DzW4kczm.js";import"./date-4z9UJ4dE.js";import"./format-DCgBXnn9.js";import"./skeleton-BgQ_oooK.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
