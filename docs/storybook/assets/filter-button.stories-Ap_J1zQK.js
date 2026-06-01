import{g as S,j as e,r as B}from"./iframe-fZ1JU2dD.js";import{F as g}from"./filter-button-8jL0fwBd.js";import{P as M}from"./priority-indicator-DU9L_GJp.js";import{C as z}from"./calendar-BWZesG1-.js";import{U as i}from"./users-85RRvFgu.js";import{S as j}from"./settings-BTmxg9pP.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-filter-C63oI0sE.js";import"./checkbox-CmUQOKcS.js";import"./index-oBed2HXp.js";import"./check-BCrtbgAX.js";import"./label-Bgg9wXxM.js";import"./index-BuixPVmM.js";import"./number-format-DT99JFg6.js";import"./i18n-Cu2AZSyu.js";import"./index-BsMQ4rV8.js";import"./badge-_ehbmyEb.js";import"./separator-Bt15M7Wt.js";import"./x-DMxNaVrf.js";import"./button-CeuGaa2_.js";import"./action-button-DH7rTm7W.js";import"./dropdown-menu-WdkrS53z.js";import"./index-Cuzu6qxP.js";import"./index-Bt1gSSe9.js";import"./circle-DE-7MMSe.js";import"./command-CVOpzYX-.js";import"./dialog-1epGVCQo.js";import"./popover-CMm7zbXK.js";import"./search-d017ibSl.js";import"./indicator-DzLj0xlf.js";import"./shape-triangle-up-icon-Dv1IW1Tt.js";const L=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],f=S("database",L);const K=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],O=S("file-text",K);const P=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],s=S("funnel",P),ue={title:"Buttons/Filter Button",component:g,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},a=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],k=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:i},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:f},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:O},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:j}],w=[{key:"users",label:"Users",count:42,icon:i},{key:"database",label:"Database",count:28,icon:f},{key:"files",label:"Files",count:15,icon:O},{key:"calendar",label:"Calendar",count:7,icon:z}],F=[{key:"option1",label:"Option 1"},{key:"option2",label:"Option 2"},{key:"option3",label:"Option 3"}],C=["routine","urgent","asap","stat"].map((o,l)=>({key:o,label:e.jsx(M,{size:"sm",code:o}),count:[42,28,15,7][l]})),N=[{key:"EXTUM",label:"Tumoral Analysis",tooltip:"External Tumoral Analysis",count:234},{key:"CHUSJ",label:"CHU Sainte-Justine Laboratory",count:156},{key:"LSPQ",label:"Laboratoire de santé publique du Québec",count:89},{key:"MUHC",label:"McGill University Health Centre",count:42}],I=[{key:"download",label:"Download Report",icon:O},{key:"export",label:"Export Data",icon:f},{key:"schedule",label:"Schedule Analysis",icon:z},{key:"share",label:"Share Results",icon:i}],t=({initialSelected:o=[],...l})=>{const[T,A]=B.useState(o);return e.jsx(g,{...l,selected:T,onSelect:A})},n={render:()=>e.jsx("div",{className:"p-4 flex gap-2",children:["xs","sm","md","lg"].map(o=>e.jsx(g,{popoverSize:o,label:`size ${o}`,options:a,selected:[],onSelect:function(l){throw new Error("Function not implemented.")}},o))})},r={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:a,placeholder:"Search status...",icon:e.jsx(s,{className:"w-4 h-4"})})]})},c={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:k,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})]})},d={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Checkbox list with per-item icons"}),e.jsx(t,{label:"Type",options:w,placeholder:"Search type...",icon:e.jsx(s,{className:"size-4"})})]})},p={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Options without counts"}),e.jsx(t,{label:"Status",options:F,placeholder:"Search status...",icon:e.jsx(s,{className:"size-4"})})]})},m={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"React node labels (PriorityIndicator)"}),e.jsx(t,{label:"Priority",options:C,placeholder:"Search priority...",icon:e.jsx(s,{className:"size-4"})})]})},h={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display only (no tooltip)"}),e.jsx(t,{label:"Lab",options:N,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(s,{className:"size-4"})})]})},b={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display + tooltip (code-based filter)"}),e.jsx(t,{label:"Lab",options:N,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(s,{className:"size-4"})})]})},u={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode (No Checkboxes)"}),e.jsx(t,{label:"Actions",options:I,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(j,{className:"size-4"})})]})},x={render:()=>e.jsxs("div",{className:"p-4 space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:a,placeholder:"Search status...",icon:e.jsx(s,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:k,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display only (no tooltip)"}),e.jsx(t,{label:"Lab",options:N,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(s,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display + tooltip (code-based filter)"}),e.jsx(t,{label:"Lab",options:N,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(s,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Checkbox list with per-item icons"}),e.jsx(t,{label:"Type",options:w,placeholder:"Search type...",icon:e.jsx(s,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Options without counts"}),e.jsx(t,{label:"Status",options:F,placeholder:"Search status...",icon:e.jsx(s,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"React node labels (PriorityIndicator)"}),e.jsx(t,{label:"Priority",options:C,placeholder:"Search priority...",icon:e.jsx(s,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode"}),e.jsx(t,{label:"Actions",options:I,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(j,{className:"w-4 h-4"})})]})]})},y={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"With Preselected Items"}),e.jsx(t,{label:"Status",options:a,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(s,{className:"size-4"})})]})},v={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Open on Appear"}),e.jsx(t,{label:"Auto Open",options:a,isOpen:!0,placeholder:"Search...",icon:e.jsx(s,{className:"size-4"})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4 flex gap-2">
      {['xs', 'sm', 'md', 'lg'].map(size => <FilterButton key={size} popoverSize={size as PopoverSize} label={\`size \${size}\`} options={basicOptions} selected={[]} onSelect={function (_selected: string[]): void {
      throw new Error('Function not implemented.');
    }} />)}
    </div>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="w-4 h-4" />} />
    </div>
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
      <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
    </div>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Checkbox list with per-item icons</h3>
      <InteractiveFilterButton label="Type" options={iconOptions} placeholder="Search type..." icon={<Filter className="size-4" />} />
    </div>
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Options without counts</h3>
      <InteractiveFilterButton label="Status" options={noCountOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </div>
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">React node labels (PriorityIndicator)</h3>
      <InteractiveFilterButton label="Priority" options={priorityOptions} placeholder="Search priority..." icon={<Filter className="size-4" />} />
    </div>
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Key display only (no tooltip)</h3>
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="md" placeholder="Search lab..." showKey icon={<Filter className="size-4" />} />
    </div>
}`,...h.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Key display + tooltip (code-based filter)</h3>
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="lg" placeholder="Search lab..." showKey withTooltip icon={<Filter className="size-4" />} />
    </div>
}`,...b.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Action Mode (No Checkboxes)</h3>
      <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
    </div>
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4 space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
        <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
        <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Key display only (no tooltip)</h3>
        <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="md" placeholder="Search lab..." showKey icon={<Filter className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Key display + tooltip (code-based filter)</h3>
        <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="lg" placeholder="Search lab..." showKey withTooltip icon={<Filter className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Checkbox list with per-item icons</h3>
        <InteractiveFilterButton label="Type" options={iconOptions} placeholder="Search type..." icon={<Filter className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Options without counts</h3>
        <InteractiveFilterButton label="Status" options={noCountOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">React node labels (PriorityIndicator)</h3>
        <InteractiveFilterButton label="Priority" options={priorityOptions} placeholder="Search priority..." icon={<Filter className="size-4" />} />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Action Mode</h3>
        <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="w-4 h-4" />} />
      </div>
    </div>
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">With Preselected Items</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} initialSelected={['option1', 'option3']} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </div>
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Open on Appear</h3>
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </div>
}`,...v.parameters?.docs?.source}}};const xe=["PopOverSize","WithCheckboxList","WithLongTextAndTooltips","WithItemIcons","WithoutCounts","WithReactNodeLabels","WithKeyOnly","WithKeyAndTooltip","ActionMode","AllVariants","WithPreselectedItems","OpenOnAppear"];export{u as ActionMode,x as AllVariants,v as OpenOnAppear,n as PopOverSize,r as WithCheckboxList,d as WithItemIcons,b as WithKeyAndTooltip,h as WithKeyOnly,c as WithLongTextAndTooltips,y as WithPreselectedItems,m as WithReactNodeLabels,p as WithoutCounts,xe as __namedExportsOrder,ue as default};
