import{j as r}from"./iframe-LZxw1Sce.js";import{h as i,H as S}from"./index-CHYznW0Y.js";import{N as o}from"./notes-slider-sheet-_prKAolq.js";import{C as j,A as t}from"./applications-config-Zu7qPbrL.js";import{L as x}from"./notes-container-BgpBFIdS.js";import{n as m,g as w}from"./api-notes-CugPAYjQ.js";import{d as p}from"./delay-DwvhBIlq.js";import{B as L}from"./chunk-UVKPFVEO-BvRXkSDK.js";import"./preload-helper-Dp1pzeXC.js";import"./index-HkE2UHPC.js";import"./api-B3xiDz_1.js";import"./index-6y6Ym7X3.js";import"./sheet-FAbEMN8-.js";import"./index-Dah95JPL.js";import"./x-1qnFNbOG.js";import"./i18n-CRH4VMgz.js";import"./button-ZEO7G-oa.js";import"./index-B3nxzM2N.js";import"./action-button-tVl7N9pb.js";import"./dropdown-menu-BIZOSzOL.js";import"./index-CmwpAufl.js";import"./circle-BIuD_Wmh.js";import"./check-ChiQQ04F.js";import"./separator-Ct7RDAuq.js";import"./spinner-CMpSYTfa.js";import"./rich-text-viewer-B0nUEKhn.js";import"./toggle-COSfmume.js";import"./single-avatar-jH4N3jty.js";import"./avatar-sziLuwZ2.js";import"./avatar.utils-Co9txS8R.js";import"./hover-card-VXZDB9Wv.js";import"./date-WmfcFe3M.js";import"./skeleton-DLU4Cg_5.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
