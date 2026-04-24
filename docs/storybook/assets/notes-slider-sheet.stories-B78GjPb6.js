import{j as r}from"./iframe-CMnhLHOf.js";import{h as i,H as S}from"./index-GGZSliky.js";import{N as o}from"./notes-slider-sheet-DtNcD_Gf.js";import{C as j,A as t}from"./applications-config-D8LWqBnP.js";import{L as x}from"./notes-container-DGF-ARBn.js";import{n as m,g as w}from"./api-notes-CQL7Y9Di.js";import{d as p}from"./delay-DY-ORSzp.js";import{B as L}from"./chunk-UVKPFVEO-Bv7X8MbW.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Bi6HgjE_.js";import"./api-B3xiDz_1.js";import"./index-BuHXHBX3.js";import"./sheet-YYj7vpMF.js";import"./index-L8y1B82f.js";import"./x-BbwuhHOu.js";import"./i18n-D_gPNxag.js";import"./button-CwgxGnP_.js";import"./index-BUtUgFZQ.js";import"./action-button-C6O-ZiMa.js";import"./dropdown-menu-DuT_GNFJ.js";import"./index-EMqEdC3c.js";import"./circle-BEBmorTE.js";import"./check-DMtyfd-6.js";import"./separator-DKyTZOMp.js";import"./spinner-D2vNXzFW.js";import"./rich-text-viewer-Dj78JnOs.js";import"./toggle-0oQ0so6W.js";import"./single-avatar-DJj12Cen.js";import"./avatar-Cdt8HBuy.js";import"./avatar.utils-B0yz4HFV.js";import"./hover-card-DA3mNaGu.js";import"./date-eufk3QRE.js";import"./skeleton-CvsYF9Sc.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
