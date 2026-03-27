import{j as e,T as N,b as I,d as w,e as P}from"./iframe-DM8RWDl8.js";import{h as i,H as _}from"./index-C7TKO_nN.js";import{B as q}from"./button-C2DbAmSn.js";import{P as b,a as L,b as C}from"./popover-n94n309T.js";import{u as A}from"./i18n-B-79avnn.js";import{M as H,N as k,L as E}from"./notes-container-Du3fTxrA.js";import{C as M,A as t}from"./applications-config-3WNo6FZr.js";import{n as p,g as j}from"./api-notes-DrpfJKCv.js";import{d as m}from"./delay-0FDrAjZ2.js";import{B as S}from"./chunk-UVKPFVEO-vI7r9BMn.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Bon90g0q.js";import"./action-button-DN6fhMXW.js";import"./dropdown-menu-DxatbfOI.js";import"./index-HRycHZzQ.js";import"./circle-BbAi-DAd.js";import"./check-7b7-k0zD.js";import"./separator-DkqYGj_0.js";import"./index-C2LWFt_8.js";import"./api-DA-7dRzo.js";import"./index-ClvCpUvZ.js";import"./rich-text-viewer-oqHgd6g2.js";import"./toggle-CgP0pbgf.js";import"./single-avatar-CECIkn2p.js";import"./avatar-Bj7Q6fP1.js";import"./avatar.utils-B5FxlkvF.js";import"./hover-card-Bc2tqKob.js";import"./en-US-DpFScRkU.js";import"./skeleton-rtX3UF_C.js";function s({hasNotes:r,...T}){const{t:d}=A();return e.jsxs(b,{children:[e.jsx(N,{children:e.jsxs(I,{children:[e.jsx(w,{asChild:!0,children:e.jsx(L,{asChild:!0,children:e.jsxs(q,{className:"relative size-6",iconOnly:!0,variant:"ghost",children:[e.jsx(H,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(P,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(C,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",children:e.jsx(k,{...T})})]})}s.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""}}};const B={variant_entity:{app_id:t.variant_entity},snv_occurrence:{app_id:t.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:t.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},ue={title:"Notes/Popover",component:s,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(S,{children:e.jsx(M,{config:B,children:e.jsx(E,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),j()))]}},render:r=>e.jsx(s,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),j()))]}},args:{seqId:2},render:r=>e.jsx(s,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),_.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(s,{...r})};var c,l,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
