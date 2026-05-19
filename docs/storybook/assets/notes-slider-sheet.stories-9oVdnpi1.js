import{j as e}from"./iframe-BHfqIMzt.js";import{h as i,H as S}from"./index-D9Oo4RIl.js";import{N as n}from"./notes-slider-sheet-pAjz7Dv3.js";import{C as j,A as t}from"./applications-config-C7w-V47M.js";import{L as x}from"./notes-container-C11ISRSS.js";import{n as m,g as w}from"./api-notes-DGDtiUYR.js";import{d as p}from"./delay-DOLz1Opg.js";import{B as L}from"./chunk-UVKPFVEO-BdZzg4Ed.js";import"./preload-helper-Dp1pzeXC.js";import"./api-B0qKpffM.js";import"./index-Cz41nXzz.js";import"./api-CyFX6UkQ.js";import"./sheet-WOxiNzMI.js";import"./index-DxPoDZOl.js";import"./x-BF5vTZ3R.js";import"./i18n-DJqZGQS-.js";import"./button-DT6SeUbn.js";import"./index-Ivg0BASX.js";import"./action-button-DRFMZGea.js";import"./dropdown-menu-rcpHAa0A.js";import"./index-BTPV-258.js";import"./index-CQhfjdm1.js";import"./check-C0u0WUKH.js";import"./circle-DGplIKvp.js";import"./separator-kpnGY0Sp.js";import"./spinner-CHqc36oc.js";import"./rich-text-editor-Bg3Hx8zo.js";import"./toggle-BG2_-9HV.js";import"./underline-DbVG-LOq.js";import"./single-avatar-BJFmZuHP.js";import"./avatar-CgOkYsG5.js";import"./avatar.utils-DDjMvBrR.js";import"./hover-card-BkNiAhlR.js";import"./rich-text-viewer-xmev_oCY.js";import"./date-Dkgmc_Lc.js";import"./format-Br0zbitw.js";import"./skeleton-D18Wmj17.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},mr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
