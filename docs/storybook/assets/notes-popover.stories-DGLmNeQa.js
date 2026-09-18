import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{a as n,o as r}from"./cookieStore-DFp5m_DY.js";import{n as i,t as a}from"./http-BQTtTyo4.js";import{t as o}from"./jsx-runtime-BdxMnOeJ.js";import{a as s,i as c,r as l,t as u}from"./popover-UCzqOcX6.js";import{a as d,i as f,n as p,r as m,t as h}from"./tooltip-CfAUv4AB.js";import{n as g,t as _}from"./button-Cn480Lud.js";import{a as v,c as y,n as b,o as x,s as S,t as C}from"./notes-container-BlelSjMO.js";import{n as w,t as T}from"./i18n-87HgNCfy.js";import{m as E,w as D}from"./api-BJIZDprh.js";import{i as O,n as k}from"./story-section-DVTm6cGm.js";import{r as A,t as j}from"./lib-CZRp1gG1.js";import{i as M,n as N,t as P}from"./applications-config-D877dlRU.js";import{n as F,t as I}from"./delay-BUO-phQa.js";import{n as L,r as R,t as z}from"./api-notes-D7YH1BHL.js";function B({hasNotes:e,loading:t=!1,canComment:n=!0,...r}){let{t:i}=w(),a=(0,V.useCallback)(e=>{document.querySelector(`[role="alertdialog"]`)&&e.preventDefault()},[]);return!n&&!e?(0,H.jsx)(m,{children:(0,H.jsxs)(h,{children:[(0,H.jsx)(f,{asChild:!0,children:(0,H.jsx)(_,{className:`relative size-6 cursor-default hover:bg-transparent`,iconOnly:!0,variant:`ghost`,"aria-disabled":!0,children:(0,H.jsx)(S,{className:`text-muted-foreground/40`,size:16})})}),(0,H.jsx)(p,{children:i(`notes.variant.tooltip.none`)})]})}):(0,H.jsxs)(u,{children:[(0,H.jsx)(m,{children:(0,H.jsxs)(h,{children:[(0,H.jsx)(f,{asChild:!0,children:(0,H.jsx)(c,{asChild:!0,children:(0,H.jsxs)(_,{className:`relative size-6`,iconOnly:!0,variant:`ghost`,loading:t,children:[(0,H.jsx)(S,{className:e?`text-primary fill-primary/20`:`text-muted-foreground/40`,size:16}),e&&(0,H.jsx)(`span`,{className:`absolute top-0.5 right-0.5 size-1.5 rounded-full bg-primary pointer-events-none`})]})})}),(0,H.jsx)(p,{children:i(e?`notes.variant.tooltip.view`:`notes.variant.tooltip.add`)})]})}),(0,H.jsx)(l,{align:`start`,className:`w-105 p-0 gap-0 flex flex-col max-h-130`,onFocusOutside:a,onInteractOutside:a,children:(0,H.jsx)(C,{...r,canComment:n,enableSkeletonLoading:!1,withHeader:!0})})]})}var V,H;function U(){return(U=e((()=>{V=t(),y(),g(),s(),d(),T(),b(),H=o(),B.__docgenInfo={description:`Simple call to see if has comment`,methods:[],displayName:`NotesPopover`,props:{caseId:{required:!0,tsType:{name:`number`},description:``},seqId:{required:!0,tsType:{name:`number`},description:``},taskId:{required:!0,tsType:{name:`number`},description:``},occurrenceId:{required:!0,tsType:{name:`string`},description:``},enableEmptyIcon:{required:!1,tsType:{name:`boolean`},description:``},enableSkeletonLoading:{required:!1,tsType:{name:`boolean`},description:``},withHeader:{required:!1,tsType:{name:`boolean`},description:``},canComment:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},hasNotes:{required:!0,tsType:{name:`boolean`},description:``},loading:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`false`,computed:!1}}}}})))()}var W,G,K,q,J,Y,X;function Z(){return(Z=e((()=>{A(),F(),i(),r(),D(),U(),M(),x(),L(),O(),W=o(),G={variant_entity:{app_id:P.variant_entity},germline_snv_occurrence:{app_id:P.germline_snv_occurrence,aggregations:[],saved_filter_type:E.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:P.germline_cnv_occurrence,aggregations:[],saved_filter_type:E.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:P.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:E.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:P.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:E.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:P.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:E.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:P.admin},portal:{name:``,navigation:{}}},K={title:`Features/Notes/Notes Popover`,component:B,args:{hasNotes:!0,caseId:1,seqId:1,taskId:1,occurrenceId:`1`},decorators:[e=>(0,W.jsx)(j,{children:(0,W.jsx)(N,{config:G,children:(0,W.jsx)(v,{value:{sub:`1`,email:`johndoe@email.com`,name:`John Doe`},children:(0,W.jsx)(e,{})})})})]},q={parameters:{msw:{handlers:[a.get(R,async()=>(await I(500),z()))]}},render:e=>(0,W.jsx)(k,{title:`Default`,children:(0,W.jsx)(B,{...e})})},J={parameters:{msw:{handlers:[a.get(R,async()=>(await I(1e4),z()))]}},args:{seqId:2},render:e=>(0,W.jsx)(k,{title:`Loading`,children:(0,W.jsx)(B,{...e})})},Y={parameters:{msw:{handlers:[a.get(R,async()=>(await I(1e3),n.json([])))]}},args:{hasNotes:!1,seqId:3},render:e=>(0,W.jsx)(k,{title:`Empty`,children:(0,W.jsx)(B,{...e})})},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.get(notesListApi, async () => {
        await delay(500);
        return getHTTPMockNotesList();
      })]
    }
  },
  render: args => <StorySection title="Default">
      <NotesPopover {...args} />
    </StorySection>
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="Loading">
      <NotesPopover {...args} />
    </StorySection>
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="Empty">
      <NotesPopover {...args} />
    </StorySection>
}`,...Y.parameters?.docs?.source}}},X=[`Default`,`Loading`,`Empty`]})))()}Z();export{q as Default,Y as Empty,J as Loading,X as __namedExportsOrder,K as default};