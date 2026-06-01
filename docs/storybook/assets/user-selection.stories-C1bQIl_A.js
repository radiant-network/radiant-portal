import{j as e,r as i}from"./iframe-CgYzld9M.js";import{U as n,R as t,a as y}from"./table-header-user-filter-DNHO88yu.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BB6JTV7B.js";import"./index-0Ui6iiVS.js";import"./action-button-Dd50ZnSl.js";import"./dropdown-menu-CCEHsgQp.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./check-DrnC7o8K.js";import"./circle-BJPs1Iry.js";import"./separator-BXAAQkGD.js";import"./i18n-BhtfqN2W.js";import"./index-BJLMTLPT.js";import"./popover-CgcTZUAv.js";import"./avatar.utils-BVJE-8hd.js";import"./avatar-BZBile2U.js";import"./user-itrKI4oa.js";import"./x-B30BiZwY.js";import"./checkbox-BvKqV_TL.js";import"./index-BU8vtByU.js";const _={title:"Assignation/UserSelection",component:n,args:{availableUsers:[],selectedUsers:[],onUsersChange:()=>{}},parameters:{layout:"padded"}},a=[{id:"user-1",name:"Jean-François Soucy",email:"jeanfrancois.soucy.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-2",name:"Julie M. Gauthier",email:"julie.m.gauthier.hsj@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-3",name:"Jacques Michaud",email:"jacques.michaud.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-4",name:"Fadi Hamdan",email:"fadi.hamdan@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-5",name:"Catalina Maftei",email:"catalina.maftei@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-6",name:"Sarah Wilson",email:"sarah.wilson@hospital.ca",organization:"Toronto General"},{id:"user-7",name:"David Brown",email:"david.brown@clinic.ca",organization:"Vancouver Clinic"}],j=()=>{const[s,r]=i.useState([]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(n,{availableUsers:a,selectedUsers:s,onUsersChange:r})})},l={render:()=>e.jsx(j,{})},N=()=>{const[s,r]=i.useState([a[0]]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(n,{availableUsers:a,selectedUsers:s,onUsersChange:r})})},o={render:()=>e.jsx(N,{})},S=()=>{const[s,r]=i.useState([a[0],a[1],a[2]]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(n,{availableUsers:a,selectedUsers:s,onUsersChange:r})})},c={render:()=>e.jsx(S,{})},b=()=>{const[s,r]=i.useState([]);return e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"User Selection Popover"}),e.jsx(y,{availableUsers:a,selectedUsers:s,onUsersChange:r,triggerText:"Assignation"})]}),e.jsxs("div",{className:"p-4 bg-gray-50 rounded-lg",children:[e.jsx("h4",{className:"font-medium mb-2",children:"État actuel:"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.length===0?"Aucun utilisateur sélectionné":`${s.length} utilisateur(s) sélectionné(s): ${s.map(v=>v.name).join(", ")}`})]})]})},d={render:()=>e.jsx(b,{})},f=()=>{const[s,r]=i.useState([]);return e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"User Selection Demo"}),e.jsx(n,{availableUsers:a,selectedUsers:s,onUsersChange:r})]}),e.jsxs("div",{className:"p-4 bg-gray-50 rounded-lg",children:[e.jsx("h4",{className:"font-medium mb-2",children:"État actuel:"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.length===0?"Aucun utilisateur sélectionné":`${s.length} utilisateur(s) sélectionné(s): ${s.map(v=>v.name).join(", ")}`})]})]})},m={render:()=>e.jsx(f,{})},p={render:()=>e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Empty)"}),e.jsx(t,{selectedUsers:[]}),e.jsx("p",{className:"text-sm text-gray-600",children:"Note: Component returns null when no users are selected"})]})},g={render:()=>e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Single User)"}),e.jsx(t,{selectedUsers:[a[0]]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Selected:"})," ",a[0].name]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Organization:"})," ",a[0].organization]})]})]})},x={render:()=>e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Multiple Users)"}),e.jsx(t,{selectedUsers:[a[0],a[1],a[2]]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("p",{children:e.jsx("strong",{children:"Selected Users:"})}),e.jsx("ul",{className:"list-disc list-inside ml-2",children:[a[0],a[1],a[2]].map(s=>e.jsxs("li",{children:[s.name," (",s.organization,")"]},s.id))})]})]})},u={render:()=>{const s={id:"not-assign",name:"Not assigned",organization:""};return e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Not Assigned)"}),e.jsx(t,{selectedUsers:[s]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Status:"})," No assignment"]}),e.jsx("p",{children:"Shows the unassigned state with the user icon"})]})]})}},h={render:()=>{const s={id:"not-assign",name:"Not assigned",organization:""};return e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Read-Only User Selection (Mixed)"}),e.jsx(t,{selectedUsers:[a[0],s,a[2]]}),e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Note:"})," Shows mix of assigned users and unassigned state"]}),e.jsx("p",{children:"Demonstrates the different avatar styles in read-only mode"})]})]})}},U={render:()=>{const s=[a[0],a[1]];return e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Editable vs Read-Only Comparison"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"Read-Only Version:"}),e.jsx(t,{selectedUsers:s}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"No interaction possible - display only"})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"Editable Version:"}),e.jsx(n,{availableUsers:a,selectedUsers:s,onUsersChange:()=>{}}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Interactive - allows searching and removing users"})]})]})]})}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <DefaultComponent />
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <WithPreselectedUsersComponent />
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <WithMultiplePreselectedUsersComponent />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <PopoverVersionComponent />
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <InteractiveComponent />
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="max-w-lg space-y-4">
      <h3 className="text-lg font-semibold">Read-Only User Selection (Empty)</h3>
      <ReadOnlyUserSelection selectedUsers={[]} />
      <p className="text-sm text-gray-600">Note: Component returns null when no users are selected</p>
    </div>
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
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
}`,...U.parameters?.docs?.source}}};const k=["Default","WithPreselectedUsers","WithMultiplePreselectedUsers","PopoverVersion","Interactive","ReadOnlyEmpty","ReadOnlySingleUser","ReadOnlyMultipleUsers","ReadOnlyWithNotAssigned","ReadOnlyMixedUsers","ReadOnlyComparison"];export{l as Default,m as Interactive,d as PopoverVersion,U as ReadOnlyComparison,p as ReadOnlyEmpty,h as ReadOnlyMixedUsers,x as ReadOnlyMultipleUsers,g as ReadOnlySingleUser,u as ReadOnlyWithNotAssigned,c as WithMultiplePreselectedUsers,o as WithPreselectedUsers,k as __namedExportsOrder,_ as default};
