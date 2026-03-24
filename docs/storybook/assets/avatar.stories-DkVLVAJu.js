import{j as e,c as m,T as pe,b as ue,d as xe,e as ge}from"./iframe-BOYB6VZu.js";import{A as f,a as v}from"./avatar-CUFgjjwL.js";import{A as I}from"./constants-DFO-ev5B.js";import{g as q,a as _,b as N,c as ie,d as fe}from"./avatar.utils-CgE348ba.js";import{A as ce,S as ve}from"./single-avatar-CJNJwU1M.js";import{u as Ne}from"./i18n-CQWl26Pa.js";import{U as he}from"./user-CAK63VE5.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CIMqbMyN.js";import"./index-Cxi2Nyp5.js";import"./hover-card-CZcTbLeJ.js";import"./button-l4JDDupZ.js";import"./action-button-4NKFE7w1.js";import"./dropdown-menu-JfwOliNj.js";import"./index-IJOQfWhe.js";import"./circle-d3EpmDag.js";import"./check-Duw61Hy0.js";import"./separator-BUqn_ALp.js";function oe({firstUser:c,additionalCount:r,allUsers:l,size:t="md",className:n}){const i=q(c),d=_(c.id),o=N({size:t,variant:"count",position:"first"}),x=N({size:t,variant:"count",position:"second"}),g=ie(t),p=r>I.MAX_COUNT_DISPLAY?`${I.MAX_COUNT_DISPLAY}+`:`+${r}`,u=e.jsxs("div",{className:m("flex items-center",n),title:`${c.name} and ${r} other${r>1?"s":""}`,children:[e.jsx(f,{className:o.container(),children:e.jsx(v,{className:m(o.fallback(),o.text(),d),children:i})}),e.jsx(f,{className:m(x.container(),g,"bg-background"),children:e.jsx(v,{className:m(x.fallback(),"bg-cyan-800/20 text-cyan-foreground"),children:p})})]});return l&&l.some(w=>w.email||w.organization)?e.jsx(ce,{users:l,size:t,children:u}):u}oe.__docgenInfo={description:"",methods:[],displayName:"CountAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},firstUser:{required:!0,tsType:{name:"AvatarUser"},description:""},additionalCount:{required:!0,tsType:{name:"number"},description:""},allUsers:{required:!1,tsType:{name:"Array",elements:[{name:"AvatarUser"}],raw:"AvatarUser[]"},description:""}}};function de({users:c,size:r="md",className:l}){const[t,n]=c,i=q(t),d=q(n),o=_(t.id),x=_(n.id),g=N({size:r,variant:"dual",position:"first"}),p=N({size:r,variant:"dual",position:"second"}),u=ie(r),C=e.jsxs("div",{className:m("flex items-center",l),title:`${t.name}, ${n.name}`,children:[e.jsx(f,{className:g.container(),children:e.jsx(v,{className:m(g.fallback(),g.text(),o),children:i})}),e.jsx(f,{className:m(p.container(),u),children:e.jsx(v,{className:m(p.fallback(),p.text(),x),children:d})})]});return c.some(k=>k.email||k.organization)?e.jsx(ce,{users:c,size:r,children:C}):C}de.__docgenInfo={description:"",methods:[],displayName:"DualAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},users:{required:!0,tsType:{name:"tuple",raw:"[AvatarUser, AvatarUser]",elements:[{name:"AvatarUser"},{name:"AvatarUser"}]},description:""}}};function me({size:c="md",className:r,canAssign:l,onAssignClick:t}){const{t:n}=Ne(),i=N({variant:"unassigned"}),d=fe(c),o=n(l?"common.unassigned_avatar.can_assign":"common.unassigned_avatar.cannot_assign"),x=l===!0?"cursor-pointer":"cursor-default",p=l&&t?t:void 0,u=e.jsx(f,{className:m("relative flex shrink-0 overflow-hidden rounded-full","border-2 border-dashed border-muted-foreground/40 bg-muted/20","h-6 w-6",x,r),onClick:p,children:e.jsx(v,{className:m(i.fallback(),i.text()),children:e.jsx(he,{className:d})})});return l!==void 0?e.jsx(pe,{children:e.jsxs(ue,{children:[e.jsx(xe,{asChild:!0,children:u}),e.jsx(ge,{children:e.jsx("p",{children:o})})]})}):u}me.__docgenInfo={description:"",methods:[],displayName:"UnassignedAvatar",props:{size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};function s({users:c=[],size:r="md",className:l,canAssign:t,onAssignClick:n}){const i=c.filter(o=>o&&o.id&&o.name),d=i.length;return d===0?e.jsx(me,{size:r,className:l,canAssign:t,onAssignClick:n}):d===1?e.jsx(ve,{user:i[0],size:r,className:l,canAssign:t,onAssignClick:n}):d===2?e.jsx(de,{users:[i[0],i[1]],size:r,className:l,canAssign:t,onAssignClick:n}):e.jsx(oe,{firstUser:i[0],additionalCount:d-1,allUsers:i,size:r,className:l,canAssign:t,onAssignClick:n})}s.__docgenInfo={description:`Avatar component that displays user assignment status

Renders different states based on the number of assigned users:
- No users: UnassignedAvatar (gray dashed circle with user icon)
- 1 user: SingleAvatar (colored circle with initials)
- 2 users: DualAvatar (two overlapping colored circles with initials)
- 3+ users: CountAvatar (first user avatar + count circle)`,methods:[],displayName:"Avatar",props:{users:{required:!1,tsType:{name:"Array",elements:[{name:"AvatarUser"}],raw:"AvatarUser[]"},description:"",defaultValue:{value:"[]",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""},canAssign:{required:!1,tsType:{name:"boolean"},description:""},onAssignClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const He={title:"Assignation/Avatar",component:s,parameters:{layout:"centered"},argTypes:{size:{control:{type:"select"},options:["sm","md","lg"]}}},a=[{id:"user-1",name:"Jean-François Soucy",email:"jeanfrancois.soucy.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-2",name:"Julie M. Gauthier",email:"julie.m.gauthier.hsj@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-3",name:"Jacques Michaud",email:"jacques.michaud.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-4",name:"Sarah Wilson",email:"sarah.wilson@hospital.ca",organization:"Toronto General"},{id:"user-5",name:"David Brown",email:"david.brown@clinic.ca",organization:"Vancouver Clinic"},{id:"user-6",name:"Lisa Garcia",email:"lisa.garcia@medical.ca",organization:"Calgary Medical"}],h={render:()=>e.jsx("div",{className:"flex flex-col gap-8 p-4",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Avatar States"}),e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:[]}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Unassigned"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:[a[0]]}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Single User"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:[a[0],a[1]]}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Two Users"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:a.slice(0,3)}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Three Users"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:a}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"Six Users"})]})]})]})})},j={render:()=>e.jsxs("div",{className:"flex flex-col gap-8 p-4",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Small Size"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{users:[],size:"sm"}),e.jsx(s,{users:[a[0]],size:"sm"}),e.jsx(s,{users:[a[0],a[1]],size:"sm"}),e.jsx(s,{users:a.slice(0,4),size:"sm"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Medium Size (Default)"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{users:[],size:"md"}),e.jsx(s,{users:[a[0]],size:"md"}),e.jsx(s,{users:[a[0],a[1]],size:"md"}),e.jsx(s,{users:a.slice(0,4),size:"md"})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Large Size"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{users:[],size:"lg"}),e.jsx(s,{users:[a[0]],size:"lg"}),e.jsx(s,{users:[a[0],a[1]],size:"lg"}),e.jsx(s,{users:a.slice(0,4),size:"lg"})]})]})]})},A={args:{users:[]}},U={args:{users:[a[0]]}},b={args:{users:[a[0],a[1]]}},S={args:{users:a.slice(0,5)}},y={args:{users:[{id:"user-single-1",name:"Madonna"},{id:"user-single-2",name:"Cher"}]}},T={render:()=>e.jsx("div",{className:"flex flex-col gap-8 p-4",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Assignment Interactions"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Hover over the avatars to see tooltips and user details popover."}),e.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h4",{className:"font-medium",children:"Unassigned States"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign clicked!")}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Can Assign"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:[],canAssign:!1}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Cannot Assign"})]})]})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("h4",{className:"font-medium",children:"Assigned States (Hover for Details)"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:[a[0]],size:"md"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Single User"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:[a[0],a[1]],size:"md"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Two Users"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{users:a.slice(0,4),size:"md"}),e.jsx("span",{className:"text-xs text-muted-foreground",children:"Multiple Users"})]})]})]})]})]})})},z={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Table Cell Usage Example"}),e.jsx("p",{className:"text-sm text-muted-foreground mb-4",children:"Hover over avatars to see assignment tooltips and user details."}),e.jsx("div",{className:"border rounded-lg",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b bg-muted/50",children:[e.jsx("th",{className:"text-left p-3",children:"Prescription ID"}),e.jsx("th",{className:"text-left p-3",children:"Assigned Users"}),e.jsx("th",{className:"text-left p-3",children:"Status"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"666106"}),e.jsx("td",{className:"p-3",children:e.jsx(s,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign to prescription 666106")})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-muted-foreground",children:"Can Assign"})})]}),e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658344"}),e.jsx("td",{className:"p-3",children:e.jsx(s,{users:[],canAssign:!1})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-muted-foreground",children:"No Assignment"})})]}),e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658142"}),e.jsx("td",{className:"p-3",children:e.jsx(s,{users:[a[0]]})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-green-600",children:"Assigned"})})]}),e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658286"}),e.jsx("td",{className:"p-3",children:e.jsx(s,{users:[a[1],a[2]]})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-blue-600",children:"Collaborative"})})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-mono text-sm",children:"658290"}),e.jsx("td",{className:"p-3",children:e.jsx(s,{users:a.slice(0,4)})}),e.jsx("td",{className:"p-3",children:e.jsx("span",{className:"text-purple-600",children:"Team Assignment"})})]})]})]})})]})};var M,D,P;h.parameters={...h.parameters,docs:{...(M=h.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(P=(D=h.parameters)==null?void 0:D.docs)==null?void 0:P.source}}};var E,H,L;j.parameters={...j.parameters,docs:{...(E=j.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(L=(H=j.parameters)==null?void 0:H.docs)==null?void 0:L.source}}};var $,J,O;A.parameters={...A.parameters,docs:{...($=A.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    users: []
  }
}`,...(O=(J=A.parameters)==null?void 0:J.docs)==null?void 0:O.source}}};var V,G,F;U.parameters={...U.parameters,docs:{...(V=U.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    users: [sampleUsers[0]]
  }
}`,...(F=(G=U.parameters)==null?void 0:G.docs)==null?void 0:F.source}}};var R,X,Y;b.parameters={...b.parameters,docs:{...(R=b.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    users: [sampleUsers[0], sampleUsers[1]]
  }
}`,...(Y=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var B,W,K;S.parameters={...S.parameters,docs:{...(B=S.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    users: sampleUsers.slice(0, 5)
  }
}`,...(K=(W=S.parameters)==null?void 0:W.docs)==null?void 0:K.source}}};var Q,Z,ee;y.parameters={...y.parameters,docs:{...(Q=y.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    users: [{
      id: 'user-single-1',
      name: 'Madonna'
    }, {
      id: 'user-single-2',
      name: 'Cher'
    }]
  }
}`,...(ee=(Z=y.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var se,ae,re;T.parameters={...T.parameters,docs:{...(se=T.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(re=(ae=T.parameters)==null?void 0:ae.docs)==null?void 0:re.source}}};var te,le,ne;z.parameters={...z.parameters,docs:{...(te=z.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(ne=(le=z.parameters)==null?void 0:le.docs)==null?void 0:ne.source}}};const Le=["AllStates","Sizes","Unassigned","SingleUser","TwoUsers","MultipleUsers","SingleNameUsers","AssignmentStates","TableUsageExample"];export{h as AllStates,T as AssignmentStates,S as MultipleUsers,y as SingleNameUsers,U as SingleUser,j as Sizes,z as TableUsageExample,b as TwoUsers,A as Unassigned,Le as __namedExportsOrder,He as default};
