import{j as r}from"./iframe-CdetP1X0.js";import{h as i,H as S}from"./index-D1jy76XM.js";import{N as o}from"./notes-slider-sheet-DpRgyieI.js";import{C as j,A as t}from"./applications-config-DvyfV6tQ.js";import{L as x}from"./notes-container-BAzIGyIg.js";import{n as m,g as w}from"./api-notes-DuR1J7O8.js";import{d as p}from"./delay-B1VgKfWt.js";import{B as L}from"./chunk-UVKPFVEO-BC8YNRtx.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BJmkyz_i.js";import"./api-B3xiDz_1.js";import"./index-D56yV3Gg.js";import"./sheet-DqFWKom8.js";import"./index-CxMTZYeW.js";import"./x-Coq7ggOF.js";import"./i18n-Cg4CY2fo.js";import"./button-BbJzX6I1.js";import"./index-BbVp5V_G.js";import"./action-button-CR1ASOMi.js";import"./dropdown-menu-FRQNa6wC.js";import"./index-Y-WAq52a.js";import"./circle-CGfH005V.js";import"./check-CJ0hc2Z8.js";import"./separator-DWpVdauv.js";import"./spinner-DYfaN9ma.js";import"./rich-text-viewer-BgmRXhCK.js";import"./toggle-BJTW8oBM.js";import"./single-avatar-DJaEx1Kj.js";import"./avatar-DQkTQI4e.js";import"./avatar.utils-CUQWX6yq.js";import"./hover-card-BCcw3KwW.js";import"./date-B1DzjUzn.js";import"./skeleton-CXyg18dM.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var _,y,f;n.parameters={...n.parameters,docs:{...(_=n.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(f=(y=n.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const ne=["Default","Loading","Empty"];export{s as Default,n as Empty,a as Loading,ne as __namedExportsOrder,ae as default};
