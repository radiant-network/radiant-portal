import{j as r}from"./iframe-BWVweZ6L.js";import{h as i,H as S}from"./index-5O4_qTUd.js";import{N as o}from"./notes-slider-sheet-5xYxgPWS.js";import{C as j,A as t}from"./applications-config-C0XzbuzL.js";import{L as x}from"./notes-container-rFfwoXtf.js";import{n as m,g as w}from"./api-notes-DG-riKfA.js";import{d as p}from"./delay-BMhpDLUb.js";import{B as L}from"./chunk-UVKPFVEO-6nJnNXpM.js";import"./preload-helper-Dp1pzeXC.js";import"./index-D6_rDfcV.js";import"./api-B3xiDz_1.js";import"./index-CKUIM1sH.js";import"./sheet-BklJ_MRb.js";import"./index-Dq0YAfIh.js";import"./x-D4hBKM-j.js";import"./i18n-B38pq5Fo.js";import"./button-CyO2GiBa.js";import"./index-D5uXdybh.js";import"./action-button-B1cMf3Og.js";import"./dropdown-menu-CdJShM6V.js";import"./index-D3WmDdxv.js";import"./circle-D7KzJ1gO.js";import"./check-CL3HXxiZ.js";import"./separator-BeoHuMME.js";import"./spinner-Dox2uI7C.js";import"./rich-text-viewer-8UwJ1WCQ.js";import"./toggle-BWrL6Fhh.js";import"./single-avatar-BeBT-mjF.js";import"./avatar-CKp5P-A6.js";import"./avatar.utils-D5LRy2DN.js";import"./hover-card-CDrEaN7c.js";import"./date-Bl1Op2E2.js";import"./skeleton-BsnggfWB.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
