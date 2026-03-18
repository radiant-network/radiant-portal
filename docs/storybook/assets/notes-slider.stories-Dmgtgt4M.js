import{j as e}from"./iframe--UGfF5q5.js";import{h as i,H as N}from"./index-CyltVVXF.js";import{u as w}from"./i18n-BUdYya6t.js";import{S,a as _,b as T,c as q,d as v}from"./sheet-Dcn8-fMw.js";import{N as L,L as H,n as p,g as I}from"./api-notes-DwMf6zeJ.js";import{C as A,A as s}from"./applications-config-Dr_l_Yv6.js";import{B as E}from"./chunk-EPOLDU6W-GFu8T3Tl.js";import{d as m}from"./delay-DnNccVqg.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CTTTYShi.js";import"./x-CxlOz3e4.js";import"./index-D-Epa_If.js";import"./index-DcEGsNW8.js";import"./index-C3pgVS3R.js";import"./rich-text-viewer-DBrkczpm.js";import"./separator-DHgehW6X.js";import"./index-BX7vQtU5.js";import"./toggle-BPer3aAq.js";import"./button-B_OLTHm3.js";import"./action-button-BNY1ZIOd.js";import"./dropdown-menu-DjcaolQz.js";import"./index-Cn4IGCES.js";import"./circle-Cv3LLey1.js";import"./check-D_hDBE2u.js";import"./skeleton-CVYtN13Z.js";import"./single-avatar-CrGVPKss.js";import"./avatar-DrURrLQM.js";import"./avatar.utils-D8oQmiPQ.js";import"./hover-card-_VmPfiPx.js";import"./format-LIWdWRA8.js";import"./en-US-DpFScRkU.js";function t({...r}){const{t:d}=w();return e.jsx(S,{open:!0,children:e.jsxs(_,{side:"right",className:"flex flex-col w-full sm:max-w-lg p-0 gap-0",children:[e.jsxs(T,{className:"px-6 py-4",children:[e.jsx(q,{children:d("notes.variant.title")}),e.jsx(v,{className:"sr-only",children:d("notes.variant.title")})]}),e.jsx(L,{enableEmptyIcon:!0,...r})]})})}t.__docgenInfo={description:"",methods:[],displayName:"NotesSlider",props:{type:{required:!0,tsType:{name:"string"},description:""},caseId:{required:!0,tsType:{name:"string"},description:""},seqId:{required:!0,tsType:{name:"string"},description:""},taskId:{required:!0,tsType:{name:"string"},description:""},locusId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""}}};const b={variant_entity:{app_id:s.variant_entity},snv_occurrence:{app_id:s.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:s.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},de={title:"Notes/NotesSlider",component:t,args:{type:"variant",caseId:"1",seqId:"1",taskId:"1",locusId:"1"},decorators:[r=>e.jsx(E,{children:e.jsx(A,{config:b,children:e.jsx(H,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},n={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1100),I()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1e4),I()))]}},args:{seqId:"3"},render:r=>e.jsx(t,{...r})},o={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1e3),N.json([])))]}},args:{seqId:"4"},render:r=>e.jsx(t,{...r})};var c,l,u;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
