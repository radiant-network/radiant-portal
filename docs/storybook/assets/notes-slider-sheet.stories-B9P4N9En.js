import{j as e,ad as g}from"./iframe-CJwTE_QO.js";import{h as m}from"./index-CHmrhrxQ.js";import{S as o}from"./api-DxXkaL5r.js";import{N as i}from"./notes-slider-sheet-DFOukyUo.js";import{C as l,A as t}from"./applications-config-BVUWtLly.js";import{L as u}from"./notes-container-CAs3Xhwu.js";import{n as p,g as _}from"./api-notes-CkqPOAVG.js";import{a as c}from"./story-section-CeCnabVr.js";import{d}from"./delay-z6YPjs4B.js";import{B as S}from"./chunk-QUQL4437-Bp5L4Ct6.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Cd1dGipA.js";import"./i18n-CUSdW0Rx.js";import"./index-BKOy4Uli.js";import"./sheet-B8PM23qi.js";import"./index-vITuVBim.js";import"./x-BC3WFTOT.js";import"./use-tenant-Y8KtkJ5P.js";import"./api-BjHhlcVm.js";import"./button-ByIr39LF.js";import"./action-button-CQ4pQYUu.js";import"./dropdown-menu-B8L4Z_RM.js";import"./index-B21IwPkO.js";import"./index-BwqD7REl.js";import"./check-yhgl2byu.js";import"./circle-Do5ahLCh.js";import"./separator-Bp1EgoNF.js";import"./spinner-jTi6AzdQ.js";import"./rich-text-editor-B3lIImeU.js";import"./with-selector-Cbd9TgYs.js";import"./toggle-O2j60uQV.js";import"./popover-D_rHXz6y.js";import"./input-BWJ6onVF.js";import"./label-3yuFg4y2.js";import"./underline-BFYbrrAK.js";import"./user-avatar-vAB1Za16.js";import"./avatar-DlG38hcD.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-CaeKIZcF.js";import"./anchor-link-CEXhyPkz.js";import"./rich-text-viewer-BcFB2PjU.js";import"./date-BBqvuhTK.js";import"./format-auOk2of2.js";import"./skeleton-Bvbpfc6L.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
