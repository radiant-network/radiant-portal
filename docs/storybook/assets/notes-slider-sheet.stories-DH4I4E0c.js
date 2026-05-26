import{j as t}from"./iframe-BMmvtocU.js";import{h as p,H as y}from"./index-DZrBA7M6.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-B5vNY35Q.js";import{C as f,A as r}from"./applications-config-BeMSSwup.js";import{L as E}from"./notes-container-u-QqoVcA.js";import{n as m,g as S}from"./api-notes-ZV1KchEt.js";import{d as c}from"./delay-DMyjfLap.js";import{B as R}from"./chunk-UVKPFVEO-DGZ2lJlk.js";import"./preload-helper-Dp1pzeXC.js";import"./api-B57KDXZZ.js";import"./index-BnWb3yN2.js";import"./sheet-HT8RuRHt.js";import"./index-DDvob7as.js";import"./x-DyklLSqf.js";import"./i18n-BJ1E6iAL.js";import"./button-BgN65zCs.js";import"./index-BAUOvQzI.js";import"./action-button-CnEND6xO.js";import"./dropdown-menu-Dzp6mXEX.js";import"./index-CQojPjL1.js";import"./index-BBNMNgiS.js";import"./check-B-1euD6L.js";import"./circle-B83bx6JB.js";import"./separator-BAKSPgpP.js";import"./spinner-CUuD9Xtm.js";import"./rich-text-editor-BFz99qkt.js";import"./toggle-DkxZvqmt.js";import"./popover-DSj-VifV.js";import"./input-2JOvxn-r.js";import"./label-CqANzecn.js";import"./underline-DtmsNO4x.js";import"./single-avatar-vr2KbDm6.js";import"./avatar-D8DRGO8u.js";import"./avatar.utils-CByJYe5v.js";import"./hover-card-BRCI6QPi.js";import"./rich-text-viewer-DcLKhMEm.js";import"./date--zidW9X2.js";import"./format-41iDZ0q3.js";import"./skeleton-BhUZz6Mt.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
