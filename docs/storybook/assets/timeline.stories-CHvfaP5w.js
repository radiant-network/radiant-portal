import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./toggle-C-8ssYp_.js";import{n as a,t as o}from"./utils-hYbUpBR2.js";import{n as s,t as c}from"./createLucideIcon-BZk7HdX5.js";import{n as l,t as u}from"./anchor-link-C7Xjb5sx.js";import{n as d,t as ee}from"./search-CmqwqpRU.js";import{n as f,t as p}from"./i18n-87HgNCfy.js";import{r as m,t as h}from"./badge-DhLjZdkB.js";var g,_;function te(){return(te=e((()=>{s(),g={name:`clipboard-plus`,size:24,node:[[`rect`,{width:`8`,height:`4`,x:`8`,y:`2`,rx:`1`,ry:`1`,key:`tgr4d6`}],[`path`,{d:`M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,key:`116196`}],[`path`,{d:`M9 14h6`,key:`159ibu`}],[`path`,{d:`M12 17v-6`,key:`1y8rbf`}]]},g.node,_=c(g)})))()}var v,y;function ne(){return(ne=e((()=>{s(),v={name:`pill`,size:24,node:[[`path`,{d:`m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z`,key:`wa1lgi`}],[`path`,{d:`m8.5 8.5 7 7`,key:`rvfmvr`}]]},v.node,y=c(v)})))()}var b,re;function ie(){return(ie=e((()=>{s(),b={name:`radiation`,size:24,node:[[`path`,{d:`M12 12h.01`,key:`1mp3jc`}],[`path`,{d:`M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z`,key:`1y4lzb`}],[`path`,{d:`M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z`,key:`163ggk`}],[`path`,{d:`M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z`,key:`1l9i0b`}]]},b.node,re=c(b)})))()}var x,ae;function oe(){return(oe=e((()=>{s(),x={name:`slice`,size:24,node:[[`path`,{d:`M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14`,key:`1sllp5`}]]},x.node,ae=c(x)})))()}function S({type:e,startDay:t,endDay:n,years:r,className:i}){let{t:a}=f(),s=w[e],c;return c=t===void 0?a(`timeline.marker.day_unknown`):n===void 0?a(`timeline.marker.day`,{day:t}):a(`timeline.marker.day_range`,{start:t,end:n}),(0,C.jsxs)(`div`,{className:o(`inline-flex items-center justify-end gap-2 font-mono text-foreground`,s.container,i),children:[(0,C.jsx)(`span`,{className:s.day,children:c}),r!==void 0&&(0,C.jsx)(`span`,{className:o(`border-l border-border pl-2 text-muted-foreground`,s.years),children:a(`timeline.marker.years`,{value:r.toFixed(1)})})]})}var C,w;function T(){return(T=e((()=>{p(),a(),C=n(),w={event:{day:`text-sm font-semibold`,years:`text-sm font-normal`,container:``},treatment:{day:`text-xs font-medium`,years:`text-xs font-normal`,container:`h-5`}},S.__docgenInfo={description:``,methods:[],displayName:`TimeMarker`,props:{type:{required:!0,tsType:{name:`union`,raw:`'event' | 'treatment'`,elements:[{name:`literal`,value:`'event'`},{name:`literal`,value:`'treatment'`}]},description:``},startDay:{required:!1,tsType:{name:`number`},description:``},endDay:{required:!1,tsType:{name:`number`},description:``},years:{required:!1,tsType:{name:`number`},description:``},className:{required:!1,tsType:{name:`string`},description:``}}}})))()}function E({type:e,size:t=`default`,className:n}){let{icon:r,className:i}=se[e],{wrapper:a,icon:s}=ce[t];return(0,D.jsx)(h,{"aria-hidden":!0,className:o(`justify-center rounded-full p-0`,a,i,n),children:(0,D.jsx)(r,{className:s})})}var D,se,ce;function O(){return(O=e((()=>{te(),ne(),ie(),oe(),m(),a(),D=n(),se={event:{icon:_,className:`bg-transparent text-muted-foreground`},surgery:{icon:ae,className:`bg-avatar-cyan text-avatar-cyan-foreground`},chemotherapy:{icon:y,className:`bg-avatar-lime text-avatar-lime-foreground`},radiation:{icon:re,className:`bg-avatar-orange text-avatar-orange-foreground`}},ce={sm:{wrapper:`size-5`,icon:`size-3.5!`},default:{wrapper:`size-6`,icon:`size-4!`}},E.__docgenInfo={description:``,methods:[],displayName:`TimelineBadge`,props:{type:{required:!0,tsType:{name:`union`,raw:`'event' | 'surgery' | 'chemotherapy' | 'radiation'`,elements:[{name:`literal`,value:`'event'`},{name:`literal`,value:`'surgery'`},{name:`literal`,value:`'chemotherapy'`},{name:`literal`,value:`'radiation'`}]},description:``},size:{required:!1,tsType:{name:`union`,raw:`'sm' | 'default'`,elements:[{name:`literal`,value:`'sm'`},{name:`literal`,value:`'default'`}]},description:``,defaultValue:{value:`'default'`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:``}}}})))()}function k({badge:e,marker:t,children:n,showLine:r=!0,className:i}){return(0,A.jsxs)(`div`,{className:o(`flex items-start gap-3 rounded-md px-3`,i),children:[(0,A.jsxs)(`div`,{className:`flex flex-col items-center gap-2 self-stretch py-2`,children:[e,r&&(0,A.jsx)(`div`,{className:`-mb-1 flex-1 border-l border-dashed border-primary/30`})]}),(0,A.jsx)(`div`,{className:`flex min-w-px flex-1 flex-col items-start py-2`,children:n}),t&&(0,A.jsx)(`div`,{className:`shrink-0 py-2`,children:t})]})}var A;function j(){return(j=e((()=>{a(),A=n(),k.__docgenInfo={description:``,methods:[],displayName:`TimelineRow`,props:{badge:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},marker:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},children:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},showLine:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},className:{required:!1,tsType:{name:`string`},description:``}}}})))()}function M({protocolNameAndArm:e,type:t,agents:n,isInitialTreatment:r,evidenceHref:i,startDay:a,endDay:o,years:s,showLine:c}){let{t:l}=f();return(0,N.jsxs)(k,{badge:(0,N.jsx)(E,{type:`chemotherapy`}),marker:(0,N.jsx)(S,{type:`treatment`,startDay:a,endDay:o,years:s}),showLine:c,className:`min-h-14`,children:[(0,N.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,N.jsx)(`span`,{children:e}),r&&(0,N.jsx)(h,{variant:`secondary`,children:l(`timeline.initial_treatment`)}),i&&(0,N.jsx)(u,{href:i,external:!0,size:`xs`,children:l(`timeline.evidence`)})]}),t&&(0,N.jsx)(`p`,{className:`text-muted-foreground text-xs`,children:t}),n&&n.length>0&&(0,N.jsx)(`div`,{className:`flex flex-wrap gap-1 pt-2`,children:n.map(e=>(0,N.jsx)(h,{variant:`outline`,children:e},e))})]})}var N;function le(){return(le=e((()=>{l(),m(),T(),O(),j(),p(),N=n(),M.__docgenInfo={description:``,methods:[],displayName:`Chemotherapy`,props:{protocolNameAndArm:{required:!0,tsType:{name:`string`},description:``},type:{required:!1,tsType:{name:`string`},description:``},agents:{required:!1,tsType:{name:`Array`,elements:[{name:`string`}],raw:`string[]`},description:``},isInitialTreatment:{required:!1,tsType:{name:`boolean`},description:``},evidenceHref:{required:!1,tsType:{name:`string`},description:``},startDay:{required:!1,tsType:{name:`number`},description:``},endDay:{required:!1,tsType:{name:`number`},description:``},years:{required:!1,tsType:{name:`number`},description:``},showLine:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}function P({label:e,value:t,className:n}){return(0,F.jsxs)(`span`,{className:o(`inline-flex items-center gap-1 text-xs`,n),children:[(0,F.jsxs)(`span`,{className:`text-muted-foreground`,children:[e,`:`]}),(0,F.jsx)(`span`,{className:`text-foreground font-medium`,children:t})]})}var F;function I(){return(I=e((()=>{a(),F=n(),P.__docgenInfo={description:``,methods:[],displayName:`TimelineLabel`,props:{label:{required:!0,tsType:{name:`string`},description:``},value:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},className:{required:!1,tsType:{name:`string`},description:``}}}})))()}function L({type:e,cnsIntegratedDiagnosis:t,description:n,evidenceHref:r,startDay:i,years:a,showLine:o}){let{t:s}=f();return(0,R.jsxs)(k,{badge:(0,R.jsx)(E,{type:`event`}),marker:(0,R.jsx)(S,{type:`event`,startDay:i,years:a}),showLine:o,className:`bg-muted`,children:[(0,R.jsxs)(`div`,{className:`flex items-center gap-2 text-base font-semibold`,children:[(0,R.jsx)(`span`,{children:e}),t&&(0,R.jsxs)(R.Fragment,{children:[(0,R.jsx)(`span`,{children:`•`}),(0,R.jsx)(`span`,{children:t})]}),r&&(0,R.jsx)(u,{href:r,external:!0,size:`xs`,children:s(`timeline.evidence`)})]}),n&&n.length>0&&(0,R.jsx)(`div`,{className:`flex flex-wrap items-center gap-x-2 gap-y-1`,children:n.map((e,t)=>(0,R.jsx)(P,{label:e.label,value:e.value},t))})]})}var R;function z(){return(z=e((()=>{l(),T(),O(),I(),j(),p(),R=n(),L.__docgenInfo={description:``,methods:[],displayName:`Event`,props:{type:{required:!0,tsType:{name:`string`},description:``},cnsIntegratedDiagnosis:{required:!1,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{ label: string; value: React.ReactNode }`,signature:{properties:[{key:`label`,value:{name:`string`,required:!0}},{key:`value`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}}]}}],raw:`EventDescriptionItem[]`},description:``},evidenceHref:{required:!1,tsType:{name:`string`},description:``},startDay:{required:!1,tsType:{name:`number`},description:``},years:{required:!1,tsType:{name:`number`},description:``},showLine:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}function B({site:e,type:t,description:n,isInitialTreatment:r,evidenceHref:i,startDay:a,endDay:o,years:s,showLine:c}){let{t:l}=f();return(0,V.jsxs)(k,{badge:(0,V.jsx)(E,{type:`radiation`}),marker:(0,V.jsx)(S,{type:`treatment`,startDay:a,endDay:o,years:s}),showLine:c,className:`min-h-14`,children:[(0,V.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,V.jsx)(`span`,{children:e}),t&&(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`span`,{children:`•`}),(0,V.jsx)(`span`,{children:t})]}),r&&(0,V.jsx)(h,{variant:`secondary`,children:l(`timeline.initial_treatment`)}),i&&(0,V.jsx)(u,{href:i,external:!0,size:`xs`,children:l(`timeline.evidence`)})]}),n&&n.length>0&&(0,V.jsx)(`div`,{className:`flex items-center gap-2`,children:n.map((e,t)=>(0,V.jsx)(P,{label:e.label,value:e.value},t))})]})}var V;function H(){return(H=e((()=>{l(),m(),T(),O(),I(),j(),p(),V=n(),B.__docgenInfo={description:``,methods:[],displayName:`Radiation`,props:{site:{required:!0,tsType:{name:`string`},description:``},type:{required:!1,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{ label: string; value: React.ReactNode }`,signature:{properties:[{key:`label`,value:{name:`string`,required:!0}},{key:`value`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}}]}}],raw:`RadiationDescriptionItem[]`},description:``},isInitialTreatment:{required:!1,tsType:{name:`boolean`},description:``},evidenceHref:{required:!1,tsType:{name:`string`},description:``},startDay:{required:!1,tsType:{name:`number`},description:``},endDay:{required:!1,tsType:{name:`number`},description:``},years:{required:!1,tsType:{name:`number`},description:``},showLine:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}function U({extentOfTumorResection:e,description:t,isInitialTreatment:n,evidenceHref:r,startDay:i,years:a,showLine:o}){let{t:s}=f();return(0,W.jsxs)(k,{badge:(0,W.jsx)(E,{type:`surgery`}),marker:(0,W.jsx)(S,{type:`treatment`,startDay:i,years:a}),showLine:o,className:`min-h-14`,children:[(0,W.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,W.jsx)(`span`,{children:e}),n&&(0,W.jsx)(h,{variant:`secondary`,children:s(`timeline.initial_treatment`)}),r&&(0,W.jsx)(u,{href:r,external:!0,size:`xs`,children:s(`timeline.evidence`)})]}),t&&(0,W.jsx)(`p`,{className:`text-muted-foreground text-xs`,children:t})]})}var W;function ue(){return(ue=e((()=>{l(),m(),T(),O(),j(),p(),W=n(),U.__docgenInfo={description:``,methods:[],displayName:`Surgery`,props:{extentOfTumorResection:{required:!0,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`string`},description:``},isInitialTreatment:{required:!1,tsType:{name:`boolean`},description:``},evidenceHref:{required:!1,tsType:{name:`string`},description:``},startDay:{required:!1,tsType:{name:`number`},description:``},years:{required:!1,tsType:{name:`number`},description:``},showLine:{required:!1,tsType:{name:`boolean`},description:``}}}})))()}function G({title:e,description:t,events:n=[],surgeries:r=[],radiations:a=[],chemotherapies:s=[]}){let{t:c}=f(),[l,u]=(0,K.useState)(new Set),d=l.size===0,p=(0,K.useMemo)(()=>[...n.map(e=>({kind:`event`,day:e.startDay,props:e})),...r.map(e=>({kind:`surgery`,day:e.startDay,props:e})),...a.map(e=>({kind:`radiation`,day:e.startDay,props:e})),...s.map(e=>({kind:`chemotherapy`,day:e.startDay,props:e}))].sort((e,t)=>(e.day??1/0)-(t.day??1/0)),[n,r,a,s]),m=(0,K.useMemo)(()=>{let e={event:0,surgery:0,radiation:0,chemotherapy:0};for(let t of p)e[t.kind]+=1;return{all:p.length,...e}},[p]),h=(0,K.useMemo)(()=>d?p:p.filter(e=>l.has(e.kind)),[p,l,d]),g=(0,K.useCallback)(()=>{u(e=>e.size===0?e:new Set)},[]),_=(0,K.useCallback)(e=>{u(t=>{let n=new Set(t);return n.has(e)?n.delete(e):n.add(e),n.size===4?new Set:n})},[]);return(0,q.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(e||t)&&(0,q.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[e&&(0,q.jsx)(`h2`,{className:`text-xl font-semibold`,children:e}),t&&(0,q.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:t})]}),(0,q.jsxs)(`div`,{role:`group`,"aria-label":c(`a11y.timeline.filters_group`),className:`bg-background sticky top-0 z-10 flex flex-wrap items-center gap-2 py-2`,children:[(0,q.jsxs)(i,{pressed:d,onPressedChange:g,className:o(J,d&&`bg-muted`),children:[(0,q.jsx)(`span`,{children:c(`timeline.filters.all`)}),(0,q.jsx)(`span`,{className:`text-muted-foreground`,children:m.all})]}),de.map(e=>{let t=l.has(e.kind);return(0,q.jsxs)(i,{pressed:t,onPressedChange:()=>_(e.kind),className:o(J,t&&e.activeClassName),children:[(0,q.jsx)(E,{type:e.badgeType,size:`sm`}),(0,q.jsx)(`span`,{children:c(e.i18nKey)}),(0,q.jsx)(`span`,{className:`text-muted-foreground`,children:m[e.kind]})]},e.kind)})]}),(0,q.jsx)(`div`,{role:`status`,"aria-live":`polite`,className:`sr-only`,children:c(`a11y.timeline.results_count`,{count:h.length})}),h.length===0?(0,q.jsxs)(`div`,{className:`flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-10`,children:[(0,q.jsx)(`div`,{className:`flex size-10 items-center justify-center rounded-md border bg-background`,children:(0,q.jsx)(ee,{className:`size-5`,"aria-hidden":!0})}),(0,q.jsx)(`p`,{className:`text-base font-semibold`,children:c(`timeline.empty.title`)}),(0,q.jsx)(`p`,{className:`text-muted-foreground text-sm`,children:c(`timeline.empty.description`)})]}):(0,q.jsx)(`ol`,{className:`list-none pl-0`,children:h.map((e,t)=>{let n=t<h.length-1,r=`${e.kind}-${e.day}-${t}`,i;switch(e.kind){case`event`:i=(0,q.jsx)(L,{...e.props,showLine:n});break;case`surgery`:i=(0,q.jsx)(U,{...e.props,showLine:n});break;case`radiation`:i=(0,q.jsx)(B,{...e.props,showLine:n});break;case`chemotherapy`:i=(0,q.jsx)(M,{...e.props,showLine:n})}return(0,q.jsx)(`li`,{children:i},r)})})]})}var K,q,de,J;function fe(){return(fe=e((()=>{K=t(),d(),r(),p(),a(),le(),z(),H(),ue(),O(),q=n(),de=[{kind:`event`,i18nKey:`timeline.filters.events`,badgeType:`event`,activeClassName:`bg-muted`},{kind:`surgery`,i18nKey:`timeline.filters.surgery`,badgeType:`surgery`,activeClassName:`bg-avatar-cyan`},{kind:`chemotherapy`,i18nKey:`timeline.filters.chemotherapy`,badgeType:`chemotherapy`,activeClassName:`bg-avatar-lime`},{kind:`radiation`,i18nKey:`timeline.filters.radiation`,badgeType:`radiation`,activeClassName:`bg-avatar-orange`}],J=`h-7 gap-2 rounded-md px-2 text-sm font-normal`,G.__docgenInfo={description:``,methods:[],displayName:`Timeline`,props:{title:{required:!1,tsType:{name:`string`},description:``},description:{required:!1,tsType:{name:`string`},description:``},events:{required:!1,tsType:{name:`Array`,elements:[{name:`ComponentProps`,elements:[{name:`Event`}],raw:`ComponentProps<typeof Event>`}],raw:`ComponentProps<typeof Event>[]`},description:``,defaultValue:{value:`[]`,computed:!1}},surgeries:{required:!1,tsType:{name:`Array`,elements:[{name:`ComponentProps`,elements:[{name:`Surgery`}],raw:`ComponentProps<typeof Surgery>`}],raw:`ComponentProps<typeof Surgery>[]`},description:``,defaultValue:{value:`[]`,computed:!1}},radiations:{required:!1,tsType:{name:`Array`,elements:[{name:`ComponentProps`,elements:[{name:`Radiation`}],raw:`ComponentProps<typeof Radiation>`}],raw:`ComponentProps<typeof Radiation>[]`},description:``,defaultValue:{value:`[]`,computed:!1}},chemotherapies:{required:!1,tsType:{name:`Array`,elements:[{name:`ComponentProps`,elements:[{name:`Chemotherapy`}],raw:`ComponentProps<typeof Chemotherapy>`}],raw:`ComponentProps<typeof Chemotherapy>[]`},description:``,defaultValue:{value:`[]`,computed:!1}}}}})))()}var Y,pe,X,Z,Q,$,me;function he(){return(he=e((()=>{fe(),Y=n(),pe={title:`Components/Timeline`,component:G},X={render:()=>(0,Y.jsx)(`div`,{className:`w-[720px]`,children:(0,Y.jsx)(G,{title:`Clinical Timeline`,description:`Disease events, surgeries, radiation and medical therapy by age in days since birth.`,events:[{type:`Initial`,cnsIntegratedDiagnosis:`ATRT-MYC`,description:[{label:`Tumor locations`,value:`Frontal lobe`},{label:`Metastasis`,value:`No`}],evidenceHref:`#`,startDay:819,years:2.2},{type:`Recurrence`,cnsIntegratedDiagnosis:`ATRT, NOS or NEC`,description:[{label:`Tumor locations`,value:`Posterior fossa`},{label:`Metastasis`,value:`Yes`}],evidenceHref:`#`,startDay:1135,years:3.1},{type:`Deceased`,cnsIntegratedDiagnosis:`ATRT, NOS or NEC`,startDay:1343,years:3.7}],surgeries:[{extentOfTumorResection:`Gross/Near total resection`,description:`Treatment follows a protocol but subject is not enrolled`,isInitialTreatment:!0,evidenceHref:`#`,startDay:820,years:2.2},{extentOfTumorResection:`Biopsy only`,startDay:1140,years:3.1}],chemotherapies:[{protocolNameAndArm:`DCFI Modified RS-II`,type:`Initial treatment`,agents:[`cisplatin`,`cyclophosphamide`,`vincristine`,`etoposide`,`methotrexate`],isInitialTreatment:!0,evidenceHref:`#`,startDay:830,endDay:1050,years:2.3},{protocolNameAndArm:`Chemotherapy`,type:`Treatment follows other standard of care`,agents:[`thalidomide`,`etoposide`,`cyclophosphamide`,`fenofibrate`,`celebrex`],evidenceHref:`#`,startDay:1208,endDay:1298,years:3.3}],radiations:[{site:`Focal/Tumor bed`,type:`Protons`,description:[{label:`Dose`,value:`5400 cGy`}],evidenceHref:`#`,startDay:991,endDay:1023,years:2.3}]})})},Z={render:()=>(0,Y.jsx)(`div`,{className:`w-[720px]`,children:(0,Y.jsx)(G,{title:`Clinical Timeline`,description:`Disease events, surgeries, radiation and medical therapy by age in days since birth.`})})},Q={render:()=>(0,Y.jsx)(`div`,{className:`w-[720px]`,children:(0,Y.jsx)(G,{title:`Clinical Timeline`,description:`Disease events, surgeries, radiation and medical therapy by age in days since birth.`,events:[{type:`Initial`,cnsIntegratedDiagnosis:`ATRT-MYC`,description:[{label:`Tumor locations`,value:`Frontal lobe`},{label:`Metastasis`,value:`No`}],evidenceHref:`#`,startDay:819,years:2.2},{type:`Recurrence`,cnsIntegratedDiagnosis:`ATRT, NOS or NEC`,description:[{label:`Tumor locations`,value:`Posterior fossa`},{label:`Metastasis`,value:`Yes`}],evidenceHref:`#`,startDay:1135,years:3.1},{type:`Deceased`,cnsIntegratedDiagnosis:`ATRT, NOS or NEC`,startDay:1343,years:3.7}],chemotherapies:[{protocolNameAndArm:`DCFI Modified RS-II`,type:`Initial treatment`,agents:[`cisplatin`,`cyclophosphamide`,`vincristine`,`etoposide`,`methotrexate`],isInitialTreatment:!0,evidenceHref:`#`,startDay:830,endDay:1050,years:2.3}],radiations:[{site:`Focal/Tumor bed`,type:`Protons`,description:[{label:`Dose`,value:`5400 cGy`}],evidenceHref:`#`,startDay:991,endDay:1023,years:2.3}]})})},$={render:()=>(0,Y.jsx)(`div`,{className:`h-[500px] w-[720px] overflow-y-auto rounded-md border px-4 pb-4`,children:(0,Y.jsx)(G,{title:`Clinical Timeline`,description:`Scroll down — the filter bar stays pinned at the top.`,events:Array.from({length:10},(e,t)=>({type:[`Initial`,`Progressive`,`Recurrence`][t%3],cnsIntegratedDiagnosis:`ATRT-MYC`,description:[{label:`Tumor locations`,value:`Frontal lobe`},{label:`Metastasis`,value:t%2==0?`No`:`Yes`}],startDay:500+t*120,years:(500+t*120)/365.25})),surgeries:Array.from({length:5},(e,t)=>({extentOfTumorResection:t%2==0?`Gross/Near total resection`:`Biopsy only`,isInitialTreatment:t===0,startDay:550+t*250,years:(550+t*250)/365.25})),chemotherapies:Array.from({length:6},(e,t)=>({protocolNameAndArm:`Protocol ${t+1}`,type:`Standard of care`,agents:[`cisplatin`,`etoposide`,`vincristine`],startDay:600+t*180,endDay:700+t*180,years:(600+t*180)/365.25})),radiations:Array.from({length:3},(e,t)=>({site:t===0?`Focal/Tumor bed`:`Craniospinal`,type:`Protons`,description:[{label:`Dose`,value:`${3600+t*200} cGy`}],startDay:800+t*400,endDay:830+t*400,years:(800+t*400)/365.25}))})})},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[720px]">
      <Timeline title="Clinical Timeline" description="Disease events, surgeries, radiation and medical therapy by age in days since birth." events={[{
      type: 'Initial',
      cnsIntegratedDiagnosis: 'ATRT-MYC',
      description: [{
        label: 'Tumor locations',
        value: 'Frontal lobe'
      }, {
        label: 'Metastasis',
        value: 'No'
      }],
      evidenceHref: '#',
      startDay: 819,
      years: 2.2
    }, {
      type: 'Recurrence',
      cnsIntegratedDiagnosis: 'ATRT, NOS or NEC',
      description: [{
        label: 'Tumor locations',
        value: 'Posterior fossa'
      }, {
        label: 'Metastasis',
        value: 'Yes'
      }],
      evidenceHref: '#',
      startDay: 1135,
      years: 3.1
    }, {
      type: 'Deceased',
      cnsIntegratedDiagnosis: 'ATRT, NOS or NEC',
      startDay: 1343,
      years: 3.7
    }]} surgeries={[{
      extentOfTumorResection: 'Gross/Near total resection',
      description: 'Treatment follows a protocol but subject is not enrolled',
      isInitialTreatment: true,
      evidenceHref: '#',
      startDay: 820,
      years: 2.2
    }, {
      extentOfTumorResection: 'Biopsy only',
      startDay: 1140,
      years: 3.1
    }]} chemotherapies={[{
      protocolNameAndArm: 'DCFI Modified RS-II',
      type: 'Initial treatment',
      agents: ['cisplatin', 'cyclophosphamide', 'vincristine', 'etoposide', 'methotrexate'],
      isInitialTreatment: true,
      evidenceHref: '#',
      startDay: 830,
      endDay: 1050,
      years: 2.3
    }, {
      protocolNameAndArm: 'Chemotherapy',
      type: 'Treatment follows other standard of care',
      agents: ['thalidomide', 'etoposide', 'cyclophosphamide', 'fenofibrate', 'celebrex'],
      evidenceHref: '#',
      startDay: 1208,
      endDay: 1298,
      years: 3.3
    }]} radiations={[{
      site: 'Focal/Tumor bed',
      type: 'Protons',
      description: [{
        label: 'Dose',
        value: '5400 cGy'
      }],
      evidenceHref: '#',
      startDay: 991,
      endDay: 1023,
      years: 2.3
    }]} />
    </div>
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[720px]">
      <Timeline title="Clinical Timeline" description="Disease events, surgeries, radiation and medical therapy by age in days since birth." />
    </div>
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-[720px]">
      <Timeline title="Clinical Timeline" description="Disease events, surgeries, radiation and medical therapy by age in days since birth." events={[{
      type: 'Initial',
      cnsIntegratedDiagnosis: 'ATRT-MYC',
      description: [{
        label: 'Tumor locations',
        value: 'Frontal lobe'
      }, {
        label: 'Metastasis',
        value: 'No'
      }],
      evidenceHref: '#',
      startDay: 819,
      years: 2.2
    }, {
      type: 'Recurrence',
      cnsIntegratedDiagnosis: 'ATRT, NOS or NEC',
      description: [{
        label: 'Tumor locations',
        value: 'Posterior fossa'
      }, {
        label: 'Metastasis',
        value: 'Yes'
      }],
      evidenceHref: '#',
      startDay: 1135,
      years: 3.1
    }, {
      type: 'Deceased',
      cnsIntegratedDiagnosis: 'ATRT, NOS or NEC',
      startDay: 1343,
      years: 3.7
    }]} chemotherapies={[{
      protocolNameAndArm: 'DCFI Modified RS-II',
      type: 'Initial treatment',
      agents: ['cisplatin', 'cyclophosphamide', 'vincristine', 'etoposide', 'methotrexate'],
      isInitialTreatment: true,
      evidenceHref: '#',
      startDay: 830,
      endDay: 1050,
      years: 2.3
    }]} radiations={[{
      site: 'Focal/Tumor bed',
      type: 'Protons',
      description: [{
        label: 'Dose',
        value: '5400 cGy'
      }],
      evidenceHref: '#',
      startDay: 991,
      endDay: 1023,
      years: 2.3
    }]} />
    </div>
}`,...Q.parameters?.docs?.source}}},$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  render: () => <div className="h-[500px] w-[720px] overflow-y-auto rounded-md border px-4 pb-4">
      <Timeline title="Clinical Timeline" description="Scroll down — the filter bar stays pinned at the top." events={Array.from({
      length: 10
    }, (_, i) => ({
      type: ['Initial', 'Progressive', 'Recurrence'][i % 3],
      cnsIntegratedDiagnosis: 'ATRT-MYC',
      description: [{
        label: 'Tumor locations',
        value: 'Frontal lobe'
      }, {
        label: 'Metastasis',
        value: i % 2 === 0 ? 'No' : 'Yes'
      }],
      startDay: 500 + i * 120,
      years: (500 + i * 120) / 365.25
    }))} surgeries={Array.from({
      length: 5
    }, (_, i) => ({
      extentOfTumorResection: i % 2 === 0 ? 'Gross/Near total resection' : 'Biopsy only',
      isInitialTreatment: i === 0,
      startDay: 550 + i * 250,
      years: (550 + i * 250) / 365.25
    }))} chemotherapies={Array.from({
      length: 6
    }, (_, i) => ({
      protocolNameAndArm: \`Protocol \${i + 1}\`,
      type: 'Standard of care',
      agents: ['cisplatin', 'etoposide', 'vincristine'],
      startDay: 600 + i * 180,
      endDay: 700 + i * 180,
      years: (600 + i * 180) / 365.25
    }))} radiations={Array.from({
      length: 3
    }, (_, i) => ({
      site: i === 0 ? 'Focal/Tumor bed' : 'Craniospinal',
      type: 'Protons',
      description: [{
        label: 'Dose',
        value: \`\${3600 + i * 200} cGy\`
      }],
      startDay: 800 + i * 400,
      endDay: 830 + i * 400,
      years: (800 + i * 400) / 365.25
    }))} />
    </div>
}`,...$.parameters?.docs?.source}}},me=[`Default`,`Empty`,`WithOneEmptyResult`,`Long`]})))()}he();export{X as Default,Z as Empty,$ as Long,Q as WithOneEmptyResult,me as __namedExportsOrder,pe as default};