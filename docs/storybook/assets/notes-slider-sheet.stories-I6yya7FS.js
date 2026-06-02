import{j as t,aa as _}from"./iframe-X1FdiBKE.js";import{h as p}from"./index-DnTwByf3.js";import{S as a}from"./api-CNFUPySA.js";import{N as i}from"./notes-slider-sheet-DmHsqx15.js";import{C as g,A as r}from"./applications-config-1HIrnDDl.js";import{L as l}from"./notes-container-DWgWAZni.js";import{n as m,g as d}from"./api-notes-CpSHtMz8.js";import{d as c}from"./delay-CSnyUfke.js";import{B as u}from"./chunk-QUQL4437-BfEK6Nzn.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DxzlR9wx.js";import"./index-BoMd93ow.js";import"./sheet-BSQUYgK5.js";import"./index-Br2dHtqR.js";import"./x-CT6RiXhO.js";import"./i18n-DsLlobA0.js";import"./button-C1dmQasv.js";import"./index-BerhZw8G.js";import"./action-button-D2HkTc1A.js";import"./dropdown-menu-B8dOc9pX.js";import"./index-DnCxSPBU.js";import"./index-DfO9iG95.js";import"./check-CpvZoXR-.js";import"./circle-C0x1jrVb.js";import"./separator-BcF0hBxw.js";import"./spinner-CBc_syXT.js";import"./rich-text-editor-CM4HKn7I.js";import"./toggle-DGXLAReZ.js";import"./popover-DItXSvlx.js";import"./input-DnrAC2PS.js";import"./label-ATUx-zoR.js";import"./underline-C6f1kInU.js";import"./single-avatar-CRO6_hgD.js";import"./avatar-Bkg1-qcJ.js";import"./avatar.utils-CeqlBO5q.js";import"./hover-card-BC8-Tqya.js";import"./rich-text-viewer-D9_0-nOz.js";import"./date-l58CrH3w.js";import"./format-D12HlaGj.js";import"./skeleton-UMhyrLm4.js";const C={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(u,{children:t.jsx(g,{config:C,children:t.jsx(l,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),d()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),d()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),_.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
