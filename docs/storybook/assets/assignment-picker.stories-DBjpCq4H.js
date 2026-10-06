import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i,r as a,t as o}from"./story-section-DVTm6cGm.js";import{n as s,t as c}from"./assignment-picker-BgKnVTgn.js";function l({label:e,initialAssignees:t=[],candidates:n=p,canEdit:r,currentUserId:i=f,isLoading:a,buttonVariant:s}){let[l,m]=(0,u.useState)(t);return(0,d.jsxs)(`div`,{className:`flex flex-col items-start gap-2`,children:[(0,d.jsx)(o,{children:e}),(0,d.jsx)(c,{candidates:n,assignees:l,canEdit:r,currentUserId:i,isLoading:a,buttonVariant:s,align:`start`,onApply:m})]})}var u,d,f,p,m,h,g;function _(){return(_=e((()=>{u=t(),s(),r(),d=n(),f=`user-1`,p=[{id:f,name:`Vincent Ferretti`,email:`vincent.ferretti.hsj@ssss.gouv.qc.ca`},{id:`user-2`,name:`Sophie Dubois`,email:`sdubois.hsj@ssss.gouv.qc.ca`},{id:`user-3`,name:`Clément Jourdain`,email:`cjourdain.hsj@ssss.gouv.qc.ca`},{id:`user-4`,name:`Amélie Lefebvre`,email:`alefebvre.hsj@ssss.gouv.qc.ca`},{id:`user-5`,name:`Alexandre Martel`,email:`amartel.hsj@ssss.gouv.qc.ca`},{id:`user-6`,name:`Benoît Moreau`,email:`bmoreau.hsj@ssss.gouv.qc.ca`},{id:`user-7`,name:`Jean-François Soucy`,email:`jfsoucy.hsj@ssss.gouv.qc.ca`}],m={title:`Features/Assignation/Assignment Picker`,component:c,args:{candidates:p,assignees:[],onApply:()=>{}},parameters:{layout:`padded`}},h={render:()=>(0,d.jsxs)(a,{children:[(0,d.jsx)(i,{title:`Editable`,description:`Click to open the picker. Apply appears once the selection changes; closing without applying discards it.`,children:(0,d.jsxs)(`div`,{className:`flex gap-12`,children:[(0,d.jsx)(l,{label:`Unassigned`}),(0,d.jsx)(l,{label:`Unassigned (secondary)`,buttonVariant:`secondary`}),(0,d.jsx)(l,{label:`One assignee`,initialAssignees:[p[1]]}),(0,d.jsx)(l,{label:`Several assignees`,initialAssignees:[p[1],p[3],p[4]]})]})}),(0,d.jsx)(i,{title:`Read-only`,description:`Without can_edit_case: details on hover, no picker.`,children:(0,d.jsxs)(`div`,{className:`flex gap-12`,children:[(0,d.jsx)(l,{label:`Unassigned`,canEdit:!1}),(0,d.jsx)(l,{label:`Unassigned (secondary)`,canEdit:!1,buttonVariant:`secondary`}),(0,d.jsx)(l,{label:`Assigned`,canEdit:!1,initialAssignees:[p[1],p[3]]})]})}),(0,d.jsx)(i,{title:`Picker states`,children:(0,d.jsxs)(`div`,{className:`flex gap-12`,children:[(0,d.jsx)(l,{label:`Caller not eligible (no “you”)`,currentUserId:`user-unknown`}),(0,d.jsx)(l,{label:`Loading`,isLoading:!0}),(0,d.jsx)(l,{label:`No candidates`,candidates:[]})]})})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Editable" description="Click to open the picker. Apply appears once the selection changes; closing without applying discards it.">
        <div className="flex gap-12">
          <Demo label="Unassigned" />
          <Demo label="Unassigned (secondary)" buttonVariant="secondary" />
          <Demo label="One assignee" initialAssignees={[candidates[1]]} />
          <Demo label="Several assignees" initialAssignees={[candidates[1], candidates[3], candidates[4]]} />
        </div>
      </StorySection>
      <StorySection title="Read-only" description="Without can_edit_case: details on hover, no picker.">
        <div className="flex gap-12">
          <Demo label="Unassigned" canEdit={false} />
          <Demo label="Unassigned (secondary)" canEdit={false} buttonVariant="secondary" />
          <Demo label="Assigned" canEdit={false} initialAssignees={[candidates[1], candidates[3]]} />
        </div>
      </StorySection>
      <StorySection title="Picker states">
        <div className="flex gap-12">
          <Demo label="Caller not eligible (no “you”)" currentUserId="user-unknown" />
          <Demo label="Loading" isLoading />
          <Demo label="No candidates" candidates={[]} />
        </div>
      </StorySection>
    </StoryShowcase>
}`,...h.parameters?.docs?.source}}},g=[`Default`]})))()}_();export{h as Default,g as __namedExportsOrder,m as default};