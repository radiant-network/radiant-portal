import{j as r}from"./iframe-CC3okCGT.js";import{h as i,H as S}from"./index-BOeHozge.js";import{N as o}from"./notes-slider-sheet-CAxZJhoi.js";import{C as j,A as t}from"./applications-config-nl_AZLln.js";import{L as x}from"./notes-container-B3BpSKsu.js";import{n as m,g as w}from"./api-notes-R-zzovhZ.js";import{d as p}from"./delay-DLBkSIUq.js";import{B as L}from"./chunk-UVKPFVEO-lZ6Bhn0Z.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CCvzafUf.js";import"./api-B3xiDz_1.js";import"./index-BujmIhY5.js";import"./sheet-BAQOwAvh.js";import"./index-D3kObqu1.js";import"./x-D7KHn17J.js";import"./i18n-D-9Z-LDF.js";import"./button-CR90hCpk.js";import"./index-CI2EdHUh.js";import"./action-button-C8uRw4WS.js";import"./dropdown-menu-6lmR3GsJ.js";import"./index-DZ795Gl-.js";import"./circle-wakmw5sg.js";import"./check-C9Wpo2F7.js";import"./separator-CVrfIWXe.js";import"./spinner-BERPpRFw.js";import"./rich-text-viewer-3DU8_loY.js";import"./toggle-fbzBXazz.js";import"./single-avatar-cGhvzRXU.js";import"./avatar-BSLbbsN2.js";import"./avatar.utils-DLBx9RS6.js";import"./hover-card-plobfzID.js";import"./date-CrTdrqeJ.js";import"./skeleton-Cj0b9RZ1.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
