import{j as e,T as j,b as I,d as E,e as R}from"./iframe-BIVZNcDx.js";import{h as p,H as w}from"./index-DHrLodiX.js";import{S as s}from"./api-ok7Ado9G.js";import{B as P}from"./button-6N62lUpo.js";import{P as q,a as L,b as S}from"./popover-Cy4LFm9B.js";import{u as b}from"./i18n-BkDRdn4X.js";import{M,N as O,L as A}from"./notes-container-6mZvqNGH.js";import{C as H,A as t}from"./applications-config-Bfz_Xc4S.js";import{n as m,g as x}from"./api-notes-Dt1-02Mq.js";import{d as c}from"./delay-C3yQAyou.js";import{B as V}from"./chunk-UVKPFVEO-DkEhpWYP.js";import"./preload-helper-Dp1pzeXC.js";import"./index-D37jQc6A.js";import"./action-button-Dp1yU_WD.js";import"./dropdown-menu-DPDJlzat.js";import"./index-DQWZ93FF.js";import"./index-D5OUmr5s.js";import"./check-oh_5MiUz.js";import"./circle-Bz-lEpPj.js";import"./separator-Dwai73g_.js";import"./api-BNnkDz4h.js";import"./index-BMZKsHUR.js";import"./rich-text-editor-C3JFdCgL.js";import"./toggle-Dcc4ejOn.js";import"./input-DYazXf9D.js";import"./label-CJsIthia.js";import"./x-CM_jdjpH.js";import"./underline-6g7w6YzV.js";import"./single-avatar-CadK2YzN.js";import"./avatar-9mLZSRJJ.js";import"./avatar.utils-jAVZ0CdN.js";import"./hover-card-CYKo2rKi.js";import"./rich-text-viewer-BV4ePfPP.js";import"./date-DotMPcgr.js";import"./format-DUIX5wlz.js";import"./skeleton-BGpQmToc.js";function o({hasNotes:r,loading:C=!1,...T}){const{t:d}=b();return e.jsxs(q,{modal:!0,children:[e.jsx(j,{children:e.jsxs(I,{children:[e.jsx(E,{asChild:!0,children:e.jsx(L,{asChild:!0,children:e.jsxs(P,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:C,children:[e.jsx(M,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(R,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(S,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",children:e.jsx(O,{...T})})]})}o.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const k={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},Ce={title:"Notes/Popover",component:o,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(V,{children:e.jsx(H,{config:k,children:e.jsx(A,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(m,async()=>(await c(500),x()))]}},render:r=>e.jsx(o,{...r})},n={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e4),x()))]}},args:{seqId:2},render:r=>e.jsx(o,{...r})},i={parameters:{msw:{handlers:[p.get(m,async()=>(await c(1e3),w.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(o,{...r})};var l,u,g;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...(g=(u=a.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var _,v,f;n.parameters={...n.parameters,docs:{...(_=n.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(f=(v=n.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var h,y,N;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(N=(y=i.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};const Te=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,Te as __namedExportsOrder,Ce as default};
