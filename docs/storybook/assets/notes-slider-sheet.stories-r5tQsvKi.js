import{j as r}from"./iframe-gmiDgu1c.js";import{h as i,H as S}from"./index-CdbfSU4P.js";import{N as o}from"./notes-slider-sheet-BqLx5gOP.js";import{C as j,A as t}from"./applications-config-BcCM8Oqm.js";import{L as x}from"./notes-container-nGgmzozM.js";import{n as m,g as w}from"./api-notes-BYkEA43z.js";import{d as p}from"./delay-CMP9XZjC.js";import{B as L}from"./chunk-UVKPFVEO-DJVFJ1pE.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BMcbbzoS.js";import"./api-B3xiDz_1.js";import"./index-CaNvVg1r.js";import"./sheet-_2plHq0o.js";import"./index-BfV7VDGw.js";import"./x-B-mOHMEI.js";import"./i18n-DeUng5Jc.js";import"./button-BX2ZKidd.js";import"./index-3Olvjq6T.js";import"./action-button-CKZPd9kW.js";import"./dropdown-menu-PjMB9ssW.js";import"./index-BeMHaXtW.js";import"./circle-BTv5cleQ.js";import"./check-7YBwiBas.js";import"./separator-DalGvlbi.js";import"./spinner-BkqvPyL-.js";import"./rich-text-viewer-BTOeh0OP.js";import"./toggle-CCDE8dQq.js";import"./single-avatar-Dm4SmJj5.js";import"./avatar-RmqT5qhT.js";import"./avatar.utils-BfuxuCMa.js";import"./hover-card-CKKLHFDT.js";import"./date-D1N_mM8T.js";import"./skeleton-DsOhK4wx.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
