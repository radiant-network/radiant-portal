import{j as e}from"./iframe-DaM1YiRn.js";import{h as i,H as S}from"./index-BFZNQKGY.js";import{N as n}from"./notes-slider-sheet-XDZXKkqA.js";import{C as j,A as t}from"./applications-config-DRrffRKc.js";import{L as x}from"./notes-container-CHHINtSi.js";import{n as m,g as w}from"./api-notes-BEh_kpSZ.js";import{d as p}from"./delay-D-oKa9pV.js";import{B as L}from"./chunk-UVKPFVEO-pQwV6dyp.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BPMps200.js";import"./index-CbTAE3zM.js";import"./api-8Q83AOwn.js";import"./sheet-Be73IKNE.js";import"./index-Bm7c04hK.js";import"./x-B0GwocEO.js";import"./i18n-DNukmF0K.js";import"./button-cIo4kTDu.js";import"./index-WnNzYmWl.js";import"./action-button-DhgUXwlC.js";import"./dropdown-menu-CG6n5PUn.js";import"./index-Btmr2mec.js";import"./index-D9vHrUxW.js";import"./check-uVsp9yS3.js";import"./circle-BSdxmdQU.js";import"./separator-skiKsUbH.js";import"./spinner-CRzX1q-j.js";import"./rich-text-editor-9eLqD42j.js";import"./toggle-BLSVSNOJ.js";import"./popover-DIKkgbHT.js";import"./input-BG7w57oN.js";import"./label-Cynt786O.js";import"./underline-DpKv_HlL.js";import"./single-avatar-BvZ9Ue5G.js";import"./avatar-C2b39-B-.js";import"./avatar.utils-C8bmNraR.js";import"./hover-card-CB5ptbsr.js";import"./rich-text-viewer-MEwl61Gn.js";import"./date-Bb7_SGgi.js";import"./format-TI-B_xYm.js";import"./skeleton-CHYfzFrS.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
