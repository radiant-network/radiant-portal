import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as i}from"./index-CBYaBgW8.js";import{U as t,R as n,a as Y}from"./table-header-user-filter-Db52smGe.js";import"./button-CbWEvCr6.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-D7tBPZCQ.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./i18n-Bl3cUO8L.js";import"./iframe-DN0EbxbO.js";import"./i18next-CYn7LYXT.js";import"./popover-CV3rAFUt.js";import"./avatar-TpOIt2GS.js";import"./index-lnksFm0-.js";import"./avatar.utils-MvOOLP0y.js";import"./user-3oWHM7_v.js";import"./x-4HkHZ1eq.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";const Ge={title:"Assignation/UserSelection",component:t,parameters:{layout:"padded"}},r=[{id:"user-1",name:"Jean-François Soucy",email:"jeanfrancois.soucy.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-2",name:"Julie M. Gauthier",email:"julie.m.gauthier.hsj@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-3",name:"Jacques Michaud",email:"jacques.michaud.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-4",name:"Fadi Hamdan",email:"fadi.hamdan@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-5",name:"Catalina Maftei",email:"catalina.maftei@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-6",name:"Sarah Wilson",email:"sarah.wilson@hospital.ca",organization:"Toronto General"},{id:"user-7",name:"David Brown",email:"david.brown@clinic.ca",organization:"Vancouver Clinic"}],Z=()=>{const[s,a]=i.useState([]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(t,{availableUsers:r,selectedUsers:s,onUsersChange:a})})},o={render:()=>e.jsx(Z,{})},ee=()=>{const[s,a]=i.useState([r[0]]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(t,{availableUsers:r,selectedUsers:s,onUsersChange:a})})},l={render:()=>e.jsx(ee,{})},se=()=>{const[s,a]=i.useState([r[0],r[1],r[2]]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(t,{availableUsers:r,selectedUsers:s,onUsersChange:a})})},c={render:()=>e.jsx(se,{})},re=()=>{const[s,a]=i.useState([]);return e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"User Selection Popover"}),e.jsx(Y,{availableUsers:r,selectedUsers:s,onUsersChange:a,triggerText:"Assignation"})]}),e.jsxs("div",{className:"p-4 bg-gray-50 rounded-lg",children:[e.jsx("h4",{className:"font-medium mb-2",children:"État actuel:"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.length===0?"Aucun utilisateur sélectionné":`${s.length} utilisateur(s) sélectionné(s): ${s.map(v=>v.name).join(", ")}`})]})]})},d={render:()=>e.jsx(re,{})},ae=()=>{const[s,a]=i.useState([]);return e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"User Selection Demo"}),e.jsx(t,{availableUsers:r,selectedUsers:s,onUsersChange:a})]}),e.jsxs("div",{className:"p-4 bg-gray-50 rounded-lg",children:[e.jsx("h4",{className:"font-medium mb-2",children:"État actuel:"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.length===0?"Aucun utilisateur sélectionné":`${s.length} utilisateur(s) sélectionné(s): ${s.map(v=>v.name).join(", ")}`})]})]})},m={render:()=>e.jsx(ae,{})},p={render:()=>e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Empty)"}),e.jsx(n,{selectedUsers:[]}),e.jsx("p",{className:"text-sm text-gray-600",children:"Note: Component returns null when no users are selected"})]})},x={render:()=>e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Single User)"}),e.jsx(n,{selectedUsers:[r[0]]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Selected:"})," ",r[0].name]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Organization:"})," ",r[0].organization]})]})]})},g={render:()=>e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Multiple Users)"}),e.jsx(n,{selectedUsers:[r[0],r[1],r[2]]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("p",{children:e.jsx("strong",{children:"Selected Users:"})}),e.jsx("ul",{className:"list-disc list-inside ml-2",children:[r[0],r[1],r[2]].map(s=>e.jsxs("li",{children:[s.name," (",s.organization,")"]},s.id))})]})]})},u={render:()=>{const s={id:"not-assign",name:"Not assigned",organization:""};return e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Not Assigned)"}),e.jsx(n,{selectedUsers:[s]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Status:"})," No assignment"]}),e.jsx("p",{children:"Shows the unassigned state with the user icon"})]})]})}},h={render:()=>{const s={id:"not-assign",name:"Not assigned",organization:""};return e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Mixed)"}),e.jsx(n,{selectedUsers:[r[0],s,r[2]]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Note:"})," Shows mix of assigned users and unassigned state"]}),e.jsx("p",{children:"Demonstrates the different avatar styles in read-only mode"})]})]})}},U={render:()=>{const s=[r[0],r[1]];return e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Editable vs Read-Only Comparison"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"Read-Only Version:"}),e.jsx(n,{selectedUsers:s}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"No interaction possible - display only"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"Editable Version:"}),e.jsx(t,{availableUsers:r,selectedUsers:s,onUsersChange:()=>{}}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Interactive - allows searching and removing users"})]})]})]})}};var y,j,N;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <DefaultComponent />
}`,...(N=(j=o.parameters)==null?void 0:j.docs)==null?void 0:N.source}}};var S,f,b;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <WithPreselectedUsersComponent />
}`,...(b=(f=l.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var O,R,w;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <WithMultiplePreselectedUsersComponent />
}`,...(w=(R=c.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};var C,M,z;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => <PopoverVersionComponent />
}`,...(z=(M=d.parameters)==null?void 0:M.docs)==null?void 0:z.source}}};var A,P,D;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <InteractiveComponent />
}`,...(D=(P=m.parameters)==null?void 0:P.docs)==null?void 0:D.source}}};var E,W,V;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-semibold">Read-Only User Selection (Empty)</h3>
      <ReadOnlyUserSelection selectedUsers={[]} />
      <p className="text-sm text-gray-600">Note: Component returns null when no users are selected</p>
    </div>
}`,...(V=(W=p.parameters)==null?void 0:W.docs)==null?void 0:V.source}}};var J,q,H;x.parameters={...x.parameters,docs:{...(J=x.parameters)==null?void 0:J.docs,source:{originalSource:`{
  render: () => <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-semibold">Read-Only User Selection (Single User)</h3>
      <ReadOnlyUserSelection selectedUsers={[sampleUsers[0]]} />
      <div className="text-sm text-gray-600">
        <p>
          <strong>Selected:</strong> {sampleUsers[0].name}
        </p>
        <p>
          <strong>Organization:</strong> {sampleUsers[0].organization}
        </p>
      </div>
    </div>
}`,...(H=(q=x.parameters)==null?void 0:q.docs)==null?void 0:H.source}}};var I,L,$;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-semibold">Read-Only User Selection (Multiple Users)</h3>
      <ReadOnlyUserSelection selectedUsers={[sampleUsers[0], sampleUsers[1], sampleUsers[2]]} />
      <div className="text-sm text-gray-600">
        <p>
          <strong>Selected Users:</strong>
        </p>
        <ul className="list-disc list-inside ml-2">
          {[sampleUsers[0], sampleUsers[1], sampleUsers[2]].map(user => <li key={user.id}>
              {user.name} ({user.organization})
            </li>)}
        </ul>
      </div>
    </div>
}`,...($=(L=g.parameters)==null?void 0:L.docs)==null?void 0:$.source}}};var F,G,T;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => {
    const notAssignUser: AvatarUser = {
      id: 'not-assign',
      name: 'Not assigned',
      organization: ''
    };
    return <div className="max-w-lg space-y-4">
        <h3 className="text-lg font-semibold">Read-Only User Selection (Not Assigned)</h3>
        <ReadOnlyUserSelection selectedUsers={[notAssignUser]} />
        <div className="text-sm text-gray-600">
          <p>
            <strong>Status:</strong> No assignment
          </p>
          <p>Shows the unassigned state with the user icon</p>
        </div>
      </div>;
  }
}`,...(T=(G=u.parameters)==null?void 0:G.docs)==null?void 0:T.source}}};var _,k,B;h.parameters={...h.parameters,docs:{...(_=h.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => {
    const notAssignUser: AvatarUser = {
      id: 'not-assign',
      name: 'Not assigned',
      organization: ''
    };
    return <div className="max-w-lg space-y-4">
        <h3 className="text-lg font-semibold">Read-Only User Selection (Mixed)</h3>
        <ReadOnlyUserSelection selectedUsers={[sampleUsers[0], notAssignUser, sampleUsers[2]]} />
        <div className="text-sm text-gray-600">
          <p>
            <strong>Note:</strong> Shows mix of assigned users and unassigned state
          </p>
          <p>Demonstrates the different avatar styles in read-only mode</p>
        </div>
      </div>;
  }
}`,...(B=(k=h.parameters)==null?void 0:k.docs)==null?void 0:B.source}}};var K,Q,X;U.parameters={...U.parameters,docs:{...(K=U.parameters)==null?void 0:K.docs,source:{originalSource:`{
  render: () => {
    const selectedUsers = [sampleUsers[0], sampleUsers[1]];
    return <div className="max-w-2xl space-y-6">
        <h3 className="text-lg font-semibold">Editable vs Read-Only Comparison</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Read-Only Version:</h4>
            <ReadOnlyUserSelection selectedUsers={selectedUsers} />
            <p className="text-sm text-gray-500 mt-1">No interaction possible - display only</p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Editable Version:</h4>
            <UserSelection availableUsers={sampleUsers} selectedUsers={selectedUsers} onUsersChange={() => {}} // No-op for demo
          />
            <p className="text-sm text-gray-500 mt-1">Interactive - allows searching and removing users</p>
          </div>
        </div>
      </div>;
  }
}`,...(X=(Q=U.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const Te=["Default","WithPreselectedUsers","WithMultiplePreselectedUsers","PopoverVersion","Interactive","ReadOnlyEmpty","ReadOnlySingleUser","ReadOnlyMultipleUsers","ReadOnlyWithNotAssigned","ReadOnlyMixedUsers","ReadOnlyComparison"];export{o as Default,m as Interactive,d as PopoverVersion,U as ReadOnlyComparison,p as ReadOnlyEmpty,h as ReadOnlyMixedUsers,g as ReadOnlyMultipleUsers,x as ReadOnlySingleUser,u as ReadOnlyWithNotAssigned,c as WithMultiplePreselectedUsers,l as WithPreselectedUsers,Te as __namedExportsOrder,Ge as default};
