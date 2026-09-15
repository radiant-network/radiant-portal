import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,r as i,t as a}from"./story-section-DVTm6cGm.js";import{n as o,t as s}from"./avatar-CcMs_Rpe.js";import{n as c,r as l}from"./utils-C2FSVfac.js";var u,d,f,p,m,h,g,_,v;function y(){return(y=e((()=>{o(),n(),l(),u=t(),d={title:`Components/Avatars/Assignment Avatar`,component:s,argTypes:{size:{control:{type:`select`},options:c},maxAvatars:{control:{type:`number`,min:1}}}},f=[{id:`user-1`,name:`Jean-François Soucy`,email:`jeanfrancois.soucy.med@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-2`,name:`Julie M. Gauthier`,email:`julie.m.gauthier.hsj@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-3`,name:`Jacques Michaud`,email:`jacques.michaud.med@ssss.gouv.qc.ca`,organization:`LDM-CHUSJ`},{id:`user-4`,name:`Sarah Wilson`,email:`sarah.wilson@hospital.ca`,organization:`Toronto General`},{id:`user-5`,name:`David Brown`,email:`david.brown@clinic.ca`,organization:`Vancouver Clinic`},{id:`user-6`,name:`Lisa Garcia`,email:`lisa.garcia@medical.ca`,organization:`Calgary Medical`}],p={render:()=>{let e=[{label:`Assignment Button`,users:[],canAssign:!0},{label:`User Avatar`,users:[f[0]]},{label:`Users without count`,users:[f[0],f[1]]},{label:`Users with count`,users:f.slice(0,4)}];return(0,u.jsx)(i,{children:e.map(e=>(0,u.jsx)(r,{title:e.label,children:(0,u.jsx)(`div`,{className:`flex items-end gap-6`,children:c.map(t=>(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(s,{users:e.users,size:t,canAssign:e.canAssign}),(0,u.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:t})]},t))})},e.label))})}},m={render:()=>{let e=[2,3,4],t=[1,2,3,5];return(0,u.jsx)(i,{children:e.map(e=>(0,u.jsx)(r,{title:`maxAvatars = ${e}`,children:(0,u.jsx)(`div`,{className:`flex items-center gap-6`,children:t.map(t=>(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(s,{users:f.slice(0,t),maxAvatars:e}),(0,u.jsxs)(`span`,{className:`text-xs text-muted-foreground`,children:[t,` users`]})]},t))})},e))})}},h={render:()=>(0,u.jsx)(r,{title:`Initials`,children:(0,u.jsx)(`div`,{className:`flex items-start gap-6`,children:[{user:{id:`i1`,name:`Lisa Garcia`},note:`First + last → LG`},{user:{id:`i2`,name:`Jean-François Soucy`},note:`Hyphenated first → JS`},{user:{id:`i3`,name:`Anne Marie Tremblay`},note:`Only first two words → AM`},{user:{id:`i4`,name:`Madonna`},note:`Single word → MA`},{user:{id:`i5`,name:`Alex Bernard`,initials:`XYZ`},note:`Custom initials → XY`}].map(({user:e,note:t})=>(0,u.jsxs)(`div`,{className:`flex w-32 flex-col items-center gap-2 text-center`,children:[(0,u.jsx)(s,{users:[e]}),(0,u.jsx)(`span`,{className:`text-xs font-medium`,children:e.name}),(0,u.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:t})]},e.id))})})},g={render:()=>(0,u.jsx)(r,{title:`Assignment Interactions`,description:`Hover over the avatars to see tooltips and user details popover.`,children:(0,u.jsxs)(`div`,{className:`grid grid-cols-2 gap-6`,children:[(0,u.jsxs)(`div`,{className:`space-y-2`,children:[(0,u.jsx)(a,{children:`Unassigned States`}),(0,u.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(s,{users:[],canAssign:!0,onAssignClick:()=>alert(`Assign clicked!`)}),(0,u.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:`Can Assign`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(s,{users:[],canAssign:!1}),(0,u.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:`Cannot Assign`})]})]})]}),(0,u.jsxs)(`div`,{className:`space-y-2`,children:[(0,u.jsx)(a,{children:`Assigned States (Hover for Details)`}),(0,u.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(s,{users:[f[0]],size:`md`}),(0,u.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:`Single User`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(s,{users:[f[0],f[1]],size:`md`}),(0,u.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:`Two Users`})]}),(0,u.jsxs)(`div`,{className:`flex flex-col items-center gap-2`,children:[(0,u.jsx)(s,{users:f.slice(0,4),size:`md`}),(0,u.jsx)(`span`,{className:`text-xs text-muted-foreground`,children:`Multiple Users`})]})]})]})]})})},_={render:()=>(0,u.jsx)(r,{title:`Table Cell Usage Example`,description:`Hover over avatars to see assignment tooltips and user details.`,children:(0,u.jsx)(`div`,{className:`w-full rounded-lg border`,children:(0,u.jsxs)(`table`,{className:`w-full`,children:[(0,u.jsx)(`thead`,{children:(0,u.jsxs)(`tr`,{className:`border-b bg-muted/50`,children:[(0,u.jsx)(`th`,{className:`text-left p-3`,children:`Case ID`}),(0,u.jsx)(`th`,{className:`text-left p-3`,children:`Assigned Users`}),(0,u.jsx)(`th`,{className:`text-left p-3`,children:`Status`})]})}),(0,u.jsxs)(`tbody`,{children:[(0,u.jsxs)(`tr`,{className:`border-b`,children:[(0,u.jsx)(`td`,{className:`p-3 font-mono text-sm`,children:`666106`}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(s,{users:[],canAssign:!0,onAssignClick:()=>alert(`Assign to case 666106`)})}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(`span`,{className:`text-muted-foreground`,children:`Can Assign`})})]}),(0,u.jsxs)(`tr`,{className:`border-b`,children:[(0,u.jsx)(`td`,{className:`p-3 font-mono text-sm`,children:`658344`}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(s,{users:[],canAssign:!1})}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(`span`,{className:`text-muted-foreground`,children:`No Assignment`})})]}),(0,u.jsxs)(`tr`,{className:`border-b`,children:[(0,u.jsx)(`td`,{className:`p-3 font-mono text-sm`,children:`658142`}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(s,{users:[f[0]]})}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(`span`,{className:`text-green-600`,children:`Assigned`})})]}),(0,u.jsxs)(`tr`,{className:`border-b`,children:[(0,u.jsx)(`td`,{className:`p-3 font-mono text-sm`,children:`658286`}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(s,{users:[f[1],f[2]]})}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(`span`,{className:`text-blue-600`,children:`Collaborative`})})]}),(0,u.jsxs)(`tr`,{children:[(0,u.jsx)(`td`,{className:`p-3 font-mono text-sm`,children:`658290`}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(s,{users:f.slice(0,4)})}),(0,u.jsx)(`td`,{className:`p-3`,children:(0,u.jsx)(`span`,{className:`text-purple-600`,children:`Team Assignment`})})]})]})]})})})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const states: {
      label: string;
      users: AvatarUser[];
      canAssign?: boolean;
    }[] = [{
      label: 'Assignment Button',
      users: [],
      canAssign: true
    }, {
      label: 'User Avatar',
      users: [sampleUsers[0]]
    }, {
      label: 'Users without count',
      users: [sampleUsers[0], sampleUsers[1]]
    }, {
      label: 'Users with count',
      users: sampleUsers.slice(0, 4)
    }];
    return <StoryShowcase>
        {states.map(state => <StorySection key={state.label} title={state.label}>
            <div className="flex items-end gap-6">
              {avatarSizes.map(size => <div key={size} className="flex flex-col items-center gap-2">
                  <Avatar users={state.users} size={size} canAssign={state.canAssign} />
                  <span className="text-xs text-muted-foreground">{size}</span>
                </div>)}
            </div>
          </StorySection>)}
      </StoryShowcase>;
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const thresholds = [2, 3, 4];
    const counts = [1, 2, 3, 5];
    return <StoryShowcase>
        {thresholds.map(max => <StorySection key={max} title={\`maxAvatars = \${max}\`}>
            <div className="flex items-center gap-6">
              {counts.map(count => <div key={count} className="flex flex-col items-center gap-2">
                  <Avatar users={sampleUsers.slice(0, count)} maxAvatars={max} />
                  <span className="text-xs text-muted-foreground">{count} users</span>
                </div>)}
            </div>
          </StorySection>)}
      </StoryShowcase>;
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const examples: {
      user: AvatarUser;
      note: string;
    }[] = [{
      user: {
        id: 'i1',
        name: 'Lisa Garcia'
      },
      note: 'First + last → LG'
    }, {
      user: {
        id: 'i2',
        name: 'Jean-François Soucy'
      },
      note: 'Hyphenated first → JS'
    }, {
      user: {
        id: 'i3',
        name: 'Anne Marie Tremblay'
      },
      note: 'Only first two words → AM'
    }, {
      user: {
        id: 'i4',
        name: 'Madonna'
      },
      note: 'Single word → MA'
    }, {
      user: {
        id: 'i5',
        name: 'Alex Bernard',
        initials: 'XYZ'
      },
      note: 'Custom initials → XY'
    }];
    return <StorySection title="Initials">
        <div className="flex items-start gap-6">
          {examples.map(({
          user,
          note
        }) => <div key={user.id} className="flex w-32 flex-col items-center gap-2 text-center">
              <Avatar users={[user]} />
              <span className="text-xs font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{note}</span>
            </div>)}
        </div>
      </StorySection>;
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Assignment Interactions" description="Hover over the avatars to see tooltips and user details popover.">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <StoryLabel>Unassigned States</StoryLabel>
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

        <div className="space-y-2">
          <StoryLabel>Assigned States (Hover for Details)</StoryLabel>
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
    </StorySection>
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Table Cell Usage Example" description="Hover over avatars to see assignment tooltips and user details.">
      <div className="w-full rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3">Case ID</th>
              <th className="text-left p-3">Assigned Users</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-mono text-sm">666106</td>
              <td className="p-3">
                <Avatar users={[]} canAssign={true} onAssignClick={() => alert('Assign to case 666106')} />
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
    </StorySection>
}`,..._.parameters?.docs?.source}}},v=[`Sizes`,`MaxAvatars`,`Initials`,`AssignmentStates`,`TableUsageExample`]})))()}y();export{g as AssignmentStates,h as Initials,m as MaxAvatars,p as Sizes,_ as TableUsageExample,v as __namedExportsOrder,d as default};