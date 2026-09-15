import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i,t as a}from"./story-section-DVTm6cGm.js";import{i as o,o as s,s as c,t as l}from"./user-selection-BeDMqWPm.js";var u,d,f,p,m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{u=t(),l(),r(),d=n(),f={title:`Features/Assignation/User Selection`,component:c,args:{availableUsers:[],selectedUsers:[],onUsersChange:()=>{}},parameters:{layout:`padded`}},p=[{id:`user-1`,name:`Jean-François Soucy`,email:`jeanfrancois.soucy.med@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-2`,name:`Julie M. Gauthier`,email:`julie.m.gauthier.hsj@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-3`,name:`Jacques Michaud`,email:`jacques.michaud.med@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-4`,name:`Fadi Hamdan`,email:`fadi.hamdan@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-5`,name:`Catalina Maftei`,email:`catalina.maftei@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-6`,name:`Sarah Wilson`,email:`sarah.wilson@hospital.ca`,organization:`Toronto General`},{id:`user-7`,name:`David Brown`,email:`david.brown@clinic.ca`,organization:`Vancouver Clinic`}],m=()=>{let[e,t]=(0,u.useState)([]);return(0,d.jsx)(`div`,{className:`max-w-lg`,children:(0,d.jsx)(c,{availableUsers:p,selectedUsers:e,onUsersChange:t})})},h={render:()=>(0,d.jsx)(i,{title:`Default`,children:(0,d.jsx)(m,{})})},g=()=>{let[e,t]=(0,u.useState)([p[0],p[1],p[2]]);return(0,d.jsx)(`div`,{className:`max-w-lg`,children:(0,d.jsx)(c,{availableUsers:p,selectedUsers:e,onUsersChange:t})})},_={render:()=>(0,d.jsx)(i,{title:`With multiple preselected users`,children:(0,d.jsx)(g,{})})},v=()=>{let[e,t]=(0,u.useState)([]);return(0,d.jsx)(i,{title:`User Selection Popover`,children:(0,d.jsxs)(`div`,{className:`max-w-2xl space-y-6`,children:[(0,d.jsx)(o,{availableUsers:p,selectedUsers:e,onUsersChange:t,triggerText:`Assignation`}),(0,d.jsxs)(`div`,{className:`space-y-2 rounded-lg bg-muted p-4`,children:[(0,d.jsx)(a,{children:`Actual state:`}),(0,d.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:e.length===0?`Aucun utilisateur sélectionné`:`${e.length} utilisateur(s) sélectionné(s): ${e.map(e=>e.name).join(`, `)}`})]})]})})},y={render:()=>(0,d.jsx)(v,{})},b=()=>{let[e,t]=(0,u.useState)([]);return(0,d.jsx)(i,{title:`User Selection Demo`,children:(0,d.jsxs)(`div`,{className:`max-w-2xl space-y-6`,children:[(0,d.jsx)(c,{availableUsers:p,selectedUsers:e,onUsersChange:t}),(0,d.jsxs)(`div`,{className:`space-y-2 rounded-lg bg-muted p-4`,children:[(0,d.jsx)(a,{children:`État actuel:`}),(0,d.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:e.length===0?`Aucun utilisateur sélectionné`:`${e.length} utilisateur(s) sélectionné(s): ${e.map(e=>e.name).join(`, `)}`})]})]})})},x={render:()=>(0,d.jsx)(b,{})},S={render:()=>(0,d.jsx)(i,{title:`Read-Only User Selection (Multiple Users)`,children:(0,d.jsxs)(`div`,{className:`max-w-lg space-y-4`,children:[(0,d.jsx)(s,{selectedUsers:[p[0],p[1],p[2]]}),(0,d.jsxs)(`div`,{className:`text-sm text-muted-foreground`,children:[(0,d.jsx)(`p`,{children:(0,d.jsx)(`strong`,{children:`Selected Users:`})}),(0,d.jsx)(`ul`,{className:`ml-2 list-inside list-disc`,children:[p[0],p[1],p[2]].map(e=>(0,d.jsxs)(`li`,{children:[e.name,` (`,e.organization,`)`]},e.id))})]})]})})},C={render:()=>{let e=[p[0],p[1]];return(0,d.jsx)(i,{title:`Editable vs Read-Only Comparison`,children:(0,d.jsxs)(`div`,{className:`max-w-2xl space-y-4`,children:[(0,d.jsxs)(`div`,{className:`space-y-1`,children:[(0,d.jsx)(a,{children:`Read-Only Version`}),(0,d.jsx)(s,{selectedUsers:e}),(0,d.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`No interaction possible - display only`})]}),(0,d.jsxs)(`div`,{className:`space-y-1`,children:[(0,d.jsx)(a,{children:`Editable Version`}),(0,d.jsx)(c,{availableUsers:p,selectedUsers:e,onUsersChange:()=>{}}),(0,d.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Interactive - allows searching and removing users`})]})]})})}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Default">
      <DefaultComponent />
    </StorySection>
}`,...h.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With multiple preselected users">
      <WithMultiplePreselectedUsersComponent />
    </StorySection>
}`,..._.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <PopoverVersionComponent />
}`,...y.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <InteractiveComponent />
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source}}},w=[`Default`,`WithMultiplePreselectedUsers`,`PopoverVersion`,`Interactive`,`ReadOnlyMultipleUsers`,`ReadOnlyComparison`]})))()}T();export{h as Default,x as Interactive,y as PopoverVersion,C as ReadOnlyComparison,S as ReadOnlyMultipleUsers,_ as WithMultiplePreselectedUsers,w as __namedExportsOrder,f as default};