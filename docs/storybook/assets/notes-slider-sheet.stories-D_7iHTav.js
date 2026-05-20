import{j as e}from"./iframe-DwZVKEmc.js";import{h as i,H as S}from"./index-CVkGrJR6.js";import{N as n}from"./notes-slider-sheet-BgVVPf-b.js";import{C as j,A as t}from"./applications-config-D7OfQjOC.js";import{L as x}from"./notes-container-C155aMPp.js";import{n as m,g as w}from"./api-notes-CYdOJ-rT.js";import{d as p}from"./delay-CF9dYUSB.js";import{B as L}from"./chunk-UVKPFVEO-BG30emQZ.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DeOY0ycF.js";import"./index-CrH-HhPR.js";import"./api-CyFX6UkQ.js";import"./sheet-BZ0MmBFC.js";import"./index-CXgFPGdZ.js";import"./x-BVdfCrdy.js";import"./i18n-P_eepega.js";import"./button-B4bE3_Fh.js";import"./index-C1UQ77wj.js";import"./action-button-uSHsiLgL.js";import"./dropdown-menu-DCNbL4UQ.js";import"./index-Chf9uvwf.js";import"./index-D_qo1p9J.js";import"./check-adWPXh5W.js";import"./circle-BC_dxGpQ.js";import"./separator-CxLyQWCL.js";import"./spinner-BYfx8JsZ.js";import"./rich-text-editor-ISThiSzA.js";import"./toggle-D_BtroyP.js";import"./underline-BMIBuOq_.js";import"./single-avatar-DHoo6X5B.js";import"./avatar-DyV8P7Lc.js";import"./avatar.utils-xtsJb9TM.js";import"./hover-card-CyqQrl6y.js";import"./rich-text-viewer-D0dYNagP.js";import"./date-dL2Zp0Ap.js";import"./format-CBCPxRQ1.js";import"./skeleton-DiSpo7lv.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},mr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
