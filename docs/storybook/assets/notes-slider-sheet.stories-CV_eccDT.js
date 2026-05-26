import{j as t}from"./iframe-Bgs5NfMc.js";import{h as p,H as y}from"./index-Dcr7ZxvS.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-Cv2qTMED.js";import{C as f,A as r}from"./applications-config-DpNkC7dN.js";import{L as E}from"./notes-container-GmSGkBYw.js";import{n as m,g as S}from"./api-notes-C8nIwXCN.js";import{d as c}from"./delay-C4-cg6my.js";import{B as R}from"./chunk-UVKPFVEO-CRbJO2wE.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BW9qMtCP.js";import"./index-Dn6zDDU-.js";import"./sheet-DdbtD9Ah.js";import"./index-mons5guB.js";import"./x-Pr3BRuzX.js";import"./i18n-CYz5bEHL.js";import"./button-CrOv1Hyb.js";import"./index-s_Ex46g1.js";import"./action-button-BfUGb17Q.js";import"./dropdown-menu-BcUk9WuL.js";import"./index-DMNztzep.js";import"./index-CaPft0NF.js";import"./check-Dg4oD1eq.js";import"./circle-DsTHFdGH.js";import"./separator-BUulNCgX.js";import"./spinner-e4u7fk4w.js";import"./rich-text-editor-iUlmOHXX.js";import"./toggle-BTX9tQmc.js";import"./popover-DiqU69uk.js";import"./input-BTg8QvXA.js";import"./label-Df420SS-.js";import"./underline--GqhelIc.js";import"./single-avatar-LiuwWv_a.js";import"./avatar-CR5-E0uD.js";import"./avatar.utils-q99DQ9pW.js";import"./hover-card-DZRTjh09.js";import"./rich-text-viewer-BvDj8k29.js";import"./date-DyOe1z4K.js";import"./format-BKDUG5IP.js";import"./skeleton-DoETWnAN.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
