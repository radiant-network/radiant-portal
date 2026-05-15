import{j as r}from"./iframe-D1HxDOtg.js";import{h as i,H as S}from"./index-CjHdHNT0.js";import{N as n}from"./notes-slider-sheet-4Y0GRb86.js";import{C as j,A as t}from"./applications-config-BHeY-GuV.js";import{L as x}from"./notes-container-2yuCKMU9.js";import{n as m,g as w}from"./api-notes-BylYOh-a.js";import{d as p}from"./delay-C51YGq_w.js";import{B as L}from"./chunk-UVKPFVEO-DeMivE1Y.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DgbNOvbA.js";import"./index-DFrM8NTl.js";import"./api-Bs_y-PxM.js";import"./sheet-BBWQkUSb.js";import"./index-7q4muiSl.js";import"./x-kiNtMAqJ.js";import"./i18n-DkKv1E8x.js";import"./button-Dv4Luc3V.js";import"./index-3ABOodQS.js";import"./action-button-CFsRxLLs.js";import"./dropdown-menu-q8iecXKm.js";import"./index-B0uVmmYF.js";import"./circle-DZ4SjU33.js";import"./check-BnNqbnp6.js";import"./separator-0KX02B4l.js";import"./spinner-CzmJXE-s.js";import"./rich-text-editor-CiHpDSj7.js";import"./toggle-B869Oa5C.js";import"./single-avatar-BwJDskqv.js";import"./avatar-DwBL3tE5.js";import"./avatar.utils-BIW8h5ag.js";import"./hover-card-Cme2YHP2.js";import"./rich-text-viewer-BB9CROQo.js";import"./date-BWxM-en8.js";import"./format-vIIVPkOD.js";import"./skeleton-JWuQfupA.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ne={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(n,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(n,{...e})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(n,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(h=(u=a.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var _,y,f;o.parameters={...o.parameters,docs:{...(_=o.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(f=(y=o.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const ie=["Default","Loading","Empty"];export{s as Default,o as Empty,a as Loading,ie as __namedExportsOrder,ne as default};
