import{j as r}from"./iframe-sBkayYGM.js";import{h as i,H as S}from"./index-Cq3UQ71Q.js";import{N as o}from"./notes-slider-sheet-Cu3mJsot.js";import{C as j,A as t}from"./applications-config-DT3MKkk5.js";import{L as x}from"./notes-container-FtFo_Jhb.js";import{n as m,g as w}from"./api-notes-MzQPQG1G.js";import{d as p}from"./delay-BKU0BIdC.js";import{B as L}from"./chunk-UVKPFVEO-DgXeyoWa.js";import"./preload-helper-Dp1pzeXC.js";import"./index--BF3iqwP.js";import"./api-B3xiDz_1.js";import"./index-CE3ioURP.js";import"./sheet-CZ6-w22r.js";import"./index-CFkHUogj.js";import"./x-B00zDNqQ.js";import"./i18n-BriNheOb.js";import"./button-jkxlOLkL.js";import"./index-9C8pxyL6.js";import"./action-button-DcUSZY_y.js";import"./dropdown-menu-CSHOugmB.js";import"./index-d5oLFdxm.js";import"./circle-Chbat-Us.js";import"./check-sYlosT3b.js";import"./separator-DPuhkk5a.js";import"./spinner-C2umnMrB.js";import"./rich-text-viewer-CSh8RHj7.js";import"./toggle-DkqiWPq4.js";import"./single-avatar-CD3XftRF.js";import"./avatar-CcKVpPCT.js";import"./avatar.utils-zDrBdIJ3.js";import"./hover-card-CjnXfZjA.js";import"./date-B-jyro-G.js";import"./skeleton-BkUB82Jy.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
