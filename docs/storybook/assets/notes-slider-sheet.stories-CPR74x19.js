import{j as r}from"./iframe-CeZhEt-M.js";import{h as i,H as S}from"./index-G-7YDFFC.js";import{N as o}from"./notes-slider-sheet-ChuqGZeu.js";import{C as j,A as t}from"./applications-config-C8_840XO.js";import{L as x}from"./notes-container-CI1NQCYR.js";import{n as m,g as w}from"./api-notes-DDvbhyJP.js";import{d as p}from"./delay-CgJrn7bc.js";import{B as L}from"./chunk-UVKPFVEO-D1Baaagb.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Qwp9S0vo.js";import"./api-B3xiDz_1.js";import"./index-Dl99OMGT.js";import"./sheet-BPKvJ8Qz.js";import"./index-_aHikEw8.js";import"./x-C4Hbu964.js";import"./i18n-ysDo9x1e.js";import"./button-CrCrdqal.js";import"./index-CgPaK-RE.js";import"./action-button-Bt8SAbca.js";import"./dropdown-menu-CDeBtpHu.js";import"./index-BR-PrORl.js";import"./circle-Cm0Ztkdm.js";import"./check-DW427_c7.js";import"./separator-DLJ7YcP5.js";import"./spinner-AUz2GnGL.js";import"./rich-text-viewer-CBr3WtC9.js";import"./toggle-BE5U5IZx.js";import"./single-avatar-1yQN2sPE.js";import"./avatar-DEYBUjZa.js";import"./avatar.utils-CfK75jgv.js";import"./hover-card-Gm1W_4DK.js";import"./date-DstWmg0J.js";import"./skeleton-e_OHSOfg.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
