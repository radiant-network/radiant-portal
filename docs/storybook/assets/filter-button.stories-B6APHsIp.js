import{d as O,j as e,r as L}from"./iframe-pCkdMSW4.js";import{F as k}from"./filter-button-B9WRZtXK.js";import{P as M}from"./priority-indicator-Ooan2Jv7.js";import{a as t,S as K}from"./story-section-BWCYvdHs.js";import{C as N}from"./calendar-DVlfer57.js";import{U as r}from"./users-DbtjDIG0.js";import{S as v}from"./settings-o34SHYIm.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-filter-Bd3rj3D7.js";import"./checkbox-BHPQySjK.js";import"./index-BMaXgdur.js";import"./check-CHUKpJ0A.js";import"./label-LYcp7-DU.js";import"./index-C-yKeQSQ.js";import"./number-format-ByAZAFGD.js";import"./i18n-Cv0t7e2j.js";import"./index-DyQxDMRQ.js";import"./index-wBlvzvCM.js";import"./badge-DEvnTpaP.js";import"./separator-BG0cX3CB.js";import"./x-C4OEjPPf.js";import"./button-CvjWkbHj.js";import"./action-button-CgBxcC7H.js";import"./dropdown-menu-pFkWlMk4.js";import"./index-BCDqYVKf.js";import"./index-B5hhSGrZ.js";import"./circle-DE6Uhsos.js";import"./command-BiKK0VWC.js";import"./dialog-CeyfMy14.js";import"./popover-Dy1XtoDC.js";import"./search-C7jbxdpk.js";import"./indicator-Dl0zMFce.js";import"./shape-triangle-up-icon-BSMLm6Al.js";const P=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],g=O("database",P);const W=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],w=O("file-text",W);const _=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],i=O("funnel",_),je={title:"Components/Buttons/Filter Button",component:k,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},n=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],F=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:r},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:g},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:w},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:v}],C=[{key:"users",label:"Users",count:42,icon:r},{key:"database",label:"Database",count:28,icon:g},{key:"files",label:"Files",count:15,icon:w},{key:"calendar",label:"Calendar",count:7,icon:N}],I=[{key:"option1",label:"Option 1"},{key:"option2",label:"Option 2"},{key:"option3",label:"Option 3"}],A=["routine","urgent","asap","stat"].map((s,a)=>({key:s,label:e.jsx(M,{size:"sm",code:s}),count:[42,28,15,7][a]})),z=[{key:"EXTUM",label:"Tumoral Analysis",tooltip:"External Tumoral Analysis",count:234},{key:"CHUSJ",label:"CHU Sainte-Justine Laboratory",count:156},{key:"LSPQ",label:"Laboratoire de santé publique du Québec",count:89},{key:"MUHC",label:"McGill University Health Centre",count:42}],f=[{key:"download",label:"Download Report",icon:w},{key:"export",label:"Export Data",icon:g},{key:"schedule",label:"Schedule Analysis",icon:N},{key:"share",label:"Share Results",icon:r}],o=({initialSelected:s=[],...a})=>{const[T,B]=L.useState(s);return e.jsx(k,{...a,selected:T,onSelect:B})},l={render:()=>e.jsx(t,{title:"Popover sizes",children:e.jsx("div",{className:"flex gap-2",children:["xs","sm","md","lg"].map(s=>e.jsx(k,{popoverSize:s,label:`size ${s}`,options:n,selected:[],onSelect:function(a){throw new Error("Function not implemented.")}},s))})})},c={render:()=>e.jsx(t,{title:"Basic filter with checkboxes",children:e.jsx(o,{label:"Status",options:n,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})})},p={render:()=>e.jsx(t,{title:"Long text with tooltips",children:e.jsx(o,{label:"Medical Conditions",options:F,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(r,{className:"size-4"})})})},d={render:()=>e.jsx(t,{title:"Checkbox list with per-item icons",children:e.jsx(o,{label:"Type",options:C,placeholder:"Search type...",icon:e.jsx(i,{className:"size-4"})})})},h={render:()=>e.jsx(t,{title:"Options without counts",children:e.jsx(o,{label:"Status",options:I,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})})},u={render:()=>e.jsx(t,{title:"React node labels (PriorityIndicator)",children:e.jsx(o,{label:"Priority",options:A,placeholder:"Search priority...",icon:e.jsx(i,{className:"size-4"})})})},m={render:()=>e.jsx(t,{title:"Key display only (no tooltip)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(i,{className:"size-4"})})})},S={render:()=>e.jsx(t,{title:"Key display + tooltip (code-based filter)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})})},y={render:()=>e.jsx(t,{title:"Action mode (no checkboxes)",children:e.jsx(o,{label:"Actions",options:f,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(v,{className:"size-4"})})})},b={render:()=>e.jsx(t,{title:"With preselected items",children:e.jsx(o,{label:"Status",options:n,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})})},x={render:()=>e.jsx(t,{title:"Open on appear",children:e.jsx(o,{label:"Auto Open",options:n,isOpen:!0,placeholder:"Search...",icon:e.jsx(i,{className:"size-4"})})})},j={render:()=>e.jsxs(K,{children:[e.jsx(t,{title:"Basic filter with checkboxes",children:e.jsx(o,{label:"Status",options:n,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Long text with tooltips",children:e.jsx(o,{label:"Medical Conditions",options:F,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(r,{className:"size-4"})})}),e.jsx(t,{title:"Key display only (no tooltip)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Key display + tooltip (code-based filter)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Checkbox list with per-item icons",children:e.jsx(o,{label:"Type",options:C,placeholder:"Search type...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Options without counts",children:e.jsx(o,{label:"Status",options:I,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"React node labels (PriorityIndicator)",children:e.jsx(o,{label:"Priority",options:A,placeholder:"Search priority...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Action mode",children:e.jsx(o,{label:"Actions",options:f,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(v,{className:"size-4"})})})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Popover sizes">
      <div className="flex gap-2">
        {['xs', 'sm', 'md', 'lg'].map(size => <FilterButton key={size} popoverSize={size as PopoverSize} label={\`size \${size}\`} options={basicOptions} selected={[]} onSelect={function (_selected: string[]): void {
        throw new Error('Function not implemented.');
      }} />)}
      </div>
    </StorySection>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Basic filter with checkboxes">
      <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Long text with tooltips">
      <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
    </StorySection>
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Checkbox list with per-item icons">
      <InteractiveFilterButton label="Type" options={iconOptions} placeholder="Search type..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...d.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Options without counts">
      <InteractiveFilterButton label="Status" options={noCountOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...h.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="React node labels (PriorityIndicator)">
      <InteractiveFilterButton label="Priority" options={priorityOptions} placeholder="Search priority..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Key display only (no tooltip)">
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="md" placeholder="Search lab..." showKey icon={<Filter className="size-4" />} />
    </StorySection>
}`,...m.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Key display + tooltip (code-based filter)">
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="lg" placeholder="Search lab..." showKey withTooltip icon={<Filter className="size-4" />} />
    </StorySection>
}`,...S.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Action mode (no checkboxes)">
      <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
    </StorySection>
}`,...y.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With preselected items">
      <InteractiveFilterButton label="Status" options={basicOptions} initialSelected={['option1', 'option3']} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...b.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Open on appear">
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...x.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Basic filter with checkboxes">
        <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
      </StorySection>

      <StorySection title="Long text with tooltips">
        <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
      </StorySection>

      <StorySection title="Key display only (no tooltip)">
        <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="md" placeholder="Search lab..." showKey icon={<Filter className="size-4" />} />
      </StorySection>

      <StorySection title="Key display + tooltip (code-based filter)">
        <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="lg" placeholder="Search lab..." showKey withTooltip icon={<Filter className="size-4" />} />
      </StorySection>

      <StorySection title="Checkbox list with per-item icons">
        <InteractiveFilterButton label="Type" options={iconOptions} placeholder="Search type..." icon={<Filter className="size-4" />} />
      </StorySection>

      <StorySection title="Options without counts">
        <InteractiveFilterButton label="Status" options={noCountOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
      </StorySection>

      <StorySection title="React node labels (PriorityIndicator)">
        <InteractiveFilterButton label="Priority" options={priorityOptions} placeholder="Search priority..." icon={<Filter className="size-4" />} />
      </StorySection>

      <StorySection title="Action mode">
        <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
      </StorySection>
    </StoryShowcase>
}`,...j.parameters?.docs?.source}}};const ze=["PopOverSize","WithCheckboxList","WithLongTextAndTooltips","WithItemIcons","WithoutCounts","WithReactNodeLabels","WithKeyOnly","WithKeyAndTooltip","ActionMode","WithPreselectedItems","OpenOnAppear","AllVariants"];export{y as ActionMode,j as AllVariants,x as OpenOnAppear,l as PopOverSize,c as WithCheckboxList,d as WithItemIcons,S as WithKeyAndTooltip,m as WithKeyOnly,p as WithLongTextAndTooltips,b as WithPreselectedItems,u as WithReactNodeLabels,h as WithoutCounts,ze as __namedExportsOrder,je as default};
