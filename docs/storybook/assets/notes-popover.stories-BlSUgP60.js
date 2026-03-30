import{j as e,T as N,b as I,d as w,e as P}from"./iframe-Bgw3uR-9.js";import{h as i,H as _}from"./index-4g0BD4zL.js";import{B as q}from"./button-Quz-tjMR.js";import{P as b,a as L,b as C}from"./popover-DHz1Hj8r.js";import{u as A}from"./i18n-BiGX2f4l.js";import{M as H,N as k,L as E}from"./notes-container-EGalaM_U.js";import{C as M,A as t}from"./applications-config-D0vlE3YL.js";import{n as p,g as j}from"./api-notes-COk_V8b4.js";import{d as m}from"./delay-D5osbGl8.js";import{B as S}from"./chunk-UVKPFVEO-Bd4vPBeP.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Dy2frFx_.js";import"./action-button-BkVWXcC6.js";import"./dropdown-menu-CCo1KQ2f.js";import"./index-BoUzJc-p.js";import"./circle-CQKKVFOR.js";import"./check-WdjjoOsi.js";import"./separator-JF2g8UGw.js";import"./index-yyHQaXcq.js";import"./api-DA-7dRzo.js";import"./index-DLfxwTg2.js";import"./rich-text-viewer-DmR-gF20.js";import"./toggle-uB5k-JtM.js";import"./single-avatar-sAqXxsVR.js";import"./avatar-8p14Xr68.js";import"./avatar.utils-CYlLYSB7.js";import"./hover-card-BiFs5SKt.js";import"./en-US-DpFScRkU.js";import"./skeleton-zYtuA3YD.js";function s({hasNotes:r,...T}){const{t:d}=A();return e.jsxs(b,{children:[e.jsx(N,{children:e.jsxs(I,{children:[e.jsx(w,{asChild:!0,children:e.jsx(L,{asChild:!0,children:e.jsxs(q,{className:"relative size-6",iconOnly:!0,variant:"ghost",children:[e.jsx(H,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(P,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(C,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",children:e.jsx(k,{...T})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""}}};const B={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ue={title:"Notes/Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(M,{config:B,children:e.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),j()))]}},render:r=>e.jsx(s,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),j()))]}},args:{seqId:2},render:r=>e.jsx(s,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),_.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(s,{...r})};var c,l,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...(u=(l=o.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var g,h,x;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(10000);
        return getHTTPMockNotesList();
      })]
    }
  },
  args: {
    seqId: 2
  },
  render: args => <NotesPopover {...args} />
}`,...(x=(h=a.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var f,y,v;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(1000);
        return HttpResponse.json([]);
      })]
    }
  },
  args: {
    hasNotes: false,
    seqId: 3
  },
  render: args => <NotesPopover {...args} />
}`,...(v=(y=n.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};const ge=["Default","Loading","Empty"];export{o as Default,n as Empty,a as Loading,ge as __namedExportsOrder,ue as default};
