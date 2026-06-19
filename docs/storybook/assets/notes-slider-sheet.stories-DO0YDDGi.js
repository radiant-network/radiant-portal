import{j as e,aa as g}from"./iframe-jcf7vZ_R.js";import{h as m}from"./index-BiD-JOhD.js";import{S as o}from"./api-C5s-SBNp.js";import{N as i}from"./notes-slider-sheet-z1gVa8N0.js";import{C as l,A as t}from"./applications-config-CrN8ifR1.js";import{L as u}from"./notes-container-BYUuED5t.js";import{n as p,g as _}from"./api-notes-CbvU1Af5.js";import{a as c}from"./story-section-Cpqu6Cmt.js";import{d}from"./delay-BO6BGdFV.js";import{B as S}from"./chunk-QUQL4437-NFsSyaH3.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BN29XHyi.js";import"./index-B7ISGQ50.js";import"./index-CMj8FLxF.js";import"./sheet-Ca8ryc6r.js";import"./index-DWACBEUd.js";import"./x-CsZYw6Ul.js";import"./i18n-TdHrRC51.js";import"./button-Bifjei_v.js";import"./index-z6U6JLum.js";import"./action-button-i99sGQY1.js";import"./dropdown-menu-HcH6XyTZ.js";import"./index-mGHp8w0J.js";import"./index-DCUZMTcN.js";import"./check-DnaYg78d.js";import"./circle-CbUZSSHN.js";import"./separator-etdbqUam.js";import"./spinner-BR2DyFuV.js";import"./rich-text-editor-BPiKXp8d.js";import"./with-selector-C0wh6ev4.js";import"./toggle-CcHt0pqq.js";import"./popover-B17-J3b5.js";import"./input-CWzWdN3F.js";import"./label-C3r2BlYL.js";import"./underline-YqX6x1qh.js";import"./user-avatar-DaXKis-i.js";import"./avatar-CAhGC5O5.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-DDKC1EVg.js";import"./anchor-link-BYK_i9Of.js";import"./rich-text-viewer-ByrYCEN_.js";import"./date-D1ZESiCA.js";import"./format-CE6snWN5.js";import"./skeleton-Dh6-RIZO.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},me={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const pe=["Default","Loading","Empty"];export{a as Default,s as Empty,n as Loading,pe as __namedExportsOrder,me as default};
