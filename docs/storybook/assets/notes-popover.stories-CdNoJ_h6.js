import{r as I,j as e,T as P,b as w,d as q,e as b}from"./iframe-BHfqIMzt.js";import{h as i,H as L}from"./index-D9Oo4RIl.js";import{B as C}from"./button-DT6SeUbn.js";import{P as k,a as A,b as E}from"./popover-BewSVhXe.js";import{u as H}from"./i18n-DJqZGQS-.js";import{M as S,N as M,L as B}from"./notes-container-C11ISRSS.js";import{C as D,A as s}from"./applications-config-C7w-V47M.js";import{n as p,g as T}from"./api-notes-DGDtiUYR.js";import{d as m}from"./delay-DOLz1Opg.js";import{B as O}from"./chunk-UVKPFVEO-BdZzg4Ed.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Ivg0BASX.js";import"./action-button-DRFMZGea.js";import"./dropdown-menu-rcpHAa0A.js";import"./index-BTPV-258.js";import"./index-CQhfjdm1.js";import"./check-C0u0WUKH.js";import"./circle-DGplIKvp.js";import"./separator-kpnGY0Sp.js";import"./api-B0qKpffM.js";import"./index-Cz41nXzz.js";import"./api-CyFX6UkQ.js";import"./rich-text-editor-Bg3Hx8zo.js";import"./toggle-BG2_-9HV.js";import"./underline-DbVG-LOq.js";import"./single-avatar-BJFmZuHP.js";import"./avatar-CgOkYsG5.js";import"./avatar.utils-DDjMvBrR.js";import"./hover-card-BkNiAhlR.js";import"./rich-text-viewer-xmev_oCY.js";import"./date-Dkgmc_Lc.js";import"./format-Br0zbitw.js";import"./skeleton-D18Wmj17.js";function t({hasNotes:r,..._}){const{t:c}=H(),d=I.useCallback(N=>{document.querySelector('[role="alertdialog"]')&&N.preventDefault()},[]);return e.jsxs(k,{children:[e.jsx(P,{children:e.jsxs(w,{children:[e.jsx(q,{asChild:!0,children:e.jsx(A,{asChild:!0,children:e.jsxs(C,{className:"relative size-6",iconOnly:!0,variant:"ghost",children:[e.jsx(S,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(b,{children:c(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(E,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:d,onInteractOutside:d,children:e.jsx(M,{..._})})]})}t.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""}}};const R={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},je={title:"Notes/Popover",component:t,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurenceId:"1"},decorators:[r=>e.jsx(O,{children:e.jsx(D,{config:R,children:e.jsx(B,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},o={parameters:{msw:{handlers:[i.get(p,async()=>(await m(500),T()))]}},render:r=>e.jsx(t,{...r})},a={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e4),T()))]}},args:{seqId:2},render:r=>e.jsx(t,{...r})},n={parameters:{msw:{handlers:[i.get(p,async()=>(await m(1e3),L.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(t,{...r})};var l,u,g;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,x,f;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(f=(x=a.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var v,y,j;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(j=(y=n.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};const Te=["Default","Loading","Empty"];export{o as Default,n as Empty,a as Loading,Te as __namedExportsOrder,je as default};
