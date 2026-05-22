import{j as e}from"./iframe-DiSFfoD4.js";import{h as i,H as S}from"./index-DzagocFe.js";import{N as n}from"./notes-slider-sheet-B7ZmL1b-.js";import{C as j,A as t}from"./applications-config-XePMBFpQ.js";import{L as x}from"./notes-container-CMvbgF5L.js";import{n as m,g as w}from"./api-notes-DS8ZSoli.js";import{d as p}from"./delay-BIYzoXrY.js";import{B as L}from"./chunk-UVKPFVEO-Dk2k7YJq.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CinLHSl0.js";import"./index-SNNKgtnK.js";import"./api-QmR3WP_i.js";import"./sheet-D0J7kH7i.js";import"./index-CUYQ6jEr.js";import"./x-CnTOoAws.js";import"./i18n-0aycJ8bv.js";import"./button-BV9rrKND.js";import"./index-BL8oEubm.js";import"./action-button-BLEZ4s-Z.js";import"./dropdown-menu-Co-ilK63.js";import"./index-Cg7zLYUJ.js";import"./index-BRwQSXJv.js";import"./check-jCtI0cKB.js";import"./circle-CvzX10sS.js";import"./separator-KK1C3d3J.js";import"./spinner-DGQbiZ09.js";import"./rich-text-editor-xed6RyXU.js";import"./toggle-T_MucoYP.js";import"./popover-Btvtjdcu.js";import"./input-C7_zKUAr.js";import"./label-DZcF-8sB.js";import"./underline-CxcCCXOm.js";import"./single-avatar-B6hpng6S.js";import"./avatar-CxnfKJ-b.js";import"./avatar.utils-CCI6u3kt.js";import"./hover-card-CnN-jMqR.js";import"./rich-text-viewer-Bx-7OSuH.js";import"./date-DDEqOim8.js";import"./format-7VDSBl_O.js";import"./skeleton-D5mkhX1K.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
