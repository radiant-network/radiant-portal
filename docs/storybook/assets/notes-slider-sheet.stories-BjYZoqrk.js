import{j as r}from"./iframe-BWqcvn2Z.js";import{h as i,H as S}from"./index-CFFCyKfv.js";import{N as o}from"./notes-slider-sheet-uNKY5CWJ.js";import{C as j,A as t}from"./applications-config-DR2_gbFI.js";import{L as x}from"./notes-container-Gyt4croy.js";import{n as m,g as w}from"./api-notes-B08rYZjO.js";import{d as p}from"./delay-Dpi1jyQB.js";import{B as L}from"./chunk-UVKPFVEO-DCwcs8tx.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B_N018L2.js";import"./api-B3xiDz_1.js";import"./index-CBbFBGvb.js";import"./sheet-B1lbKUWS.js";import"./index-CdNvrGIy.js";import"./x-COCFdEgO.js";import"./i18n-BsR9IM21.js";import"./button-D3sGKX_Z.js";import"./index-ph_9GgMk.js";import"./action-button-C1JStQtU.js";import"./dropdown-menu-MPz4kaiX.js";import"./index-C7kLeKX6.js";import"./circle-DAVwx1vN.js";import"./check-C60yrJGB.js";import"./separator-DUmh9lQt.js";import"./spinner-OtoPSTVe.js";import"./rich-text-viewer-C-Xgd96G.js";import"./toggle-BpICnICQ.js";import"./single-avatar-SAxKyxfS.js";import"./avatar-C5LpUtS5.js";import"./avatar.utils-CvyAfuNO.js";import"./hover-card-Cp_PPo9K.js";import"./date-BwWpT0_F.js";import"./skeleton-BbKpZDAf.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
