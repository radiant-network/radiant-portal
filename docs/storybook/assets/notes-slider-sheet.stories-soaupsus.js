import{j as r}from"./iframe-z7Dw2yEo.js";import{h as i,H as S}from"./index-ZIkd-1PY.js";import{N as n}from"./notes-slider-sheet-DdrOEhYb.js";import{C as j,A as t}from"./applications-config-BpEObiuq.js";import{L as x}from"./notes-container-0IM-5YIg.js";import{n as m,g as w}from"./api-notes-DDz8TpUN.js";import{d as p}from"./delay-Dw6lZSYa.js";import{B as L}from"./chunk-UVKPFVEO-BDyoUWDx.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DB_m_YK-.js";import"./api-B3xiDz_1.js";import"./index-inViOMC8.js";import"./sheet-DMVFh0Pc.js";import"./index-CMqmWWpN.js";import"./x-CULrwAJu.js";import"./i18n-Dbq9q9wy.js";import"./button-ClIBoGCL.js";import"./index-B8fyt2Zd.js";import"./action-button-BAA5flkr.js";import"./dropdown-menu-D34uHAw7.js";import"./index-fQ2QfZk9.js";import"./circle-uKaMswnP.js";import"./check-BZIAGfC8.js";import"./separator-Jx5y4MFq.js";import"./spinner-CwYvTnlG.js";import"./rich-text-editor-pf8z4wYT.js";import"./toggle-C6b7H_Jk.js";import"./single-avatar-CINHbBDP.js";import"./avatar-Dg8T_6Ud.js";import"./avatar.utils-fyKK3Wxu.js";import"./hover-card-C7V8A6Qc.js";import"./rich-text-viewer-De-IYgh_.js";import"./date-BBgCXrbX.js";import"./format-D3Y3JH_D.js";import"./skeleton-iVXHrWWd.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ne={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(n,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(n,{...e})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(n,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
