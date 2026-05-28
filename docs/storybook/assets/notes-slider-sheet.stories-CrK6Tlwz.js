import{j as t}from"./iframe-g_rM03WD.js";import{h as p,H as y}from"./index-D76JSZ7j.js";import{S as s}from"./api-Bvp-Hr8F.js";import{N as i}from"./notes-slider-sheet-BdCBg0Z2.js";import{C as f,A as r}from"./applications-config-CxBrIv9L.js";import{L as E}from"./notes-container-hPC7JsLw.js";import{n as m,g as S}from"./api-notes-asvKjf6A.js";import{d as c}from"./delay-BpsWHYvI.js";import{B as R}from"./chunk-UVKPFVEO-DHXqeU7Z.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CKdnRKzk.js";import"./index-HzBRMg_2.js";import"./sheet-CDAblaEj.js";import"./index-D5TSYI9a.js";import"./x-Dkdgqspm.js";import"./i18n-A89o1_Ry.js";import"./button-DyjUiMpD.js";import"./index-C5nHNu5V.js";import"./action-button-firnxveF.js";import"./dropdown-menu-C8dl2V8Q.js";import"./index-B4C9r0pW.js";import"./index-CiJ_Won9.js";import"./check-Cn-MPm-h.js";import"./circle-CWj6cztr.js";import"./separator-0OwIr9F3.js";import"./spinner-BPjplS8_.js";import"./rich-text-editor-DyoiWNru.js";import"./toggle-r6gWxTyY.js";import"./popover-BIf4FZKu.js";import"./input-DFCLJf90.js";import"./label-CbDGEezo.js";import"./underline-8KYyErAd.js";import"./single-avatar-D3kkUK9K.js";import"./avatar-UKPMA91K.js";import"./avatar.utils-wijqD0Sd.js";import"./hover-card-Dws2k_FR.js";import"./rich-text-viewer-Ckc_RzXd.js";import"./date-BuH4-9A-.js";import"./format-CNoodgJv.js";import"./skeleton-DtYRL2lA.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
