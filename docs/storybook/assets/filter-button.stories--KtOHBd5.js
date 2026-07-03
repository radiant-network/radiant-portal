import{d as w,j as e,r as L}from"./iframe-Clj-cmbv.js";import{F as O}from"./filter-button-DBzD7d1k.js";import{P as K}from"./priority-indicator-8eRwK9Xv.js";import{a as t,S as P}from"./story-section-DCzIVbFj.js";import{F as v}from"./file-text-DOJrPIq2.js";import{C as F}from"./calendar-D0JCWVV7.js";import{U as r}from"./users-BuSEzS8z.js";import{S as g}from"./settings-MP7IkaqB.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-filter-BhYjIV5h.js";import"./checkbox-BGdOEcDe.js";import"./index-DOHSHEWr.js";import"./check-DR5_QgnI.js";import"./label-QaK_1ghx.js";import"./number-format-BqdioBhs.js";import"./i18n-CteUV2dW.js";import"./index-BRQotc69.js";import"./badge-BjNtobNr.js";import"./separator-BkoI8fxB.js";import"./x-BOxx-XgJ.js";import"./button-CpjCmLUP.js";import"./action-button-B-B5BuJQ.js";import"./dropdown-menu-D1F9T0ri.js";import"./index-LQNM7kie.js";import"./index-DujBfDZp.js";import"./circle-RCbrrEpe.js";import"./command-B3Uomy9p.js";import"./dialog-DU2_QskT.js";import"./popover-mYB4IRDq.js";import"./search-BTiTc34-.js";import"./indicator-Bf4aubvh.js";import"./shape-triangle-up-icon-BCP3bL4w.js";const W=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],k=w("database",W);const M=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],i=w("funnel",M),be={title:"Components/Buttons/Filter Button",component:O,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},n=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],N=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:r},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:k},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:v},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:g}],C=[{key:"users",label:"Users",count:42,icon:r},{key:"database",label:"Database",count:28,icon:k},{key:"files",label:"Files",count:15,icon:v},{key:"calendar",label:"Calendar",count:7,icon:F}],I=[{key:"option1",label:"Option 1"},{key:"option2",label:"Option 2"},{key:"option3",label:"Option 3"}],A=["routine","urgent","asap","stat"].map((s,a)=>({key:s,label:e.jsx(K,{size:"sm",code:s}),count:[42,28,15,7][a]})),z=[{key:"EXTUM",label:"Tumoral Analysis",tooltip:"External Tumoral Analysis",count:234},{key:"CHUSJ",label:"CHU Sainte-Justine Laboratory",count:156},{key:"LSPQ",label:"Laboratoire de santé publique du Québec",count:89},{key:"MUHC",label:"McGill University Health Centre",count:42}],T=[{key:"download",label:"Download Report",icon:v},{key:"export",label:"Export Data",icon:k},{key:"schedule",label:"Schedule Analysis",icon:F},{key:"share",label:"Share Results",icon:r}],o=({initialSelected:s=[],...a})=>{const[B,f]=L.useState(s);return e.jsx(O,{...a,selected:B,onSelect:f})},l={render:()=>e.jsx(t,{title:"Popover sizes",children:e.jsx("div",{className:"flex gap-2",children:["xs","sm","md","lg"].map(s=>e.jsx(O,{popoverSize:s,label:`size ${s}`,options:n,selected:[],onSelect:function(a){throw new Error("Function not implemented.")}},s))})})},c={render:()=>e.jsx(t,{title:"Basic filter with checkboxes",children:e.jsx(o,{label:"Status",options:n,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})})},p={render:()=>e.jsx(t,{title:"Long text with tooltips",children:e.jsx(o,{label:"Medical Conditions",options:N,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(r,{className:"size-4"})})})},d={render:()=>e.jsx(t,{title:"Checkbox list with per-item icons",children:e.jsx(o,{label:"Type",options:C,placeholder:"Search type...",icon:e.jsx(i,{className:"size-4"})})})},h={render:()=>e.jsx(t,{title:"Options without counts",children:e.jsx(o,{label:"Status",options:I,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})})},u={render:()=>e.jsx(t,{title:"React node labels (PriorityIndicator)",children:e.jsx(o,{label:"Priority",options:A,placeholder:"Search priority...",icon:e.jsx(i,{className:"size-4"})})})},m={render:()=>e.jsx(t,{title:"Key display only (no tooltip)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(i,{className:"size-4"})})})},S={render:()=>e.jsx(t,{title:"Key display + tooltip (code-based filter)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})})},y={render:()=>e.jsx(t,{title:"Action mode (no checkboxes)",children:e.jsx(o,{label:"Actions",options:T,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(g,{className:"size-4"})})})},b={render:()=>e.jsx(t,{title:"With preselected items",children:e.jsx(o,{label:"Status",options:n,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})})},x={render:()=>e.jsx(t,{title:"Open on appear",children:e.jsx(o,{label:"Auto Open",options:n,isOpen:!0,placeholder:"Search...",icon:e.jsx(i,{className:"size-4"})})})},j={render:()=>e.jsxs(P,{children:[e.jsx(t,{title:"Basic filter with checkboxes",children:e.jsx(o,{label:"Status",options:n,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Long text with tooltips",children:e.jsx(o,{label:"Medical Conditions",options:N,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(r,{className:"size-4"})})}),e.jsx(t,{title:"Key display only (no tooltip)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Key display + tooltip (code-based filter)",children:e.jsx(o,{label:"Lab",options:z,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Checkbox list with per-item icons",children:e.jsx(o,{label:"Type",options:C,placeholder:"Search type...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Options without counts",children:e.jsx(o,{label:"Status",options:I,placeholder:"Search status...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"React node labels (PriorityIndicator)",children:e.jsx(o,{label:"Priority",options:A,placeholder:"Search priority...",icon:e.jsx(i,{className:"size-4"})})}),e.jsx(t,{title:"Action mode",children:e.jsx(o,{label:"Actions",options:T,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(g,{className:"size-4"})})})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...j.parameters?.docs?.source}}};const xe=["PopOverSize","WithCheckboxList","WithLongTextAndTooltips","WithItemIcons","WithoutCounts","WithReactNodeLabels","WithKeyOnly","WithKeyAndTooltip","ActionMode","WithPreselectedItems","OpenOnAppear","AllVariants"];export{y as ActionMode,j as AllVariants,x as OpenOnAppear,l as PopOverSize,c as WithCheckboxList,d as WithItemIcons,S as WithKeyAndTooltip,m as WithKeyOnly,p as WithLongTextAndTooltips,b as WithPreselectedItems,u as WithReactNodeLabels,h as WithoutCounts,xe as __namedExportsOrder,be as default};
