import{j as e}from"./iframe-BW_zLFd2.js";import{h as i,H as _}from"./index-Dm6Dhpnt.js";import{N as n}from"./notes-slider-sheet-BDwLJuoM.js";import{C as j,A as t}from"./applications-config-Clk9B8t1.js";import{L as x}from"./notes-container-BFnBsa6g.js";import{n as m,g as S}from"./api-notes-FKBK-bYO.js";import{d as p}from"./delay-C8_U0UMm.js";import{B as L}from"./chunk-UVKPFVEO-Ddb-auhH.js";import"./preload-helper-Dp1pzeXC.js";import"./index-RZtGeFqd.js";import"./api-D4LlywOg.js";import"./index-CgnDXXnk.js";import"./sheet-DIEpJtih.js";import"./index-D7DAgjK-.js";import"./x-CCdhgK-q.js";import"./i18n-BJbxNnVp.js";import"./button-CDXOgyjI.js";import"./index-CG5xR1wJ.js";import"./action-button-Dw9JCXdk.js";import"./dropdown-menu-l8KIoaEu.js";import"./index-6BA2E74k.js";import"./circle-CpoL3LDL.js";import"./check-qaMPOvd3.js";import"./separator-Dhjz-6If.js";import"./spinner-CefvX-dS.js";import"./rich-text-viewer-CXMdny0_.js";import"./toggle-CAZootMh.js";import"./single-avatar-C9hiXHoZ.js";import"./avatar-DYQI2sjF.js";import"./avatar.utils-CCIv9hLN.js";import"./hover-card-u80WLckk.js";import"./normalizeDates-E4YDy1Lo.js";import"./skeleton-C-zWscLG.js";const N={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ar={title:"Notes/NotesSliderSheet",component:n,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(L,{children:e.jsx(j,{config:N,children:e.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S()))]}},render:r=>e.jsx(n,{...r})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),S()))]}},args:{seqId:3},render:r=>e.jsx(n,{...r})},o={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),_.json([])))]}},args:{seqId:4},render:r=>e.jsx(n,{...r})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
