import{j as e}from"./iframe-DwBDIzNo.js";import{h as i,H as S}from"./index-BzeeVl9i.js";import{N as n}from"./notes-slider-sheet-_j6jQkw4.js";import{C as j,A as t}from"./applications-config-c33McvLf.js";import{L as x}from"./notes-container-BuCoKdp0.js";import{n as m,g as w}from"./api-notes-BbnghP8K.js";import{d as p}from"./delay-Di7jKmQY.js";import{B as L}from"./chunk-UVKPFVEO-BQiUtWgB.js";import"./preload-helper-Dp1pzeXC.js";import"./api-C0caDa3U.js";import"./index-DdT76R05.js";import"./api-CyFX6UkQ.js";import"./sheet-DRwME2qe.js";import"./index-Bc0M_7Bo.js";import"./x-BsZp4wzX.js";import"./i18n-AhKDWTeX.js";import"./button-D8_cBhjA.js";import"./index--JuLG_uA.js";import"./action-button-p5oF4E2x.js";import"./dropdown-menu-Qvqm4pBL.js";import"./index-By-2qDH7.js";import"./index-BsWtmlzq.js";import"./check-vpPvOghz.js";import"./circle-DO0wv0WI.js";import"./separator-CYssvToX.js";import"./spinner-Du0Krtzl.js";import"./rich-text-editor-BxEH-Z5b.js";import"./toggle-EE34huHj.js";import"./popover-Djjnf_F7.js";import"./input-Cuh6Xg3x.js";import"./label-Bvc2gTBE.js";import"./underline-GoJEtqWh.js";import"./single-avatar-mmr8_zjE.js";import"./avatar-DydVvTzS.js";import"./avatar.utils-C0vPSJlu.js";import"./hover-card-iTywRb79.js";import"./rich-text-viewer-CYBeOujr.js";import"./date-CCsfCK44.js";import"./format-CuBkN9UF.js";import"./skeleton-C-sfkqjl.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
