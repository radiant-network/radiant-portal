import{j as e}from"./iframe-DM8RWDl8.js";import{h as i,H as _}from"./index-C7TKO_nN.js";import{N as n}from"./notes-slider-sheet-k5MN_c2C.js";import{C as j,A as t}from"./applications-config-3WNo6FZr.js";import{L as x}from"./notes-container-Du3fTxrA.js";import{n as m,g as S}from"./api-notes-DrpfJKCv.js";import{d as p}from"./delay-0FDrAjZ2.js";import{B as L}from"./chunk-UVKPFVEO-vI7r9BMn.js";import"./preload-helper-Dp1pzeXC.js";import"./index-C2LWFt_8.js";import"./api-DA-7dRzo.js";import"./index-ClvCpUvZ.js";import"./sheet-B2ShH8je.js";import"./index-CeebvLIQ.js";import"./x-CFVz_7Lt.js";import"./i18n-B-79avnn.js";import"./button-C2DbAmSn.js";import"./index-Bon90g0q.js";import"./action-button-DN6fhMXW.js";import"./dropdown-menu-DxatbfOI.js";import"./index-HRycHZzQ.js";import"./circle-BbAi-DAd.js";import"./check-7b7-k0zD.js";import"./separator-DkqYGj_0.js";import"./spinner-C2C75_iE.js";import"./rich-text-viewer-oqHgd6g2.js";import"./toggle-CgP0pbgf.js";import"./single-avatar-CECIkn2p.js";import"./avatar-Bj7Q6fP1.js";import"./avatar.utils-B5FxlkvF.js";import"./hover-card-Bc2tqKob.js";import"./en-US-DpFScRkU.js";import"./skeleton-rtX3UF_C.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var y,f,w;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(w=(f=o.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const or=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,or as __namedExportsOrder,ar as default};
