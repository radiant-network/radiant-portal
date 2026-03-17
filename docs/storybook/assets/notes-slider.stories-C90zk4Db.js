import{j as e}from"./iframe-fuMeGN55.js";import{h as i,H as N}from"./index-DYijPhoE.js";import{u as w}from"./i18n-Cn9hqjYo.js";import{S,a as _,b as T,c as q,d as v}from"./sheet-CGYiUb76.js";import{N as L,L as H,n as p,g as I}from"./api-notes-CIriFbg0.js";import{C as A,A as s}from"./applications-config-BpCe7aBJ.js";import{B as E}from"./chunk-EPOLDU6W-DRaBYFCa.js";import{d as m}from"./delay-B4qYmvjT.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CtEfIZQb.js";import"./x-BEXx6cPD.js";import"./index-D-Epa_If.js";import"./index-D9AoZZ8d.js";import"./index-DFYN2R7l.js";import"./rich-text-viewer-BTeUgyGs.js";import"./separator-C8lzm_Mx.js";import"./index-xXWWjBr5.js";import"./toggle-BpeevsUU.js";import"./button-Bxfmps2v.js";import"./action-button-CNAnyKFq.js";import"./dropdown-menu-BWOWLXa_.js";import"./index-BcsYj1sj.js";import"./circle-Dx5yjyGq.js";import"./check-BpVxTnN5.js";import"./skeleton-DT8uST8g.js";import"./single-avatar-DINxp6-z.js";import"./avatar-DpyocMM4.js";import"./avatar.utils-RHyceIxZ.js";import"./hover-card-C-NHn6-I.js";import"./format-LIWdWRA8.js";import"./en-US-DpFScRkU.js";function t({...r}){const{t:d}=w();return e.jsx(S,{open:!0,children:e.jsxs(_,{side:"right",className:"flex flex-col w-full sm:max-w-lg p-0 gap-0",children:[e.jsxs(T,{className:"px-6 py-4",children:[e.jsx(q,{children:d("notes.variant.title")}),e.jsx(v,{className:"sr-only",children:d("notes.variant.title")})]}),e.jsx(L,{enableEmptyIcon:!0,...r})]})})}t.__docgenInfo={description:"",methods:[],displayName:"NotesSlider",props:{type:{required:!0,tsType:{name:"string"},description:""},caseId:{required:!0,tsType:{name:"string"},description:""},seqId:{required:!0,tsType:{name:"string"},description:""},taskId:{required:!0,tsType:{name:"string"},description:""},locusId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""}}};const b={variant_entity:{app_id:s.variant_entity},snv_occurrence:{app_id:s.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:s.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},de={title:"Notes/NotesSlider",component:t,args:{type:"variant",caseId:"1",seqId:"1",taskId:"1",locusId:"1"},decorators:[r=>e.jsx(E,{children:e.jsx(A,{config:b,children:e.jsx(H,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1100),I()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1e4),I()))]}},args:{seqId:"3"},render:r=>e.jsx(t,{...r})},o={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1e3),N.json([])))]}},args:{seqId:"4"},render:r=>e.jsx(t,{...r})};var c,l,u;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(notesListApi, async () => {
        await delay(1100);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesSlider {...args} />
}`,...(u=(l=n.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var g,h,y;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(notesListApi, async () => {
        await delay(10000);
        return getHTTPMockNotesList();
      })]
    }
  },
  args: {
    seqId: '3'
  },
  render: args => <NotesSlider {...args} />
}`,...(y=(h=a.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var x,f,j;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(notesListApi, async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })]
    }
  },
  args: {
    seqId: '4'
  },
  render: args => <NotesSlider {...args} />
}`,...(j=(f=o.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};const ce=["Default","Loading","Empty"];export{n as Default,o as Empty,a as Loading,ce as __namedExportsOrder,de as default};
