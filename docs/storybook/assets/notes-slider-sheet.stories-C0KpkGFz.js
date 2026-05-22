import{j as e}from"./iframe-Qm3M9fYv.js";import{h as i,H as S}from"./index-dLs2gNF6.js";import{N as n}from"./notes-slider-sheet-CJ1QFXSG.js";import{C as j,A as t}from"./applications-config-BzyJuUak.js";import{L as x}from"./notes-container-DLv2AEdz.js";import{n as m,g as w}from"./api-notes-Cb13IuWt.js";import{d as p}from"./delay-CDUwOfiR.js";import{B as L}from"./chunk-UVKPFVEO-C7xGb2HA.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DFE_l_2S.js";import"./index-tRC785VS.js";import"./api-QmR3WP_i.js";import"./sheet-DhUQhjIW.js";import"./index-0PIzli6v.js";import"./x-BLOADziH.js";import"./i18n-DtVzpPj7.js";import"./button-BNjULfsN.js";import"./index-Uln5Z1CG.js";import"./action-button-CAa3sK_K.js";import"./dropdown-menu-gm3NzM5r.js";import"./index-D0f4O7bL.js";import"./index-BQHUTV5s.js";import"./check-C9ikh__7.js";import"./circle-BbcGUewd.js";import"./separator-rxJGBRR6.js";import"./spinner-DhB9xNgk.js";import"./rich-text-editor-Do8ym57m.js";import"./toggle-CAT-4Vx6.js";import"./popover-BDlEwyUl.js";import"./input-DIm1lGH2.js";import"./label-DXeeVgrs.js";import"./underline-BmzPifHE.js";import"./single-avatar-W79k9GkX.js";import"./avatar-C2Vn98HG.js";import"./avatar.utils-Bs_ZgTV-.js";import"./hover-card-Bb9NGkQ7.js";import"./rich-text-viewer-DfeTl1VX.js";import"./date-BnBgBLgO.js";import"./format-BB4vlz_U.js";import"./skeleton-DIsUFmAv.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
