import{j as e}from"./iframe-CDEQG5Fm.js";import{h as i,H as S}from"./index-DZyA-Aqz.js";import{N as n}from"./notes-slider-sheet-BjE1mQoI.js";import{C as j,A as t}from"./applications-config-Dr-Uyo5B.js";import{L as x}from"./notes-container-DGC15HDv.js";import{n as m,g as w}from"./api-notes-qML-SU-V.js";import{d as p}from"./delay-DHSqMET4.js";import{B as L}from"./chunk-UVKPFVEO-Cgjsae7h.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CgPEoEKu.js";import"./index-CI53Q_5X.js";import"./api-CyFX6UkQ.js";import"./sheet-BY5-y9a7.js";import"./index-DJ6Vg55a.js";import"./x-CtYnryvp.js";import"./i18n-D3vdfF7Y.js";import"./button-DF7fu547.js";import"./index-C8xu4Cyg.js";import"./action-button-NEINex3-.js";import"./dropdown-menu-CbP8MDIw.js";import"./index-yycurVCY.js";import"./index-DPietwaT.js";import"./check-D48Ebu-n.js";import"./circle-BqtF_CMq.js";import"./separator-uj9S4p4y.js";import"./spinner-BjCt4iyt.js";import"./rich-text-editor-CMXBGxeo.js";import"./toggle-BeiPQGeX.js";import"./underline-BgWj9QZQ.js";import"./single-avatar-Cq36gOL_.js";import"./avatar-B1lromK_.js";import"./avatar.utils-ChcjufhM.js";import"./hover-card-7RE6fFzP.js";import"./rich-text-viewer-C-4hH3ao.js";import"./date-CeS3qB3f.js";import"./format-CB6JIhIq.js";import"./skeleton-v2y80y7B.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},mr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSliderSheet {...args} />
}`,...(g=(d=s.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var l,u,h;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var _,y,f;o.parameters={...o.parameters,docs:{...(_=o.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(f=(y=o.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const pr=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,pr as __namedExportsOrder,mr as default};
