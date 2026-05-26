import{j as t}from"./iframe-UzZZM96I.js";import{h as p,H as y}from"./index-D3PW6uPH.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-yzgJlH6-.js";import{C as f,A as r}from"./applications-config-C04VUxYV.js";import{L as E}from"./notes-container-BA7dGceg.js";import{n as m,g as S}from"./api-notes-Bybw49sa.js";import{d as c}from"./delay-CKXeUJET.js";import{B as R}from"./chunk-UVKPFVEO-DM0BTXi2.js";import"./preload-helper-Dp1pzeXC.js";import"./api-tdfUFFl-.js";import"./index-DIXd3_X8.js";import"./sheet-BpKxpnw5.js";import"./index-Dx4Z3vli.js";import"./x-BqTFwZaJ.js";import"./i18n-DIReciWC.js";import"./button-BWuJ3ILY.js";import"./index-BRUfjbBU.js";import"./action-button-ZppnzVQS.js";import"./dropdown-menu-C5x8kC1L.js";import"./index-CvKgbFy1.js";import"./index-BhlzdYk0.js";import"./check-Dbn9Sbvo.js";import"./circle-CnVfFRjs.js";import"./separator-D16OPgLn.js";import"./spinner-CxFVrEQ_.js";import"./rich-text-editor-DvkY6taN.js";import"./toggle-BUG2PAUN.js";import"./popover-apmwcABE.js";import"./input-CZmZM7P6.js";import"./label-DVaYV4Xo.js";import"./underline-BvroCfXw.js";import"./single-avatar-B-0opr8M.js";import"./avatar-DGNbfxwC.js";import"./avatar.utils-Fpl7rb73.js";import"./hover-card-C9TuCPar.js";import"./rich-text-viewer-BYR-o1bH.js";import"./date-B7miXHZH.js";import"./format-eJu3MRBX.js";import"./skeleton-CBlVKJ-V.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
