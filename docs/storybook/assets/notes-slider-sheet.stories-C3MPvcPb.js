import{j as e,ab as g}from"./iframe-BmQaEKqD.js";import{h as m}from"./index-B9hhcIm2.js";import{S as o}from"./api-5e3Wi7_0.js";import{N as i}from"./notes-slider-sheet-B1-GI0AK.js";import{C as l,A as t}from"./applications-config-C53CzKOB.js";import{L as u}from"./notes-container-CE0zw-yd.js";import{n as p,g as _}from"./api-notes-CH8SKLGe.js";import{a as c}from"./story-section-DmKrQ7pL.js";import{d}from"./delay-CkT9hny8.js";import{B as S}from"./chunk-QUQL4437-B9eNMz9d.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CF26VfEE.js";import"./i18n-DASwuS_h.js";import"./index-DPphhh4w.js";import"./sheet-CPA7OEIq.js";import"./index-zvJkX2V7.js";import"./x-DzXSs4iU.js";import"./use-tenant-UnVKd7jj.js";import"./api-CRUcq8iX.js";import"./button-Cwn9pdSz.js";import"./action-button-NcZ7v7jd.js";import"./dropdown-menu-D8OFOKsF.js";import"./index-0v-EdXCc.js";import"./index-DQAP5Woc.js";import"./check-ZuEG5tzj.js";import"./circle-BTNlC0Y1.js";import"./separator-lVIRd7xC.js";import"./spinner-SJaW15t8.js";import"./rich-text-editor-Pb3DNks3.js";import"./with-selector-r1dRompk.js";import"./toggle-r5xSt0GM.js";import"./popover-DQnibpe4.js";import"./input-tJHdttnj.js";import"./label-C7V_v3zb.js";import"./underline-S8ohCfmB.js";import"./user-avatar-CUB3gF3K.js";import"./avatar-CEEN3U8o.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-9ILy_s7w.js";import"./anchor-link-Dfl3iDg-.js";import"./rich-text-viewer-xFtW5DNw.js";import"./date-B8n3WJq3.js";import"./format-Dhf4Han1.js";import"./skeleton-BFvQNEDz.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
