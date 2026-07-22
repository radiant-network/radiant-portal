import{j as e,ad as g}from"./iframe-BZB1EZgz.js";import{h as m}from"./index-CTvBQX0k.js";import{S as o}from"./api-D36EIwoJ.js";import{N as i}from"./notes-slider-sheet-DUykJ-W3.js";import{C as l,A as t}from"./applications-config-Dhcm9CTZ.js";import{L as u}from"./notes-container-Eu4O05C2.js";import{n as p,g as _}from"./api-notes-Dm7Ns2dx.js";import{a as c}from"./story-section-BDrkXYOE.js";import{d}from"./delay-BJqvP17Y.js";import{B as S}from"./chunk-QUQL4437-J1g7m8io.js";import"./preload-helper-PPVm8Dsz.js";import"./index-dDTSyc7s.js";import"./i18n-CQ0WOrKs.js";import"./index-B0w-Ttvh.js";import"./sheet-DPgPFuz0.js";import"./index-CpLG6wHe.js";import"./x-LwuAy0Kk.js";import"./use-tenant-v6jBTy8h.js";import"./api-BKer6Fgf.js";import"./403-DSnqBtKP.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CxU2bW_8.js";import"./main-navbar-lang-switcher-BG69NrFp.js";import"./button-D8HFhMXd.js";import"./action-button-DqxIOjdS.js";import"./dropdown-menu-C1MQh_QQ.js";import"./index-CA8vCrAG.js";import"./index-DjZJgZTe.js";import"./check-HFbzKaow.js";import"./circle-Dh8DU7_a.js";import"./separator-CcqX_m5t.js";import"./spinner-CbmXgZwB.js";import"./rich-text-editor-4GK7HdR5.js";import"./with-selector-CO_sIHjc.js";import"./toggle-LdPmBjXp.js";import"./popover-MiFNknac.js";import"./input-n9l0LaJt.js";import"./label-Fj5P-8Ic.js";import"./underline-ubvUfXkE.js";import"./user-avatar-Ik9R9gQj.js";import"./avatar-DlN4pQPc.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-C64kJqUs.js";import"./anchor-link-BRClO4mH.js";import"./rich-text-viewer-Dq3kxgqD.js";import"./date-hoR-4NQy.js";import"./format-DOFVEwZo.js";import"./skeleton-DHJgqS_q.js";const y={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},_e={title:"Features/Notes/Notes Slider Sheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(l,{config:y,children:e.jsx(u,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),_()))]}},render:r=>e.jsx(c,{title:"Default",children:e.jsx(i,{...r})})},a={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e4),_()))]}},args:{seqId:3},render:r=>e.jsx(c,{title:"Loading",children:e.jsx(i,{...r})})},s={parameters:{msw:{handlers:[m.get(p,async()=>(await d(1e3),g.json([])))]}},args:{seqId:4},render:r=>e.jsx(c,{title:"Empty",children:e.jsx(i,{...r})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
