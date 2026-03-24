import{g as N,j as e,T as I,b as _,d as q,e as w}from"./iframe-BOYB6VZu.js";import{h as i,H as P}from"./index-BzE8WvFM.js";import{B as L}from"./button-l4JDDupZ.js";import{P as b,a as C,b as H}from"./popover-CDjbGwFi.js";import{u as k}from"./i18n-CQWl26Pa.js";import{N as A,L as M,n as p,g as j}from"./api-notes-CbeOPw2j.js";import{C as S,A as t}from"./applications-config-Cn9d8EPp.js";import{d as m}from"./delay-CaEKiLK8.js";import{B as z}from"./chunk-EPOLDU6W-lBLomK5x.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CIMqbMyN.js";import"./action-button-4NKFE7w1.js";import"./dropdown-menu-JfwOliNj.js";import"./index-IJOQfWhe.js";import"./circle-d3EpmDag.js";import"./check-Duw61Hy0.js";import"./separator-BUqn_ALp.js";import"./index-D-Epa_If.js";import"./index-CgWSV6nx.js";import"./index-Cxi2Nyp5.js";import"./rich-text-viewer-C_X41yyJ.js";import"./toggle-D2764vdk.js";import"./skeleton-DoqozV69.js";import"./single-avatar-CJNJwU1M.js";import"./avatar-CUFgjjwL.js";import"./avatar.utils-CgE348ba.js";import"./hover-card-CZcTbLeJ.js";import"./format-LIWdWRA8.js";import"./en-US-DpFScRkU.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]],B=N("MessageSquare",E);function s({hasNotes:r,...T}){const{t:d}=k();return e.jsxs(b,{children:[e.jsx(I,{children:e.jsxs(_,{children:[e.jsx(q,{asChild:!0,children:e.jsx(C,{asChild:!0,children:e.jsxs(L,{className:"relative size-6",iconOnly:!0,variant:"ghost",children:[e.jsx(B,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(w,{children:d(r?"notes.variant.tooltip.view":"note.variant.comments.tooltip.add")})]})}),e.jsx(H,{align:"start",className:"w-[420px] p-0 gap-0 flex flex-col max-h-[520px]",children:e.jsx(A,{...T})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{type:{required:!0,tsType:{name:"string"},description:""},caseId:{required:!0,tsType:{name:"string"},description:""},seqId:{required:!0,tsType:{name:"string"},description:""},taskId:{required:!0,tsType:{name:"string"},description:""},locusId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""}}};const R={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},he={title:"Notes/Popover",component:s,args:{hasNotes:!0,type:"variant",caseId:"1",seqId:"1",taskId:"1",locusId:"1"},decorators:[r=>e.jsx(z,{children:e.jsx(S,{config:R,children:e.jsx(M,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.post(p,async()=>(await m(500),j()))]}},render:r=>e.jsx(s,{...r})},a={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1e4),j()))]}},args:{seqId:"2"},render:r=>e.jsx(s,{...r})},n={parameters:{msw:{handlers:[i.post(p,async()=>(await m(1e3),P.json([])))]}},args:{hasNotes:!1,seqId:"3"},render:r=>e.jsx(s,{...r})};var c,l,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...(u=(l=o.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var g,h,x;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(notesListApi, async () => {
        await delay(10000);
        return getHTTPMockNotesList();
      })]
    }
  },
  args: {
    seqId: '2'
  },
  render: args => <NotesPopover {...args} />
}`,...(x=(h=a.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var y,v,f;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(notesListApi, async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })]
    }
  },
  args: {
    hasNotes: false,
    seqId: '3'
  },
  render: args => <NotesPopover {...args} />
}`,...(f=(v=n.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};const xe=["Default","Loading","Empty"];export{o as Default,n as Empty,a as Loading,xe as __namedExportsOrder,he as default};
