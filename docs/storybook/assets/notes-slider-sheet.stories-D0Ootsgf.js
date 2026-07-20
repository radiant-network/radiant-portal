import{j as e,ad as g}from"./iframe-DVxP0arQ.js";import{h as m}from"./index-C2abPeK_.js";import{S as o}from"./api-D36EIwoJ.js";import{N as i}from"./notes-slider-sheet-D3DQzGZl.js";import{C as l,A as t}from"./applications-config-BIjrHPLj.js";import{L as u}from"./notes-container-DkvhysaR.js";import{n as p,g as _}from"./api-notes-Br38-yqB.js";import{a as c}from"./story-section-BtKKXoKS.js";import{d}from"./delay-B2e8rY0-.js";import{B as S}from"./chunk-QUQL4437-CKxXuzYq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CsTUvzcu.js";import"./i18n-U8mL1TZy.js";import"./index-DXeCl3bV.js";import"./sheet-DidMZmO8.js";import"./index-C3TkQBfY.js";import"./x-Bp479bDP.js";import"./use-tenant-mahC1-sF.js";import"./api-BKer6Fgf.js";import"./button-HLKZGIIG.js";import"./action-button-BE9ZLPWr.js";import"./dropdown-menu-Bdlhi6VJ.js";import"./index-U50s1qQV.js";import"./index-CrmWKYFO.js";import"./check-DnDcPfKb.js";import"./circle-hliijJXo.js";import"./separator-Bx5E3IZe.js";import"./spinner-CGTH_3ua.js";import"./rich-text-editor-D1f8jZaC.js";import"./with-selector-DnGGJoBk.js";import"./toggle-CGq3fUZT.js";import"./popover-CphWAqxn.js";import"./input-CEDgBxMH.js";import"./label-BxVuC17B.js";import"./underline-BoZxZHUf.js";import"./user-avatar-DA_vpWAj.js";import"./avatar-Dfk6xYgW.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-B1Q7Nbe9.js";import"./anchor-link-BCXlWpvC.js";import"./rich-text-viewer-BGZjyvvo.js";import"./date-Crc0YYBT.js";import"./format-Bnq383qP.js";import"./skeleton-BGl1Di7-.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
