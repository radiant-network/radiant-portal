import{r as v,j as e,k as y,T as h,e as C,f as N,aa as x}from"./iframe-Cmiex3IG.js";import{h as p}from"./index-DsgVPzw1.js";import{S as s}from"./api-CNFUPySA.js";import{B as T}from"./button-DRstk-W3.js";import{P as j,a as I,b as E}from"./popover-D0fTgJi_.js";import{u as q}from"./i18n-BtP9BP9x.js";import{M as P,N as R,L as S}from"./notes-container-Cd2IVcP1.js";import{C as b,A as t}from"./applications-config-BEWoMBeD.js";import{n as c,g as u}from"./api-notes-QmGDI8KI.js";import{d as m}from"./delay-rbjIet9j.js";import{B as w}from"./chunk-QUQL4437-s57FPwL9.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bnaEmcFS.js";import"./action-button-bPFBQAma.js";import"./dropdown-menu-BUNcBeqG.js";import"./index-OjUxLgF4.js";import"./index-nnPp2JKR.js";import"./check-BHUZAyPW.js";import"./circle-CZF_B4Vk.js";import"./separator-VLxmM7Q3.js";import"./index-QN_ZCD1V.js";import"./api-qKCDbmki.js";import"./rich-text-editor-D2Z-Zu2l.js";import"./toggle-Cj08HMTg.js";import"./input-CFbeDT2i.js";import"./label-UpUCEQSt.js";import"./x-COuduTWL.js";import"./underline-CCsGW6m3.js";import"./user-avatar-CDVowrqx.js";import"./avatar-CAbJY0u8.js";import"./avatar.utils-C1EeCBXD.js";import"./hover-card-QIodBA2B.js";import"./rich-text-viewer-BFS-uyV-.js";import"./date-h3ZxJ6H4.js";import"./format-BODX5eoa.js";import"./skeleton-BpbtEim3.js";function o({hasNotes:r,loading:g=!1,..._}){const{t:d}=q(),l=v.useCallback(f=>{document.querySelector('[role="alertdialog"]')&&f.preventDefault()},[]);return e.jsxs(j,{children:[e.jsx(y,{children:e.jsxs(h,{children:[e.jsx(C,{asChild:!0,children:e.jsx(I,{asChild:!0,children:e.jsxs(T,{className:"relative size-6",iconOnly:!0,variant:"ghost",loading:g,children:[e.jsx(P,{className:r?"text-primary fill-primary/20":"text-muted-foreground/40",size:16}),r&&e.jsx("span",{className:"absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none"})]})})}),e.jsx(N,{children:d(r?"notes.variant.tooltip.view":"notes.variant.tooltip.add")})]})}),e.jsx(E,{align:"start",className:"w-105 p-0 gap-0 flex flex-col max-h-130",onFocusOutside:l,onInteractOutside:l,children:e.jsx(R,{..._,enableSkeletonLoading:!1})})]})}o.__docgenInfo={description:"Simple call to see if has comment",methods:[],displayName:"NotesPopover",props:{caseId:{required:!0,tsType:{name:"number"},description:""},seqId:{required:!0,tsType:{name:"number"},description:""},taskId:{required:!0,tsType:{name:"number"},description:""},occurrenceId:{required:!0,tsType:{name:"string"},description:""},enableEmptyIcon:{required:!1,tsType:{name:"boolean"},description:""},enableSkeletonLoading:{required:!1,tsType:{name:"boolean"},description:""},hasNotes:{required:!0,tsType:{name:"boolean"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const L={variant_entity:{app_id:t.variant_entity},germline_snv_occurrence:{app_id:t.germline_snv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:t.germline_cnv_occurrence,aggregations:[],saved_filter_type:s.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:t.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:t.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:t.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:s.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:t.admin},portal:{name:"",navigation:{}}},fe={title:"Notes/Popover",component:o,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:"1"},decorators:[r=>e.jsx(w,{children:e.jsx(b,{config:L,children:e.jsx(S,{value:{sub:"1",email:"johndoe@email.com",name:"John Doe"},children:e.jsx(r,{})})})})]},a={parameters:{msw:{handlers:[p.get(c,async()=>(await m(500),u()))]}},render:r=>e.jsx(o,{...r})},n={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e4),u()))]}},args:{seqId:2},render:r=>e.jsx(o,{...r})},i={parameters:{msw:{handlers:[p.get(c,async()=>(await m(1e3),x.json([])))]}},args:{hasNotes:!1,seqId:3},render:r=>e.jsx(o,{...r})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <NotesPopover {...args} />
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const ve=["Default","Loading","Empty"];export{a as Default,i as Empty,n as Loading,ve as __namedExportsOrder,fe as default};
