import{j as t}from"./iframe-cY3pXf19.js";import{h as p,H as y}from"./index-eSsGO8Be.js";import{S as s}from"./api-Bvp-Hr8F.js";import{N as i}from"./notes-slider-sheet-DAIOGpe3.js";import{C as f,A as r}from"./applications-config-CP6Ccwmp.js";import{L as E}from"./notes-container-DpW7X5nm.js";import{n as m,g as S}from"./api-notes-CJ1PIKuB.js";import{d as c}from"./delay-Bmunp4nZ.js";import{B as R}from"./chunk-UVKPFVEO-BmPkzAz6.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BEB0gx6C.js";import"./index-CAIH9J8z.js";import"./sheet-CDkXv2uk.js";import"./index-Cog0jUw8.js";import"./x-o5D23MWi.js";import"./i18n-CBBeQjuA.js";import"./button--Wtedmo9.js";import"./index-l2hVhD8x.js";import"./action-button-Dnm389NF.js";import"./dropdown-menu-C90hvEAS.js";import"./index-CzsD47ag.js";import"./index-lW8L5n2K.js";import"./check-DA24y2Ls.js";import"./circle-Cm-azYNc.js";import"./separator-CVW8e8v-.js";import"./spinner-BfhBfTr7.js";import"./rich-text-editor-vi3U6AAk.js";import"./toggle-BNYFU7TV.js";import"./popover-D6-J2GbD.js";import"./input-r4JPrhMY.js";import"./label-DrlcwK10.js";import"./underline-C5ZIoKrx.js";import"./single-avatar-CNT9dGXz.js";import"./avatar-B5hqjj5E.js";import"./avatar.utils-DxQUOKt-.js";import"./hover-card-BBgMHLqx.js";import"./rich-text-viewer-DAZJM1BY.js";import"./date-D63jyWmg.js";import"./format-Ctf3XGHk.js";import"./skeleton-B96lg7Gc.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSliderSheet {...args} />
}`,...(g=(_=a.parameters)==null?void 0:_.docs)==null?void 0:g.source}}};var l,u,C;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(C=(u=o.parameters)==null?void 0:u.docs)==null?void 0:C.source}}};var N,h,v;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
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
}`,...(v=(h=n.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};const ge=["Default","Loading","Empty"];export{a as Default,n as Empty,o as Loading,ge as __namedExportsOrder,_e as default};
