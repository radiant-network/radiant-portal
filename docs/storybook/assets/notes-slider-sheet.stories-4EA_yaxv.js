import{j as e}from"./iframe-DZxGQyD0.js";import{h as i,H as S}from"./index-DvOG8Qo-.js";import{N as n}from"./notes-slider-sheet-CxMnp7Qx.js";import{C as j,A as t}from"./applications-config-Dm8iSn42.js";import{L as x}from"./notes-container-DdQe2HNB.js";import{n as m,g as w}from"./api-notes-DUU9PM7j.js";import{d as p}from"./delay-CJDHVVV8.js";import{B as L}from"./chunk-UVKPFVEO-DevS1Rzl.js";import"./preload-helper-Dp1pzeXC.js";import"./api-wIXIxrPs.js";import"./index-CtOZwwKW.js";import"./api-QmR3WP_i.js";import"./sheet-B1bqtnUO.js";import"./index-BhKemfyi.js";import"./x-BOWcXDh5.js";import"./i18n-C2h1o0aw.js";import"./button-1W1d7xAn.js";import"./index-Busr1vTm.js";import"./action-button-tMYSlpGq.js";import"./dropdown-menu-LRGitqO-.js";import"./index-Do7m-0ZR.js";import"./index-B5XFpENV.js";import"./check-CYxpBnf-.js";import"./circle-CNziIkuH.js";import"./separator-DW3ZXT-L.js";import"./spinner-BLwT-DBs.js";import"./rich-text-editor-C1T-Wf3D.js";import"./toggle-BNSY36yt.js";import"./popover-DmAQc1Td.js";import"./input-DOSbHBHI.js";import"./label-BW_LS4F4.js";import"./underline-Bsa7goLn.js";import"./single-avatar-DFDoKzPE.js";import"./avatar-Lsu8cxYA.js";import"./avatar.utils-D5ID22AQ.js";import"./hover-card-COU_VZ-Z.js";import"./rich-text-viewer-wsmSnaln.js";import"./date-Dap1gZCo.js";import"./format-B8OuGClS.js";import"./skeleton-DyLF_-eO.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
