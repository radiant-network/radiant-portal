import{j as e}from"./iframe-Dzwv78Bp.js";import{h as i,H as S}from"./index-DEILsLBg.js";import{N as n}from"./notes-slider-sheet-bkSM9Gmz.js";import{C as j,A as t}from"./applications-config-QWYOaqQq.js";import{L as x}from"./notes-container-CH_dSlsA.js";import{n as m,g as w}from"./api-notes-BnLv7L7R.js";import{d as p}from"./delay-CwLrmR44.js";import{B as L}from"./chunk-UVKPFVEO-jqB1vfaj.js";import"./preload-helper-Dp1pzeXC.js";import"./api-D7SqW33s.js";import"./index-WGxN0cRA.js";import"./api-QmR3WP_i.js";import"./sheet-2EW0L-Fb.js";import"./index-BlTPKM6_.js";import"./x-EMA4gmcI.js";import"./i18n-DoiwY1e4.js";import"./button-DIhskbJm.js";import"./index-Suri5pS-.js";import"./action-button-BaF3hCn4.js";import"./dropdown-menu-B4YXM0X2.js";import"./index-D04D1SM5.js";import"./index-3KXOzHs5.js";import"./check-CHkQSgYo.js";import"./circle-BgwRz-U6.js";import"./separator-Djq5tUIi.js";import"./spinner-BbewS7ZP.js";import"./rich-text-editor-BMFonvoB.js";import"./toggle-D5GFz51h.js";import"./popover-C9A8TShE.js";import"./input-BFvN6ZlJ.js";import"./label-B7FcqQSk.js";import"./underline-Cev375u5.js";import"./single-avatar-D7rGSZ68.js";import"./avatar-DYLxDjxM.js";import"./avatar.utils--cpNaEhU.js";import"./hover-card-DM3-wY4q.js";import"./rich-text-viewer-DXs-kxyu.js";import"./date-DmitCOnX.js";import"./format-jrfBShq5.js";import"./skeleton-DS8wH2sb.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
