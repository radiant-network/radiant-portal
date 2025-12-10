import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as f,a as v}from"./avatar-ByeU0qQu.js";import{c as d}from"./utils-CDN07tui.js";import{g as N,b as j,a as h,A as M,e as oe,d as xe}from"./avatar.utils-MvOOLP0y.js";import{H as ge,a as fe,b as ve}from"./hover-card-DRGP3Iqd.js";import{C as he}from"./button-DlQhM6NA.js";import{c as Ne,T as je,a as Ae,b as Ue}from"./tooltip-B_PdrVRJ.js";import{u as be}from"./i18n-BYhOn5Ro.js";import{U as ye}from"./user-3oWHM7_v.js";import"./index-CBYaBgW8.js";import"./index-BdYz8WOz.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-C-d7IIsQ.js";import"./index-lnksFm0-.js";import"./index-C66Dxnp2.js";import"./index-D6ay35fe.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./action-button-B61IoBol.js";import"./dropdown-menu-CvT4td-4.js";import"./index-BCzuw4Jg.js";import"./Combination-DPhcPU0m.js";import"./index-DnEzm5An.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./separator-ChZWIdMg.js";import"./button.variants-Du9eY_ux.js";import"./spinner-D7tBPZCQ.js";import"./index-CfXWnpL9.js";import"./iframe-CTdhkTz1.js";import"./i18next-CYn7LYXT.js";function ce({user:s,size:n="sm",className:i}){const l=N(s),o=j(s.id),t=h({size:n,variant:"single"});return e.jsxs("div",{className:d("flex space-x-3 items-start",i),children:[e.jsx(f,{className:d(t.container(),"flex-shrink-0"),children:e.jsx(v,{className:d(t.fallback(),t.text(),o),children:l})}),e.jsxs("div",{className:"space-y-1 flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("h4",{className:"text-sm font-semibold truncate",children:s.name}),s.organization&&e.jsx("p",{className:"text-xs text-muted-foreground truncate",children:s.organization})]}),s.email&&e.jsxs("div",{className:"group flex items-center space-x-1 hover:bg-accent/50 rounded px-1 py-0.5 -mx-1 transition-colors cursor-pointer",children:[e.jsx("a",{href:`mailto:${s.email}`,className:"text-xs text-muted-foreground truncate group-hover:text-primary hover:underline",onClick:c=>c.stopPropagation(),children:s.email}),e.jsx("div",{className:"opacity-0 group-hover:opacity-100 transition-opacity",children:e.jsx(he,{value:s.email,size:"sm",variant:"ghost",iconSize:12,className:"h-5 w-5 p-0 hover:bg-accent"})})]})]})]})}ce.__docgenInfo={description:"",methods:[],displayName:"AvatarUserItem",props:{user:{required:!0,tsType:{name:"AvatarUser"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'sm'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function q({users:s,children:n}){const l=(Array.isArray(s)?s:[s]).sort((t,c)=>{const m=u=>{const p=u.trim().split(/\s+/);return p.length>1?p[p.length-1]:p[0]},x=m(t.name).toLowerCase(),g=m(c.name).toLowerCase();return x.localeCompare(g)}),o=l.length===1;return e.jsxs(ge,{children:[e.jsx(fe,{asChild:!0,children:n}),e.jsx(ve,{className:"w-80 max-h-96 overflow-y-auto",side:"top",children:e.jsx("div",{className:o?"":"space-y-3",children:l.map(t=>e.jsx(ce,{user:t,size:"md"},t.id))})})]})}q.__docgenInfo={description:"",methods:[],displayName:"AvatarPopover",props:{users:{required:!0,tsType:{name:"union",raw:"AvatarUser | AvatarUser[]",elements:[{name:"AvatarUser"},{name:"Array",elements:[{name:"AvatarUser"}],raw:"AvatarUser[]"}]},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:""},className:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};function me({firstUser:s,additionalCount:n,allUsers:i,size:l="md",className:o}){const t=N(s),c=j(s.id),m=h({size:l,variant:"count",position:"first"}),x=h({size:l,variant:"count",position:"second"}),g=oe(l),u=n>M.MAX_COUNT_DISPLAY?`${M.MAX_COUNT_DISPLAY}+`:`+${n}`,p=e.jsxs("div",{className:d("flex items-center",o),title:`${s.name} and ${n} other${n>1?"s":""}`,children:[e.jsx(f,{className:m.container(),children:e.jsx(v,{className:d(m.fallback(),m.text(),c),children:t})}),e.jsx(f,{className:d(x.container(),g,"bg-background"),children:e.jsx(v,{className:d(x.fallback(),"bg-cyan-800/20 text-cyan-foreground"),children:u})})]});return i&&i.some(k=>k.email||k.organization)?e.jsx(q,{users:i,size:l,children:p}):p}me.__docgenInfo={description:"",methods:[],displayName:"CountAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},firstUser:{required:!0,tsType:{name:"AvatarUser"},description:""},additionalCount:{required:!0,tsType:{name:"number"},description:""},allUsers:{required:!1,tsType:{name:"Array",elements:[{name:"AvatarUser"}],raw:"AvatarUser[]"},description:""}}};function de({users:s,size:n="md",className:i}){const[l,o]=s,t=N(l),c=N(o),m=j(l.id),x=j(o.id),g=h({size:n,variant:"dual",position:"first"}),u=h({size:n,variant:"dual",position:"second"}),p=oe(n),_=e.jsxs("div",{className:d("flex items-center",i),title:`${l.name}, ${o.name}`,children:[e.jsx(f,{className:g.container(),children:e.jsx(v,{className:d(g.fallback(),g.text(),m),children:t})}),e.jsx(f,{className:d(u.container(),p),children:e.jsx(v,{className:d(u.fallback(),u.text(),x),children:c})})]});return s.some(I=>I.email||I.organization)?e.jsx(q,{users:s,size:n,children:_}):_}de.__docgenInfo={description:"",methods:[],displayName:"DualAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},users:{required:!0,tsType:{name:"tuple",raw:"[AvatarUser, AvatarUser]",elements:[{name:"AvatarUser"},{name:"AvatarUser"}]},description:""}}};function pe({user:s,size:n="md",className:i}){const l=N(s),o=j(s.id),t=h({size:n,variant:"single"}),c=e.jsx(f,{className:d(t.container(),i),title:s.name,children:e.jsx(v,{className:d(t.fallback(),t.text(),o),children:l})});return s.email||s.organization?e.jsx(q,{users:s,size:n,children:c}):c}pe.__docgenInfo={description:"",methods:[],displayName:"SingleAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},user:{required:!0,tsType:{name:"AvatarUser"},description:""}}};function ue({size:s="md",className:n,canAssign:i,onAssignClick:l}){const{t:o}=be(),t=h({variant:"unassigned"}),c=xe(s),m=o(i?"common.unassigned_avatar.can_assign":"common.unassigned_avatar.cannot_assign"),x=i===!0?"cursor-pointer":"cursor-default",u=i&&l?l:void 0,p=e.jsx(f,{className:d("relative flex shrink-0 overflow-hidden rounded-full","border-2 border-dashed border-muted-foreground/40 bg-muted/20","h-6 w-6",x,n),onClick:u,children:e.jsx(v,{className:d(t.fallback(),t.text()),children:e.jsx(ye,{className:c})})});return i!==void 0?e.jsx(Ne,{children:e.jsxs(je,{children:[e.jsx(Ae,{asChild:!0,children:p}),e.jsx(Ue,{children:e.jsx("p",{children:m})})]})}):p}ue.__docgenInfo={description:"",methods:[],displayName:"UnassignedAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};function a({users:s=[],size:n="md",className:i,canAssign:l,onAssignClick:o}){const t=s.filter(m=>m&&m.id&&m.name),c=t.length;return c===0?e.jsx(ue,{size:n,className:i,canAssign:l,onAssignClick:o}):c===1?e.jsx(pe,{user:t[0],size:n,className:i,canAssign:l,onAssignClick:o}):c===2?e.jsx(de,{users:[t[0],t[1]],size:n,className:i,canAssign:l,onAssignClick:o}):e.jsx(me,{firstUser:t[0],additionalCount:c-1,allUsers:t,size:n,className:i,canAssign:l,onAssignClick:o})}a.__docgenInfo={description:`Avatar component that displays user assignment status

Renders different states based on the number of assigned users:
- No users: UnassignedAvatar (gray dashed circle with user icon)
- 1 user: SingleAvatar (colored circle with initials)
- 2 users: DualAvatar (two overlapping colored circles with initials)
- 3+ users: CountAvatar (first user avatar + count circle)`,methods:[],displayName:"Avatar",props:{users:{required:!1,tsType:{name:"Array",elements:[{name:"AvatarUser"}],raw:"AvatarUser[]"},description:"",defaultValue:{value:"[]",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const ns={title:"Assignation/Avatar",component:a,parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]}}},r=[{id:"user-1",name:"Jean-François Soucy",email:"jeanfrancois.soucy.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-2",name:"Julie M. Gauthier",email:"julie.m.gauthier.hsj@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-3",name:"Jacques Michaud",email:"jacques.michaud.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-4",name:"Sarah Wilson",email:"sarah.wilson@hospital.ca",organization:"Toronto General"},{id:"user-5",name:"David Brown",email:"david.brown@clinic.ca",organization:"Vancouver Clinic"},{id:"user-6",name:"Lisa Garcia",email:"lisa.garcia@medical.ca",organization:"Calgary Medical"}],A={render:()=>e.jsx("div",{className:"flex flex-col gap-8 p-4",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Avatar States"}),e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:[]}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Unassigned"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:[r[0]]}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Single User"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:[r[0],r[1]]}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Two Users"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:r.slice(0,3)}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Three Users"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:r}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Six Users"})]})]})]})})},U={render:()=>e.jsxs("div",{className:"flex flex-col gap-8 p-4",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Small Size"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{users:[],size:"sm"}),e.jsx(a,{users:[r[0]],size:"sm"}),e.jsx(a,{users:[r[0],r[1]],size:"sm"}),e.jsx(a,{users:r.slice(0,4),size:"sm"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Medium Size (Default)"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{users:[],size:"md"}),e.jsx(a,{users:[r[0]],size:"md"}),e.jsx(a,{users:[r[0],r[1]],size:"md"}),e.jsx(a,{users:r.slice(0,4),size:"md"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Large Size"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{users:[],size:"lg"}),e.jsx(a,{users:[r[0]],size:"lg"}),e.jsx(a,{users:[r[0],r[1]],size:"lg"}),e.jsx(a,{users:r.slice(0,4),size:"lg"})]})]})]})},b={args:{users:[]}},y={args:{users:[r[0]]}},S={args:{users:[r[0],r[1]]}},T={args:{users:r.slice(0,5)}},C={args:{users:[{id:"user-single-1",name:"Madonna"},{id:"user-single-2",name:"Cher"}]}},z={render:()=>e.jsx("div",{className:"flex flex-col gap-8 p-4",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Assignment Interactions"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Hover over the avatars to see tooltips and user details popover."}),e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h4",{className:"font-medium",children:"Unassigned States"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign clicked!")}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Can Assign"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:[],canAssign:!1}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Cannot Assign"})]})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h4",{className:"font-medium",children:"Assigned States (Hover for Details)"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:[r[0]],size:"md"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Single User"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:[r[0],r[1]],size:"md"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Two Users"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(a,{users:r.slice(0,4),size:"md"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Multiple Users"})]})]})]})]})]})})},w={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Table Cell Usage Example"}),e.jsx("p",{className:"text-sm text-muted-foreground mb-4",children:"Hover over avatars to see assignment tooltips and user details."}),e.jsx("div",{className:"border rounded-lg",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b bg-muted/50",children:[e.jsx("th",{className:"text-left p-3",children:"Prescription ID"}),e.jsx("th",{className:"text-left p-3",children:"Assigned Users"}),e.jsx("th",{className:"text-left p-3",children:"Status"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"666106"}),e.jsx("td",{className:"p-3",children:e.jsx(a,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign to prescription 666106")})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-muted-foreground",children:"Can Assign"})})]}),e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658344"}),e.jsx("td",{className:"p-3",children:e.jsx(a,{users:[],canAssign:!1})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-muted-foreground",children:"No Assignment"})})]}),e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658142"}),e.jsx("td",{className:"p-3",children:e.jsx(a,{users:[r[0]]})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-green-600",children:"Assigned"})})]}),e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658286"}),e.jsx("td",{className:"p-3",children:e.jsx(a,{users:[r[1],r[2]]})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-blue-600",children:"Collaborative"})})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658290"}),e.jsx("td",{className:"p-3",children:e.jsx(a,{users:r.slice(0,4)})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-purple-600",children:"Team Assignment"})})]})]})]})})]})};var D,P,H;A.parameters={...A.parameters,docs:{...(D=A.parameters)==null?void 0:D.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Avatar States</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar users={[]} />
            <span className="text-sm text-muted-foreground">Unassigned</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={[sampleUsers[0]]} />
            <span className="text-sm text-muted-foreground">Single User</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={[sampleUsers[0], sampleUsers[1]]} />
            <span className="text-sm text-muted-foreground">Two Users</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={sampleUsers.slice(0, 3)} />
            <span className="text-sm text-muted-foreground">Three Users</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar users={sampleUsers} />
            <span className="text-sm text-muted-foreground">Six Users</span>
          </div>
        </div>
      </div>
    </div>
}`,...(H=(P=A.parameters)==null?void 0:P.docs)==null?void 0:H.source}}};var L,E,$;U.parameters={...U.parameters,docs:{...(L=U.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Small Size</h3>
        <div className="flex items-center gap-4">
          <Avatar users={[]} size="sm" />
          <Avatar users={[sampleUsers[0]]} size="sm" />
          <Avatar users={[sampleUsers[0], sampleUsers[1]]} size="sm" />
          <Avatar users={sampleUsers.slice(0, 4)} size="sm" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Medium Size (Default)</h3>
        <div className="flex items-center gap-4">
          <Avatar users={[]} size="md" />
          <Avatar users={[sampleUsers[0]]} size="md" />
          <Avatar users={[sampleUsers[0], sampleUsers[1]]} size="md" />
          <Avatar users={sampleUsers.slice(0, 4)} size="md" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Large Size</h3>
        <div className="flex items-center gap-4">
          <Avatar users={[]} size="lg" />
          <Avatar users={[sampleUsers[0]]} size="lg" />
          <Avatar users={[sampleUsers[0], sampleUsers[1]]} size="lg" />
          <Avatar users={sampleUsers.slice(0, 4)} size="lg" />
        </div>
      </div>
    </div>
}`,...($=(E=U.parameters)==null?void 0:E.docs)==null?void 0:$.source}}};var V,J,O;b.parameters={...b.parameters,docs:{...(V=b.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    users: []
  }
}`,...(O=(J=b.parameters)==null?void 0:J.docs)==null?void 0:O.source}}};var R,G,B;y.parameters={...y.parameters,docs:{...(R=y.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    users: [sampleUsers[0]]
  }
}`,...(B=(G=y.parameters)==null?void 0:G.docs)==null?void 0:B.source}}};var F,X,Y;S.parameters={...S.parameters,docs:{...(F=S.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    users: [sampleUsers[0], sampleUsers[1]]
  }
}`,...(Y=(X=S.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var W,K,Q;T.parameters={...T.parameters,docs:{...(W=T.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    users: sampleUsers.slice(0, 5)
  }
}`,...(Q=(K=T.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var Z,ee,se;C.parameters={...C.parameters,docs:{...(Z=C.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    users: [{
      id: 'user-single-1',
      name: 'Madonna'
    }, {
      id: 'user-single-2',
      name: 'Cher'
    }]
  }
}`,...(se=(ee=C.parameters)==null?void 0:ee.docs)==null?void 0:se.source}}};var ae,re,te;z.parameters={...z.parameters,docs:{...(ae=z.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Assignment Interactions</h3>
        <p className="text-sm text-muted-foreground">
          Hover over the avatars to see tooltips and user details popover.
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="font-medium">Unassigned States</h4>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar users={[]} canAssign={true} onAssignClick={() => alert('Assign clicked!')} />
                <span className="text-xs text-muted-foreground">Can Assign</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar users={[]} canAssign={false} />
                <span className="text-xs text-muted-foreground">Cannot Assign</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-medium">Assigned States (Hover for Details)</h4>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar users={[sampleUsers[0]]} size="md" />
                <span className="text-xs text-muted-foreground">Single User</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar users={[sampleUsers[0], sampleUsers[1]]} size="md" />
                <span className="text-xs text-muted-foreground">Two Users</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar users={sampleUsers.slice(0, 4)} size="md" />
                <span className="text-xs text-muted-foreground">Multiple Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...(te=(re=z.parameters)==null?void 0:re.docs)==null?void 0:te.source}}};var ne,le,ie;w.parameters={...w.parameters,docs:{...(ne=w.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Table Cell Usage Example</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Hover over avatars to see assignment tooltips and user details.
      </p>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Prescription ID</th>
              <th className="text-left p-3">Assigned Users</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">666106</td>
              <td className="p-3">
                <Avatar users={[]} canAssign={true} onAssignClick={() => alert('Assign to prescription 666106')} />
              </td>
              <td className="p-3">
                <span className="text-muted-foreground">Can Assign</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">658344</td>
              <td className="p-3">
                <Avatar users={[]} canAssign={false} />
              </td>
              <td className="p-3">
                <span className="text-muted-foreground">No Assignment</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">658142</td>
              <td className="p-3">
                <Avatar users={[sampleUsers[0]]} />
              </td>
              <td className="p-3">
                <span className="text-green-600">Assigned</span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">658286</td>
              <td className="p-3">
                <Avatar users={[sampleUsers[1], sampleUsers[2]]} />
              </td>
              <td className="p-3">
                <span className="text-blue-600">Collaborative</span>
              </td>
            </tr>
            <tr>
              <td className="p-3 font-mono text-sm">658290</td>
              <td className="p-3">
                <Avatar users={sampleUsers.slice(0, 4)} />
              </td>
              <td className="p-3">
                <span className="text-purple-600">Team Assignment</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
}`,...(ie=(le=w.parameters)==null?void 0:le.docs)==null?void 0:ie.source}}};const ls=["AllStates","Sizes","Unassigned","SingleUser","TwoUsers","MultipleUsers","SingleNameUsers","AssignmentStates","TableUsageExample"];export{A as AllStates,z as AssignmentStates,T as MultipleUsers,C as SingleNameUsers,y as SingleUser,U as Sizes,w as TableUsageExample,S as TwoUsers,b as Unassigned,ls as __namedExportsOrder,ns as default};
