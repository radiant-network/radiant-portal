import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{a as n,o as r}from"./cookieStore-DFp5m_DY.js";import{n as i,t as a}from"./http-BQTtTyo4.js";import{t as o}from"./jsx-runtime-BdxMnOeJ.js";import{a as s,d as ee,f as te,h as c,m as ne,p as l,r as re,s as u,t as d}from"./dropdown-menu-SOZyNO6p.js";import{a as f,i as ie,n as ae,t as oe}from"./tooltip-CfAUv4AB.js";import{n as p,t as se}from"./utils-hYbUpBR2.js";import{n as m,t as h}from"./chevron-down-GEWks4uL.js";import{n as g,t as _}from"./i18n-87HgNCfy.js";import{D as v,m as y,r as b}from"./api-Cjn1gPrX.js";import{a as ce,n as le}from"./api-C0kFoDWb.js";import{a as ue,r as de}from"./use-tenant-Dxx7ZnDi.js";import{i as fe,n as x,r as S,t as C}from"./story-section-DVTm6cGm.js";import{n as pe,r as me}from"./badge-DhLjZdkB.js";import{n as w,r as T,t as E}from"./status-badge-aVr30Kdt.js";import{n as D,t as O}from"./mutation-BGXtT3S6.js";import{n as k,r as A}from"./dist-BTVu5ZQv.js";import{n as j,t as M}from"./sonner-BroOpTOb.js";import{n as N,u as P}from"./api-case-QJEM_wDb.js";function F(e){return B.includes(e)}async function I(e,{arg:t},n){return(await le.patchCase(n,t.caseId,{status_code:t.status})).data}function L({caseId:e,status:t,canEdit:n=!0,readOnlyTooltip:r,size:i,className:a,onSaved:o}){let{t:c}=g(),{tenant:f}=ue(),{trigger:p}=D(`patch-case-status-${e}`,(e,t)=>I(e,t,f)),[m,_]=(0,R.useState)(t),v=(0,R.useRef)(!1);(0,R.useEffect)(()=>{_(t)},[t,e]);let y=e=>c(`case_exploration.status.${e}`,e);function b(t){if(t===m)return;let n=m;_(t),p({caseId:e,status:t}).then(()=>o?.()).catch(()=>{_(n),A.error(c(`case_status.error`))})}if(!n||!F(m)){let e=(0,z.jsx)(E,{status:m,size:i,className:a});return r?(0,z.jsxs)(oe,{children:[(0,z.jsx)(ie,{children:e}),(0,z.jsx)(ae,{children:r})]}):e}return(0,z.jsxs)(d,{children:[(0,z.jsx)(ne,{asChild:!0,children:(0,z.jsxs)(`button`,{type:`button`,className:se(pe({variant:T[m]??`neutral`,clickable:!0,size:i}).base(),a),children:[y(m),(0,z.jsx)(h,{})]})}),(0,z.jsx)(re,{align:`start`,onPointerUp:()=>{v.current=!0},onCloseAutoFocus:e=>{v.current&&e.preventDefault(),v.current=!1},children:V.map(e=>e.submenu?(0,z.jsxs)(ee,{children:[(0,z.jsx)(l,{children:y(e.status)}),(0,z.jsx)(u,{children:(0,z.jsx)(te,{children:e.submenu.map(e=>(0,z.jsx)(s,{onSelect:()=>b(e),children:y(e)},e))})})]},e.status):(0,z.jsx)(s,{onSelect:()=>b(e.status),children:y(e.status)},e.status))})]})}var R,z,B,V;function H(){return(H=e((()=>{R=t(),m(),k(),O(),v(),w(),me(),c(),f(),_(),de(),p(),ce(),z=o(),B=Object.values(y),V=[{status:y.InProgress},{status:y.InReview},{status:y.Completed,submenu:[y.Completed,y.Resolved,y.Unresolved,y.Inconclusive]},{status:y.Revoked},{status:y.Reopened}],L.__docgenInfo={description:``,methods:[],displayName:`CaseStatusDropdown`,props:{caseId:{required:!0,tsType:{name:`number`},description:``},status:{required:!0,tsType:{name:`CaseStatus`},description:``},canEdit:{required:!1,tsType:{name:`boolean`},description:``,defaultValue:{value:`true`,computed:!1}},readOnlyTooltip:{required:!1,tsType:{name:`ReactNode`},description:``},size:{required:!1,tsType:{name:`BadgeProps['size']`,raw:`BadgeProps['size']`},description:``},className:{required:!1,tsType:{name:`string`},description:``},onSaved:{required:!1,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``}}}})))()}var U,W,G,K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{i(),r(),v(),H(),j(),P(),fe(),U=t(),W=o(),G=Object.values(y),K=[b.CaseStatusDraft,b.CaseStatusSubmitted,b.CaseStatusProcessing],q=a.patch(N,()=>new n(null,{status:200})),J={title:`Components/Dropdowns/Case Status Dropdown`,component:L,args:{caseId:1,status:`in_progress`},parameters:{msw:{handlers:[q]}}},Y={render:e=>(0,W.jsxs)(S,{children:[(0,W.jsx)(x,{title:`Interactive`,description:`User-applied statuses. Selecting one persists it and updates the badge in place.`,children:(0,W.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:G.map(t=>(0,U.createElement)(L,{...e,key:t,status:t}))})}),(0,W.jsxs)(x,{title:`Sizes`,children:[(0,W.jsx)(C,{children:`default`}),(0,W.jsx)(L,{...e}),(0,W.jsx)(C,{children:`lg`}),(0,W.jsx)(L,{...e,size:`lg`})]})]})},X={render:e=>(0,W.jsxs)(S,{children:[(0,W.jsx)(x,{title:`System-applied statuses`,description:`Draft, Pending and Processing are set by the backend — the badge never opens a menu.`,children:(0,W.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:K.map(t=>(0,U.createElement)(L,{...e,key:t,status:t}))})}),(0,W.jsx)(x,{title:`Without can_edit_case`,description:`A user-applied status stays visible, but the dropdown is gone. Hover for the tooltip.`,children:(0,W.jsx)(L,{...e,canEdit:!1,readOnlyTooltip:`Status`})})]})},Z={parameters:{msw:{handlers:[a.patch(N,()=>new n(null,{status:500}))]}},render:e=>(0,W.jsxs)(x,{title:`Failed save`,description:`The badge updates optimistically, then rolls back to the previous status with an error toast.`,children:[(0,W.jsx)(L,{...e}),(0,W.jsx)(M,{})]})},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: args => <StoryShowcase>
      <StorySection title="Interactive" description="User-applied statuses. Selecting one persists it and updates the badge in place.">
        <div className="flex flex-wrap gap-2">
          {USER_APPLIED.map(status => <CaseStatusDropdown {...args} key={status} status={status} />)}
        </div>
      </StorySection>

      <StorySection title="Sizes">
        <StoryLabel>default</StoryLabel>
        <CaseStatusDropdown {...args} />
        <StoryLabel>lg</StoryLabel>
        <CaseStatusDropdown {...args} size="lg" />
      </StorySection>
    </StoryShowcase>
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: args => <StoryShowcase>
      <StorySection title="System-applied statuses" description="Draft, Pending and Processing are set by the backend — the badge never opens a menu.">
        <div className="flex flex-wrap gap-2">
          {SYSTEM_APPLIED.map(status => <CaseStatusDropdown {...args} key={status} status={status} />)}
        </div>
      </StorySection>

      <StorySection title="Without can_edit_case" description="A user-applied status stays visible, but the dropdown is gone. Hover for the tooltip.">
        <CaseStatusDropdown {...args} canEdit={false} readOnlyTooltip="Status" />
      </StorySection>
    </StoryShowcase>
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.patch(caseEntityApi, () => new HttpResponse(null, {
        status: 500
      }))]
    }
  },
  render: args => <StorySection title="Failed save" description="The badge updates optimistically, then rolls back to the previous status with an error toast.">
      <CaseStatusDropdown {...args} />
      <Toaster />
    </StorySection>
}`,...Z.parameters?.docs?.source}}},Q=[`Default`,`ReadOnly`,`SaveError`]})))()}$();export{Y as Default,X as ReadOnly,Z as SaveError,Q as __namedExportsOrder,J as default};