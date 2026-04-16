import{j as e}from"./iframe-e_RkbOaH.js";import{h as i,H as _}from"./index-D15nB2Nh.js";import{N as n}from"./notes-slider-sheet-DqQbD1VZ.js";import{C as j,A as t}from"./applications-config-Bq-oX9xC.js";import{L as x}from"./notes-container-BRdQn3dJ.js";import{n as m,g as S}from"./api-notes-DkCZr0TT.js";import{d as p}from"./delay-BFXbRNQn.js";import{B as L}from"./chunk-UVKPFVEO-pU8RgpVj.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Bj79jSqc.js";import"./api-CKEtK0ZG.js";import"./index-b4Aa0AjS.js";import"./sheet-ClNUUv_v.js";import"./index-3hxVm1Ot.js";import"./x-DLZVjTLB.js";import"./i18n-qNbLka70.js";import"./button-CSb0Gl7Z.js";import"./index-Cse8Fp0p.js";import"./action-button-CcgNtTYc.js";import"./dropdown-menu-Bf1xD4Ie.js";import"./index-DJ2igTyg.js";import"./circle-sz7zuKNK.js";import"./check-x0ruABD0.js";import"./separator-CjKKkkm2.js";import"./spinner-B2iHK5pd.js";import"./rich-text-viewer-Dp4PWBEM.js";import"./toggle-B8o99oFp.js";import"./single-avatar-CdaukT8K.js";import"./avatar-DjMKDXq3.js";import"./avatar.utils-CeTDnLMV.js";import"./hover-card-Wp00Bb4Q.js";import"./date-CY3buMd5.js";import"./skeleton-C3XE4GKT.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var y,f,w;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(w=(f=o.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};const or=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,or as __namedExportsOrder,ar as default};
