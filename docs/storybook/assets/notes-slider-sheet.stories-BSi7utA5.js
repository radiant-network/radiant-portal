import{j as r}from"./iframe-Cl_us0Ef.js";import{h as i,H as S}from"./index-CF0woTph.js";import{N as o}from"./notes-slider-sheet-1-CAD5pD.js";import{C as j,A as t}from"./applications-config-Ctn1-MGc.js";import{L as x}from"./notes-container-DBunS_Pp.js";import{n as m,g as w}from"./api-notes-C7x1cS0x.js";import{d as p}from"./delay-BjSNgauV.js";import{B as L}from"./chunk-UVKPFVEO-Cchu1OLp.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BDkdQZy6.js";import"./api-B3xiDz_1.js";import"./index-H2O2sYf7.js";import"./sheet-Birj-iNe.js";import"./index-CVDX2I20.js";import"./x-BBolOUoW.js";import"./i18n-Cilb11M3.js";import"./button-CcL9vRdB.js";import"./index-1z3gKZ3X.js";import"./action-button-DtCedlrk.js";import"./dropdown-menu-DdbrZPUp.js";import"./index-B6rZWH80.js";import"./circle-BnOaCZ5x.js";import"./check-DjGEQf1v.js";import"./separator-CNhVfHxM.js";import"./spinner-BcFxDdqz.js";import"./rich-text-viewer-DDKdxvyd.js";import"./toggle-BsHECOqf.js";import"./single-avatar-DxnGMIiN.js";import"./avatar-CNdniGro.js";import"./avatar.utils-DDg3KPKy.js";import"./hover-card-oECSRDp4.js";import"./date-Dtckt3r7.js";import"./skeleton-BcJ5rh2z.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
