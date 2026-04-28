import{j as r}from"./iframe-BzPXB4sC.js";import{h as i,H as S}from"./index-qKxtdwF4.js";import{N as o}from"./notes-slider-sheet-DO6NuGzY.js";import{C as j,A as t}from"./applications-config-zHvcd1fT.js";import{L as x}from"./notes-container-R0JIOd_-.js";import{n as m,g as w}from"./api-notes-BoK7J4CE.js";import{d as p}from"./delay-CewAD15l.js";import{B as L}from"./chunk-UVKPFVEO-CHJNbMil.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BskDNR1m.js";import"./api-B3xiDz_1.js";import"./index-CTLVmK5z.js";import"./sheet-BfBUakmC.js";import"./index-CqK1eFo3.js";import"./x-GpHZLcX6.js";import"./i18n-BfGFGaNE.js";import"./button-Bvx243Ne.js";import"./index-95tL82tM.js";import"./action-button-Db1BdDYf.js";import"./dropdown-menu-BdVey5jx.js";import"./index-ONVb-Tgn.js";import"./circle-BreiCpB9.js";import"./check-N4EqZ0NE.js";import"./separator-CrPHIJDG.js";import"./spinner-B54NVp7P.js";import"./rich-text-viewer-C7qm08Ry.js";import"./toggle-CDLwD5dg.js";import"./single-avatar-BVe1sdZh.js";import"./avatar-DAWufUk_.js";import"./avatar.utils-B226oddW.js";import"./hover-card-OL4fk-Pm.js";import"./date-YWIcJmjx.js";import"./skeleton-BsdIzALQ.js";const N={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ae={title:"Notes/NotesSliderSheet",component:o,args:{caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[e=>r.jsx(L,{children:r.jsx(j,{config:N,children:r.jsx(x,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:r.jsx(e,{})})})})]},s={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),w()))]}},render:e=>r.jsx(o,{...e})},a={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e4),w()))]}},args:{seqId:3},render:e=>r.jsx(o,{...e})},n={parameters:{msw:{handlers:[i.get(m,async()=>(await p(1e3),S.json([])))]}},args:{seqId:4},render:e=>r.jsx(o,{...e})};var c,d,g;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
