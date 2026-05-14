import{j as r}from"./iframe-DeKw-nIV.js";import{h as i,H as S}from"./index-CPL9Zhg-.js";import{N as n}from"./notes-slider-sheet-BUpKySi1.js";import{C as j,A as t}from"./applications-config-CKb0_Frd.js";import{L as x}from"./notes-container-Dbk7L71L.js";import{n as m,g as w}from"./api-notes-D7mTz3NF.js";import{d as p}from"./delay-Di5Y0Lpl.js";import{B as L}from"./chunk-UVKPFVEO-FCwFwGHF.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CtnQogXC.js";import"./index-BrEhmrN0.js";import"./api-Bs_y-PxM.js";import"./sheet-d3LfjV-1.js";import"./index-Cff9uMrt.js";import"./x-IkYcDYKN.js";import"./i18n-CuS2SDu1.js";import"./button-DmYWs-9e.js";import"./index-DNch3_Hw.js";import"./action-button-Bn69vsYA.js";import"./dropdown-menu-DP_hibKV.js";import"./index-CwBVuKgx.js";import"./circle-DgmccrFP.js";import"./check-_EMQkN7K.js";import"./separator-DZ_gh3Vb.js";import"./spinner-HqcDKjWR.js";import"./rich-text-editor-DyZJiHEI.js";import"./toggle-DXK-QTO5.js";import"./single-avatar-CXCRf_Nt.js";import"./avatar-J2edKO_S.js";import"./avatar.utils-CRuTauFb.js";import"./hover-card-ut512WFo.js";import"./rich-text-viewer-C2rpsyCi.js";import"./date-Bw8XW9r_.js";import"./format-B1M8xui0.js";import"./skeleton-CcA8ksMV.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ne={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(n,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(n,{...e})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(n,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(f=(y=o.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const ie=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,ie as __namedExportsOrder,ne as default};
