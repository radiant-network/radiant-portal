import{j as t,aa as _}from"./iframe-Cmiex3IG.js";import{h as p}from"./index-DsgVPzw1.js";import{S as a}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-CmEZcVRm.js";import{C as g,A as r}from"./applications-config-BEWoMBeD.js";import{L as l}from"./notes-container-Cd2IVcP1.js";import{n as m,g as d}from"./api-notes-QmGDI8KI.js";import{d as c}from"./delay-rbjIet9j.js";import{B as u}from"./chunk-QUQL4437-s57FPwL9.js";import"./preload-helper-PPVm8Dsz.js";import"./api-qKCDbmki.js";import"./index-QN_ZCD1V.js";import"./sheet-B3ZsQmuM.js";import"./index-DsAkQrmS.js";import"./x-COuduTWL.js";import"./i18n-BtP9BP9x.js";import"./button-DRstk-W3.js";import"./index-bnaEmcFS.js";import"./action-button-bPFBQAma.js";import"./dropdown-menu-BUNcBeqG.js";import"./index-OjUxLgF4.js";import"./index-nnPp2JKR.js";import"./check-BHUZAyPW.js";import"./circle-CZF_B4Vk.js";import"./separator-VLxmM7Q3.js";import"./spinner-DXinLfFk.js";import"./rich-text-editor-D2Z-Zu2l.js";import"./toggle-Cj08HMTg.js";import"./popover-D0fTgJi_.js";import"./input-CFbeDT2i.js";import"./label-UpUCEQSt.js";import"./underline-CCsGW6m3.js";import"./user-avatar-CDVowrqx.js";import"./avatar-CAbJY0u8.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-QIodBA2B.js";import"./rich-text-viewer-BFS-uyV-.js";import"./date-h3ZxJ6H4.js";import"./format-BODX5eoa.js";import"./skeleton-BpbtEim3.js";const C={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(u,{children:t.jsx(g,{config:C,children:t.jsx(l,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),d()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),d()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),_.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSliderSheet {...args} />
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
  render: args => <NotesSliderSheet {...args} />
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
  render: args => <NotesSliderSheet {...args} />
}`,...n.parameters?.docs?.source}}};const se=["Default","Loading","Empty"];export{s as Default,n as Empty,o as Loading,se as __namedExportsOrder,ae as default};
