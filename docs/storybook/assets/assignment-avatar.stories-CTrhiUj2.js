import{j as s}from"./iframe-CUHTCraV.js";import{A as e}from"./avatar-C8WjxV5m.js";import{a as i,b as p,S as u}from"./story-section-B5jupzCR.js";import{a as g}from"./utils-BQbZHAUO.js";import"./preload-helper-PPVm8Dsz.js";import"./avatar-CbyYYNEz.js";import"./avatar.utils-C1EeCBXD.js";import"./i18n-CvIos0gf.js";import"./index-DpmgubW-.js";import"./avatar.styles-Ncxq5ba1.js";import"./user-Cr8LujXJ.js";import"./user-avatar-CFRpqpF7.js";import"./hover-card-BO_kSw34.js";import"./button-CZjHTKQy.js";import"./action-button-CdHWYpUk.js";import"./dropdown-menu-IpbMOAkX.js";import"./index-Cvvrdsfd.js";import"./index-Dd0IXZ1B.js";import"./check-DnkkXyPO.js";import"./circle-CpDNkknX.js";import"./separator-Cfebd5mI.js";import"./anchor-link-wiRIufci.js";const E={title:"Components/Avatars/Assignment Avatar",component:e,argTypes:{size:{control:{type:"select"},options:g},maxAvatars:{control:{type:"number",min:1}}}},a=[{id:"user-1",name:"Jean-François Soucy",email:"jeanfrancois.soucy.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-2",name:"Julie M. Gauthier",email:"julie.m.gauthier.hsj@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-3",name:"Jacques Michaud",email:"jacques.michaud.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-4",name:"Sarah Wilson",email:"sarah.wilson@hospital.ca",organization:"Toronto General"},{id:"user-5",name:"David Brown",email:"david.brown@clinic.ca",organization:"Vancouver Clinic"},{id:"user-6",name:"Lisa Garcia",email:"lisa.garcia@medical.ca",organization:"Calgary Medical"}],l={render:()=>{const n=[{label:"Assignment Button",users:[],canAssign:!0},{label:"User Avatar",users:[a[0]]},{label:"Users without count",users:[a[0],a[1]]},{label:"Users with count",users:a.slice(0,4)}];return s.jsx(u,{children:n.map(t=>s.jsx(i,{title:t.label,children:s.jsx("div",{className:"flex items-end gap-6",children:g.map(r=>s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:t.users,size:r,canAssign:t.canAssign}),s.jsx("span",{className:"text-xs text-muted-foreground",children:r})]},r))})},t.label))})}},c={render:()=>{const n=[2,3,4],t=[1,2,3,5];return s.jsx(u,{children:n.map(r=>s.jsx(i,{title:`maxAvatars = ${r}`,children:s.jsx("div",{className:"flex items-center gap-6",children:t.map(x=>s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:a.slice(0,x),maxAvatars:r}),s.jsxs("span",{className:"text-xs text-muted-foreground",children:[x," users"]})]},x))})},r))})}},o={render:()=>{const n=[{user:{id:"i1",name:"Lisa Garcia"},note:"First + last → LG"},{user:{id:"i2",name:"Jean-François Soucy"},note:"Hyphenated first → JS"},{user:{id:"i3",name:"Anne Marie Tremblay"},note:"Only first two words → AM"},{user:{id:"i4",name:"Madonna"},note:"Single word → MA"},{user:{id:"i5",name:"Alex Bernard",initials:"XYZ"},note:"Custom initials → XY"}];return s.jsx(i,{title:"Initials",children:s.jsx("div",{className:"flex items-start gap-6",children:n.map(({user:t,note:r})=>s.jsxs("div",{className:"flex w-32 flex-col items-center gap-2 text-center",children:[s.jsx(e,{users:[t]}),s.jsx("span",{className:"text-xs font-medium",children:t.name}),s.jsx("span",{className:"text-xs text-muted-foreground",children:r})]},t.id))})})}},d={render:()=>s.jsx(i,{title:"Assignment Interactions",description:"Hover over the avatars to see tooltips and user details popover.",children:s.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[s.jsxs("div",{className:"space-y-2",children:[s.jsx(p,{children:"Unassigned States"}),s.jsxs("div",{className:"flex items-center gap-4",children:[s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign clicked!")}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Can Assign"})]}),s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[],canAssign:!1}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Cannot Assign"})]})]})]}),s.jsxs("div",{className:"space-y-2",children:[s.jsx(p,{children:"Assigned States (Hover for Details)"}),s.jsxs("div",{className:"flex items-center gap-4",children:[s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[a[0]],size:"md"}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Single User"})]}),s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[a[0],a[1]],size:"md"}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Two Users"})]}),s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:a.slice(0,4),size:"md"}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Multiple Users"})]})]})]})]})})},m={render:()=>s.jsx(i,{title:"Table Cell Usage Example",description:"Hover over avatars to see assignment tooltips and user details.",children:s.jsx("div",{className:"w-full rounded-lg border",children:s.jsxs("table",{className:"w-full",children:[s.jsx("thead",{children:s.jsxs("tr",{className:"border-b bg-muted/50",children:[s.jsx("th",{className:"text-left p-3",children:"Case ID"}),s.jsx("th",{className:"text-left p-3",children:"Assigned Users"}),s.jsx("th",{className:"text-left p-3",children:"Status"})]})}),s.jsxs("tbody",{children:[s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"666106"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign to case 666106")})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-muted-foreground",children:"Can Assign"})})]}),s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658344"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[],canAssign:!1})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-muted-foreground",children:"No Assignment"})})]}),s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658142"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[a[0]]})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-green-600",children:"Assigned"})})]}),s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658286"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[a[1],a[2]]})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-blue-600",children:"Collaborative"})})]}),s.jsxs("tr",{children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658290"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:a.slice(0,4)})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-purple-600",children:"Team Assignment"})})]})]})]})})})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const q=["Sizes","MaxAvatars","Initials","AssignmentStates","TableUsageExample"];export{d as AssignmentStates,o as Initials,c as MaxAvatars,l as Sizes,m as TableUsageExample,q as __namedExportsOrder,E as default};
