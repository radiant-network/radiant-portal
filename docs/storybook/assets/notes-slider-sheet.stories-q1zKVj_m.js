import{j as r}from"./iframe-C32u87gm.js";import{h as i,H as S}from"./index-D7lGDHaR.js";import{N as n}from"./notes-slider-sheet-D7C9-gTD.js";import{C as j,A as t}from"./applications-config-N7CrK8vK.js";import{L as x}from"./notes-container-B4-Vvjj7.js";import{n as m,g as w}from"./api-notes-CJIyTolA.js";import{d as p}from"./delay-H49gIiSS.js";import{B as L}from"./chunk-UVKPFVEO-CjU8cBCq.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DuUXA6qw.js";import"./index-CFkO8CRi.js";import"./api-Bs_y-PxM.js";import"./sheet-Cpb_gmHI.js";import"./index-mTHdFecp.js";import"./x-VdsbSUnV.js";import"./i18n-CRB74Ovx.js";import"./button-CHdvMUM2.js";import"./index-JkrvEebA.js";import"./action-button-C_0K-UsD.js";import"./dropdown-menu-BEKZzVwz.js";import"./index-Dxv0bq83.js";import"./circle-B_eMDar9.js";import"./check-Yi-N49Um.js";import"./separator-D_yl5Knm.js";import"./spinner-Dzar-P32.js";import"./rich-text-editor-pHm2e8ph.js";import"./toggle-6AV_SyaR.js";import"./single-avatar-CPyhJgky.js";import"./avatar-Ep_nU5_U.js";import"./avatar.utils-DclS3v_-.js";import"./hover-card-Bsuhxan3.js";import"./rich-text-viewer-gGMA6l1e.js";import"./date-BHWZo0jT.js";import"./format-Cx-yfiBd.js";import"./skeleton-DoJyjFU2.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ne={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(n,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(n,{...e})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(n,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
