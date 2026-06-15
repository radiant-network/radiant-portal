import{j as e,r as u}from"./iframe-B_cUq_Z_.js";import{U as n,R as U,a as g}from"./table-header-user-filter-zZZ5B5pw.js";import{a as t,b as p}from"./story-section-ClDCqoX4.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D0XB-Gvv.js";import"./index-Bd4j15Rn.js";import"./action-button-B_DYhR_Z.js";import"./dropdown-menu-DW18XKtK.js";import"./index--VPkyeI8.js";import"./index-Bs7sbtKD.js";import"./check-Co9nfzYN.js";import"./circle-D2PEC1dM.js";import"./separator-BpM3i5JH.js";import"./i18n-y5n1cA5u.js";import"./index-CRHX0MN7.js";import"./popover-CLYP1dW3.js";import"./avatar.styles-DI3MMIgm.js";import"./avatar.utils-C1EeCBXD.js";import"./avatar-D7zzSgHP.js";import"./user-DZRX7Os6.js";import"./x-BMqHCxKs.js";import"./checkbox-Cs3ZPAIY.js";import"./index-BAayUSpm.js";const G={title:"Features/Assignation/User Selection",component:n,args:{availableUsers:[],selectedUsers:[],onUsersChange:()=>{}},parameters:{layout:"padded"}},r=[{id:"user-1",name:"Jean-François Soucy",email:"jeanfrancois.soucy.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-2",name:"Julie M. Gauthier",email:"julie.m.gauthier.hsj@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-3",name:"Jacques Michaud",email:"jacques.michaud.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-4",name:"Fadi Hamdan",email:"fadi.hamdan@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-5",name:"Catalina Maftei",email:"catalina.maftei@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-6",name:"Sarah Wilson",email:"sarah.wilson@hospital.ca",organization:"Toronto General"},{id:"user-7",name:"David Brown",email:"david.brown@clinic.ca",organization:"Vancouver Clinic"}],h=()=>{const[s,a]=u.useState([]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(n,{availableUsers:r,selectedUsers:s,onUsersChange:a})})},i={render:()=>e.jsx(t,{title:"Default",children:e.jsx(h,{})})},S=()=>{const[s,a]=u.useState([r[0],r[1],r[2]]);return e.jsx("div",{className:"max-w-lg",children:e.jsx(n,{availableUsers:r,selectedUsers:s,onUsersChange:a})})},o={render:()=>e.jsx(t,{title:"With multiple preselected users",children:e.jsx(S,{})})},v=()=>{const[s,a]=u.useState([]);return e.jsx(t,{title:"User Selection Popover",children:e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsx(g,{availableUsers:r,selectedUsers:s,onUsersChange:a,triggerText:"Assignation"}),e.jsxs("div",{className:"space-y-2 rounded-lg bg-muted p-4",children:[e.jsx(p,{children:"Actual state:"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:s.length===0?"Aucun utilisateur sélectionné":`${s.length} utilisateur(s) sélectionné(s): ${s.map(x=>x.name).join(", ")}`})]})]})})},l={render:()=>e.jsx(v,{})},j=()=>{const[s,a]=u.useState([]);return e.jsx(t,{title:"User Selection Demo",children:e.jsxs("div",{className:"max-w-2xl space-y-6",children:[e.jsx(n,{availableUsers:r,selectedUsers:s,onUsersChange:a}),e.jsxs("div",{className:"space-y-2 rounded-lg bg-muted p-4",children:[e.jsx(p,{children:"État actuel:"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:s.length===0?"Aucun utilisateur sélectionné":`${s.length} utilisateur(s) sélectionné(s): ${s.map(x=>x.name).join(", ")}`})]})]})})},c={render:()=>e.jsx(j,{})},d={render:()=>e.jsx(t,{title:"Read-Only User Selection (Multiple Users)",children:e.jsxs("div",{className:"max-w-lg space-y-4",children:[e.jsx(U,{selectedUsers:[r[0],r[1],r[2]]}),e.jsxs("div",{className:"text-sm text-muted-foreground",children:[e.jsx("p",{children:e.jsx("strong",{children:"Selected Users:"})}),e.jsx("ul",{className:"ml-2 list-inside list-disc",children:[r[0],r[1],r[2]].map(s=>e.jsxs("li",{children:[s.name," (",s.organization,")"]},s.id))})]})]})})},m={render:()=>{const s=[r[0],r[1]];return e.jsx(t,{title:"Editable vs Read-Only Comparison",children:e.jsxs("div",{className:"max-w-2xl space-y-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(p,{children:"Read-Only Version"}),e.jsx(U,{selectedUsers:s}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"No interaction possible - display only"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(p,{children:"Editable Version"}),e.jsx(n,{availableUsers:r,selectedUsers:s,onUsersChange:()=>{}}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Interactive - allows searching and removing users"})]})]})})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default">
      <DefaultComponent />
    </StorySection>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With multiple preselected users">
      <WithMultiplePreselectedUsersComponent />
    </StorySection>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <PopoverVersionComponent />
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <InteractiveComponent />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Read-Only User Selection (Multiple Users)">
      <div className="max-w-lg space-y-4">
        <ReadOnlyUserSelection selectedUsers={[sampleUsers[0], sampleUsers[1], sampleUsers[2]]} />
        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Selected Users:</strong>
          </p>
          <ul className="ml-2 list-inside list-disc">
            {[sampleUsers[0], sampleUsers[1], sampleUsers[2]].map(user => <li key={user.id}>
                {user.name} ({user.organization})
              </li>)}
          </ul>
        </div>
      </div>
    </StorySection>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const selectedUsers = [sampleUsers[0], sampleUsers[1]];
    return <StorySection title="Editable vs Read-Only Comparison">
        <div className="max-w-2xl space-y-4">
          <div className="space-y-1">
            <StoryLabel>Read-Only Version</StoryLabel>
            <ReadOnlyUserSelection selectedUsers={selectedUsers} />
            <p className="text-sm text-muted-foreground">No interaction possible - display only</p>
          </div>

          <div className="space-y-1">
            <StoryLabel>Editable Version</StoryLabel>
            <UserSelection availableUsers={sampleUsers} selectedUsers={selectedUsers} onUsersChange={() => {}} // No-op for demo
          />
            <p className="text-sm text-muted-foreground">Interactive - allows searching and removing users</p>
          </div>
        </div>
      </StorySection>;
  }
}`,...m.parameters?.docs?.source}}};const T=["Default","WithMultiplePreselectedUsers","PopoverVersion","Interactive","ReadOnlyMultipleUsers","ReadOnlyComparison"];export{i as Default,c as Interactive,l as PopoverVersion,m as ReadOnlyComparison,d as ReadOnlyMultipleUsers,o as WithMultiplePreselectedUsers,T as __namedExportsOrder,G as default};
