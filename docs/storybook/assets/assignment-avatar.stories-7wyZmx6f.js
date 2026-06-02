import{j as s}from"./iframe-DaN5ePGy.js";import{A as e}from"./avatar-BLCsxV6j.js";import{a as x}from"./utils-BQbZHAUO.js";import"./preload-helper-PPVm8Dsz.js";import"./avatar-DBPiBfPq.js";import"./index-FwWjbq00.js";import"./avatar.utils-C1EeCBXD.js";import"./user-avatar-GIuusjCl.js";import"./hover-card-ApfqgsJb.js";import"./button-C2HSnRiu.js";import"./index-buk7i43K.js";import"./action-button-BHK2YR4r.js";import"./dropdown-menu-CPO56L4e.js";import"./index-DeH_VHOF.js";import"./index-CZCzdGEw.js";import"./check-B-s7SQrr.js";import"./circle-ZjFAsy7t.js";import"./separator-Dw2V0eT4.js";import"./i18n-M9kOJp22.js";import"./avatar.styles-DqFVpQKc.js";import"./user-3d638KM8.js";const D={title:"Avatars/Assignment Avatar",component:e,argTypes:{size:{control:{type:"select"},options:x},maxAvatars:{control:{type:"number",min:1}}}},a=[{id:"user-1",name:"Jean-François Soucy",email:"jeanfrancois.soucy.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-2",name:"Julie M. Gauthier",email:"julie.m.gauthier.hsj@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-3",name:"Jacques Michaud",email:"jacques.michaud.med@ssss.gouv.qc.ca",organization:"LDM-CHUSJ"},{id:"user-4",name:"Sarah Wilson",email:"sarah.wilson@hospital.ca",organization:"Toronto General"},{id:"user-5",name:"David Brown",email:"david.brown@clinic.ca",organization:"Vancouver Clinic"},{id:"user-6",name:"Lisa Garcia",email:"lisa.garcia@medical.ca",organization:"Calgary Medical"}],n={render:()=>{const l=[{label:"Unassigned",users:[]},{label:"User Avatar",users:[a[0]]},{label:"Users without count",users:[a[0],a[1]]},{label:"Users with count",users:a.slice(0,4)}];return s.jsx("div",{className:"flex flex-col gap-8 p-4",children:l.map(t=>s.jsxs("div",{className:"flex flex-col gap-4",children:[s.jsx("h3",{className:"text-lg font-semibold",children:t.label}),s.jsx("div",{className:"flex items-end gap-6",children:x.map(r=>s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:t.users,size:r}),s.jsx("span",{className:"text-xs text-muted-foreground",children:r})]},r))})]},t.label))})}},i={render:()=>{const l=[2,3,4],t=[1,2,3,5];return s.jsx("div",{className:"flex flex-col gap-8 p-4",children:l.map(r=>s.jsxs("div",{className:"flex flex-col gap-4",children:[s.jsxs("h3",{className:"text-lg font-semibold",children:["maxAvatars = ",r]}),s.jsx("div",{className:"flex items-center gap-6",children:t.map(o=>s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:a.slice(0,o),maxAvatars:r}),s.jsxs("span",{className:"text-xs text-muted-foreground",children:[o," users"]})]},o))})]},r))})}},c={render:()=>{const l=[{user:{id:"i1",name:"Lisa Garcia"},note:"First + last → LG"},{user:{id:"i2",name:"Jean-François Soucy"},note:"Hyphenated first → JS"},{user:{id:"i3",name:"Anne Marie Tremblay"},note:"Only first two words → AM"},{user:{id:"i4",name:"Madonna"},note:"Single word → MA"},{user:{id:"i5",name:"Alex Bernard",initials:"XYZ"},note:"Custom initials → XY"}];return s.jsx("div",{className:"flex items-start gap-6 p-4",children:l.map(({user:t,note:r})=>s.jsxs("div",{className:"flex w-32 flex-col items-center gap-2 text-center",children:[s.jsx(e,{users:[t]}),s.jsx("span",{className:"text-xs font-medium",children:t.name}),s.jsx("span",{className:"text-xs text-muted-foreground",children:r})]},t.id))})}},m={render:()=>s.jsx("div",{className:"flex flex-col gap-8 p-4",children:s.jsxs("div",{className:"flex flex-col gap-4",children:[s.jsx("h3",{className:"text-lg font-semibold",children:"Assignment Interactions"}),s.jsx("p",{className:"text-sm text-muted-foreground",children:"Hover over the avatars to see tooltips and user details popover."}),s.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[s.jsxs("div",{className:"flex flex-col gap-4",children:[s.jsx("h4",{className:"font-medium",children:"Unassigned States"}),s.jsxs("div",{className:"flex items-center gap-4",children:[s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign clicked!")}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Can Assign"})]}),s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[],canAssign:!1}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Cannot Assign"})]})]})]}),s.jsxs("div",{className:"flex flex-col gap-4",children:[s.jsx("h4",{className:"font-medium",children:"Assigned States (Hover for Details)"}),s.jsxs("div",{className:"flex items-center gap-4",children:[s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[a[0]],size:"md"}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Single User"})]}),s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:[a[0],a[1]],size:"md"}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Two Users"})]}),s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(e,{users:a.slice(0,4),size:"md"}),s.jsx("span",{className:"text-xs text-muted-foreground",children:"Multiple Users"})]})]})]})]})]})})},d={render:()=>s.jsxs("div",{className:"p-4",children:[s.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Table Cell Usage Example"}),s.jsx("p",{className:"text-sm text-muted-foreground mb-4",children:"Hover over avatars to see assignment tooltips and user details."}),s.jsx("div",{className:"border rounded-lg",children:s.jsxs("table",{className:"w-full",children:[s.jsx("thead",{children:s.jsxs("tr",{className:"border-b bg-muted/50",children:[s.jsx("th",{className:"text-left p-3",children:"Prescription ID"}),s.jsx("th",{className:"text-left p-3",children:"Assigned Users"}),s.jsx("th",{className:"text-left p-3",children:"Status"})]})}),s.jsxs("tbody",{children:[s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"666106"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[],canAssign:!0,onAssignClick:()=>alert("Assign to prescription 666106")})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-muted-foreground",children:"Can Assign"})})]}),s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658344"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[],canAssign:!1})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-muted-foreground",children:"No Assignment"})})]}),s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658142"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[a[0]]})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-green-600",children:"Assigned"})})]}),s.jsxs("tr",{className:"border-b",children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658286"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:[a[1],a[2]]})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-blue-600",children:"Collaborative"})})]}),s.jsxs("tr",{children:[s.jsx("td",{className:"p-3 font-mono text-sm",children:"658290"}),s.jsx("td",{className:"p-3",children:s.jsx(e,{users:a.slice(0,4)})}),s.jsx("td",{className:"p-3",children:s.jsx("span",{className:"text-purple-600",children:"Team Assignment"})})]})]})]})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    const states: {
      label: string;
      users: AvatarUser[];
    }[] = [{
      label: 'Unassigned',
      users: []
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
    return <div className="flex flex-col gap-8 p-4">
        {states.map(state => <div key={state.label} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{state.label}</h3>
            <div className="flex items-end gap-6">
              {avatarSizes.map(size => <div key={size} className="flex flex-col items-center gap-2">
                  <Avatar users={state.users} size={size} />
                  <span className="text-xs text-muted-foreground">{size}</span>
                </div>)}
            </div>
          </div>)}
      </div>;
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const thresholds = [2, 3, 4];
    const counts = [1, 2, 3, 5];
    return <div className="flex flex-col gap-8 p-4">
        {thresholds.map(max => <div key={max} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">maxAvatars = {max}</h3>
            <div className="flex items-center gap-6">
              {counts.map(count => <div key={count} className="flex flex-col items-center gap-2">
                  <Avatar users={sampleUsers.slice(0, count)} maxAvatars={max} />
                  <span className="text-xs text-muted-foreground">{count} users</span>
                </div>)}
            </div>
          </div>)}
      </div>;
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
    return <div className="flex items-start gap-6 p-4">
        {examples.map(({
        user,
        note
      }) => <div key={user.id} className="flex w-32 flex-col items-center gap-2 text-center">
            <Avatar users={[user]} />
            <span className="text-xs font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{note}</span>
          </div>)}
      </div>;
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const L=["Sizes","MaxAvatars","Initials","AssignmentStates","TableUsageExample"];export{m as AssignmentStates,c as Initials,i as MaxAvatars,n as Sizes,d as TableUsageExample,L as __namedExportsOrder,D as default};
