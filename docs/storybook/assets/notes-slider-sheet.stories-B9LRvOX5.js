import{j as e}from"./iframe-GdxnesVn.js";import{h as i,H as S}from"./index-Hy8dHOKY.js";import{N as n}from"./notes-slider-sheet-BeRACna_.js";import{C as j,A as t}from"./applications-config-BKnXAE14.js";import{L as x}from"./notes-container-Br3o54wd.js";import{n as m,g as w}from"./api-notes-CvI5RTeR.js";import{d as p}from"./delay-DxaevPtx.js";import{B as L}from"./chunk-UVKPFVEO-DmnjYX4q.js";import"./preload-helper-Dp1pzeXC.js";import"./api-Dv-D8lFH.js";import"./index-BtVIboGS.js";import"./api-QmR3WP_i.js";import"./sheet-DNN40A0K.js";import"./index-eUK2Rryx.js";import"./x-BiI2aFGl.js";import"./i18n-DzmMPxCa.js";import"./button-ClPsGv-5.js";import"./index-CCfaDUsQ.js";import"./action-button-DdwRbbYb.js";import"./dropdown-menu-Bt4yU2yO.js";import"./index-lbgyfsZT.js";import"./index-CohetcGb.js";import"./check-83bVRx4O.js";import"./circle-vuLCNpQ4.js";import"./separator-BeWp1rgn.js";import"./spinner-Bt5m2YHI.js";import"./rich-text-editor-5EUEC8qr.js";import"./toggle-DuMP_hb3.js";import"./popover-CPeYGo9v.js";import"./input-DOfCsDEw.js";import"./label-P9_Lcewp.js";import"./underline-NkShAbMo.js";import"./single-avatar-DhZO_qki.js";import"./avatar-DT6-fkef.js";import"./avatar.utils-BM9bevqO.js";import"./hover-card-CkEBySaI.js";import"./rich-text-viewer-O8pKHT-K.js";import"./date-CHYPQXl4.js";import"./format-XEWUsUf5.js";import"./skeleton-C9LrNl4S.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSliderSheet {...args} />
}`,...(g=(d=s.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var l,u,h;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(h=(u=o.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var _,y,f;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(f=(y=a.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const gr=["Default","Loading","Empty"];export{s as Default,a as Empty,o as Loading,gr as __namedExportsOrder,dr as default};
