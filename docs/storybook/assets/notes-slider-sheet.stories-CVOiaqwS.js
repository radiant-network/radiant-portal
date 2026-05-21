import{j as e}from"./iframe-DPCX_vyO.js";import{h as i,H as S}from"./index-DpNATUyD.js";import{N as n}from"./notes-slider-sheet-DikuImyk.js";import{C as j,A as t}from"./applications-config-D3m0Bzir.js";import{L as x}from"./notes-container-BpgpyEZ7.js";import{n as m,g as w}from"./api-notes-CFy8xkhL.js";import{d as p}from"./delay-Csw9jBGj.js";import{B as L}from"./chunk-UVKPFVEO-B3d5HzQh.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CLexyRe_.js";import"./index-DWJAa04P.js";import"./api-8Q83AOwn.js";import"./sheet-ng_mL0wt.js";import"./index-DxIej0Nq.js";import"./x-DQKG1W33.js";import"./i18n-B5rlBJwG.js";import"./button-DGbd45qr.js";import"./index-DBmHguou.js";import"./action-button-B2f6sewW.js";import"./dropdown-menu-Do2hewv7.js";import"./index-Bz-Twzm4.js";import"./index-4f4sMJQ-.js";import"./check-Cva_u8Wi.js";import"./circle-_vVbOuMs.js";import"./separator-DG3bXgVX.js";import"./spinner-BT4clQRS.js";import"./rich-text-editor-CzE7eudT.js";import"./toggle-2fL9jnLF.js";import"./popover-Bm69QTgr.js";import"./input-DiHA6mxe.js";import"./label-BVQe2CMK.js";import"./underline-BQMlUF3Y.js";import"./single-avatar-Bo7uvwBd.js";import"./avatar-ELX0pBcY.js";import"./avatar.utils-CUhhzDiJ.js";import"./hover-card-DBcJKeGH.js";import"./rich-text-viewer-CLCZQefs.js";import"./date-BBJ7JINU.js";import"./format-Cyc88-m9.js";import"./skeleton-DOKN9Rap.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},dr={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
