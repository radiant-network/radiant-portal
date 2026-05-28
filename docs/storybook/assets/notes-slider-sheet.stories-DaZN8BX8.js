import{j as t}from"./iframe-CnZJoeJJ.js";import{h as p,H as y}from"./index-s4igxNLI.js";import{S as s}from"./api-ok7Ado9G.js";import{N as i}from"./notes-slider-sheet-ZeQk-b5D.js";import{C as f,A as r}from"./applications-config-CA5Ya-5E.js";import{L as E}from"./notes-container-BM7f_V78.js";import{n as m,g as S}from"./api-notes-DBEyfNVP.js";import{d as c}from"./delay-CPutIiJv.js";import{B as R}from"./chunk-UVKPFVEO-sCGE3aLV.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DyXFduvr.js";import"./index-nnISLG97.js";import"./sheet-DSUD6luU.js";import"./index-D9ryLKvp.js";import"./x-DdTkrJzs.js";import"./i18n-GxkGN4Zu.js";import"./button-Cm-qWUZj.js";import"./index-CCfIwpUx.js";import"./action-button-DwChNtIi.js";import"./dropdown-menu-DeZ0tcSb.js";import"./index-Cgb4Wh9n.js";import"./index-IcRN2maX.js";import"./check-CzTwhE4v.js";import"./circle-DchfHJD1.js";import"./separator-CsnJdABl.js";import"./spinner-WammLDvy.js";import"./rich-text-editor-B-qMX0sA.js";import"./toggle-BaodENMD.js";import"./popover-BwK63eY7.js";import"./input-CEUZJm7z.js";import"./label-DDT9tGO3.js";import"./underline-J5PUg2EB.js";import"./single-avatar-CAnHxYvG.js";import"./avatar-CGamhaIM.js";import"./avatar.utils-DicZHw7Z.js";import"./hover-card-TKSobLhg.js";import"./rich-text-viewer-COSagcgI.js";import"./date-DnkXYqg6.js";import"./format-C3nO4raY.js";import"./skeleton-DPeozCI6.js";const I={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},_e={title:"Notes/NotesSliderSheet",component:i,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[e=>t.jsx(R,{children:t.jsx(f,{config:I,children:t.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:t.jsx(e,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),S()))]}},render:e=>t.jsx(i,{...e})},o={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),S()))]}},args:{seqId:3},render:e=>t.jsx(i,{...e})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),y.json([])))]}},args:{seqId:4},render:e=>t.jsx(i,{...e})};var d,_,g;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
