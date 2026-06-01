import{g as S,j as e,r as ue}from"./iframe-8oJ5Bgb6.js";import{F as g}from"./filter-button-CVMB3fdZ.js";import{P as xe}from"./priority-indicator-sC1uyMSe.js";import{C as ne}from"./calendar-C95adP34.js";import{U as i}from"./users-FKcXYye4.js";import{S as j}from"./settings-BBfc7Ko4.js";import"./preload-helper-Dp1pzeXC.js";import"./checkbox-filter-DdTILElM.js";import"./checkbox-CZEuzKXP.js";import"./index-ChRUWtUN.js";import"./check-CLsWVnhq.js";import"./label-q4eFVfi7.js";import"./index-DViiVEq-.js";import"./number-format-BhSrr_F9.js";import"./i18n-BUvQZllC.js";import"./badge-BNQh3XGV.js";import"./separator-DpObONvW.js";import"./x-D0roLtfc.js";import"./button-B-Vd7I7W.js";import"./action-button-CdU_izQK.js";import"./dropdown-menu-BT9qsx5b.js";import"./index-BeRE-8C-.js";import"./index-B7DGIYRL.js";import"./circle-CKypI8aC.js";import"./command-CwDSf9Le.js";import"./dialog-CmoIQ25K.js";import"./popover--t-0pc3_.js";import"./search-BsZbX4DC.js";import"./indicator-CJVkYg06.js";import"./shape-triangle-up-icon-CU3lFUHh.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],O=S("Database",ye);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],f=S("FileText",Ne);/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]],o=S("Filter",ve),Ge={title:"Buttons/Filter Button",component:g,args:{label:"Filter",selected:[],options:[],onSelect:()=>{}}},a=[{key:"option1",label:"Option 1",count:42},{key:"option2",label:"Option 2",count:28},{key:"option3",label:"Option 3",count:15},{key:"option4",label:"Option 4",count:7},{key:"option5",label:"Option 5",count:3}],re=[{key:"cardiovascular_disease",label:"Cardiovascular Disease and Related Conditions Including Hypertension",tooltip:"This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.",count:156,icon:i},{key:"diabetes_complications",label:"Diabetes Mellitus Type 2 with Complications and Comorbidities",tooltip:"Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.",count:89,icon:O},{key:"respiratory_conditions",label:"Chronic Respiratory Conditions Including COPD and Asthma",tooltip:"Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.",count:67,icon:f},{key:"neurological_disorders",label:"Neurological Disorders and Neurodegenerative Conditions",tooltip:"Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",count:34,icon:j}],ce=[{key:"users",label:"Users",count:42,icon:i},{key:"database",label:"Database",count:28,icon:O},{key:"files",label:"Files",count:15,icon:f},{key:"calendar",label:"Calendar",count:7,icon:ne}],de=[{key:"option1",label:"Option 1"},{key:"option2",label:"Option 2"},{key:"option3",label:"Option 3"}],pe=["routine","urgent","asap","stat"].map((s,l)=>({key:s,label:e.jsx(xe,{size:"sm",code:s}),count:[42,28,15,7][l]})),v=[{key:"EXTUM",label:"Tumoral Analysis",tooltip:"External Tumoral Analysis",count:234},{key:"CHUSJ",label:"CHU Sainte-Justine Laboratory",count:156},{key:"LSPQ",label:"Laboratoire de santé publique du Québec",count:89},{key:"MUHC",label:"McGill University Health Centre",count:42}],me=[{key:"download",label:"Download Report",icon:f},{key:"export",label:"Export Data",icon:O},{key:"schedule",label:"Schedule Analysis",icon:ne},{key:"share",label:"Share Results",icon:i}],t=({initialSelected:s=[],...l})=>{const[he,be]=ue.useState(s);return e.jsx(g,{...l,selected:he,onSelect:be})},n={render:()=>e.jsx("div",{className:"p-4 flex gap-2",children:["xs","sm","md","lg"].map(s=>e.jsx(g,{popoverSize:s,label:`size ${s}`,options:a,selected:[],onSelect:function(l){throw new Error("Function not implemented.")}},s))})},r={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:a,placeholder:"Search status...",icon:e.jsx(o,{className:"w-4 h-4"})})]})},c={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:re,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})]})},d={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Checkbox list with per-item icons"}),e.jsx(t,{label:"Type",options:ce,placeholder:"Search type...",icon:e.jsx(o,{className:"size-4"})})]})},p={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Options without counts"}),e.jsx(t,{label:"Status",options:de,placeholder:"Search status...",icon:e.jsx(o,{className:"size-4"})})]})},m={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"React node labels (PriorityIndicator)"}),e.jsx(t,{label:"Priority",options:pe,placeholder:"Search priority...",icon:e.jsx(o,{className:"size-4"})})]})},h={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display only (no tooltip)"}),e.jsx(t,{label:"Lab",options:v,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(o,{className:"size-4"})})]})},b={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display + tooltip (code-based filter)"}),e.jsx(t,{label:"Lab",options:v,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(o,{className:"size-4"})})]})},u={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode (No Checkboxes)"}),e.jsx(t,{label:"Actions",options:me,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(j,{className:"size-4"})})]})},x={render:()=>e.jsxs("div",{className:"p-4 space-y-8",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Basic Filter with Checkboxes"}),e.jsx(t,{label:"Status",options:a,placeholder:"Search status...",icon:e.jsx(o,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Long Text with Tooltips"}),e.jsx(t,{label:"Medical Conditions",options:re,placeholder:"Search conditions...",withTooltip:!0,icon:e.jsx(i,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display only (no tooltip)"}),e.jsx(t,{label:"Lab",options:v,popoverSize:"md",placeholder:"Search lab...",showKey:!0,icon:e.jsx(o,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Key display + tooltip (code-based filter)"}),e.jsx(t,{label:"Lab",options:v,popoverSize:"lg",placeholder:"Search lab...",showKey:!0,withTooltip:!0,icon:e.jsx(o,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Checkbox list with per-item icons"}),e.jsx(t,{label:"Type",options:ce,placeholder:"Search type...",icon:e.jsx(o,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Options without counts"}),e.jsx(t,{label:"Status",options:de,placeholder:"Search status...",icon:e.jsx(o,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"React node labels (PriorityIndicator)"}),e.jsx(t,{label:"Priority",options:pe,placeholder:"Search priority...",icon:e.jsx(o,{className:"size-4"})})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Action Mode"}),e.jsx(t,{label:"Actions",options:me,actionMode:!0,closeOnSelect:!0,placeholder:"Search actions...",icon:e.jsx(j,{className:"w-4 h-4"})})]})]})},y={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"With Preselected Items"}),e.jsx(t,{label:"Status",options:a,initialSelected:["option1","option3"],placeholder:"Search status...",icon:e.jsx(o,{className:"size-4"})})]})},N={render:()=>e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Open on Appear"}),e.jsx(t,{label:"Auto Open",options:a,isOpen:!0,placeholder:"Search...",icon:e.jsx(o,{className:"size-4"})})]})};var z,k,F;n.parameters={...n.parameters,docs:{...(z=n.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: () => <div className="p-4 flex gap-2">
      {['xs', 'sm', 'md', 'lg'].map(size => <FilterButton key={size} popoverSize={size as PopoverSize} label={\`size \${size}\`} options={basicOptions} selected={[]} onSelect={function (_selected: string[]): void {
      throw new Error('Function not implemented.');
    }} />)}
    </div>
}`,...(F=(k=n.parameters)==null?void 0:k.docs)==null?void 0:F.source}}};var w,C,T;r.parameters={...r.parameters,docs:{...(w=r.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="w-4 h-4" />} />
    </div>
}`,...(T=(C=r.parameters)==null?void 0:C.docs)==null?void 0:T.source}}};var I,A,B;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
      <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
    </div>
}`,...(B=(A=c.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var M,L,K;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Checkbox list with per-item icons</h3>
      <InteractiveFilterButton label="Type" options={iconOptions} placeholder="Search type..." icon={<Filter className="size-4" />} />
    </div>
}`,...(K=(L=d.parameters)==null?void 0:L.docs)==null?void 0:K.source}}};var P,W,_;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Options without counts</h3>
      <InteractiveFilterButton label="Status" options={noCountOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </div>
}`,...(_=(W=p.parameters)==null?void 0:W.docs)==null?void 0:_.source}}};var R,U,D;m.parameters={...m.parameters,docs:{...(R=m.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">React node labels (PriorityIndicator)</h3>
      <InteractiveFilterButton label="Priority" options={priorityOptions} placeholder="Search priority..." icon={<Filter className="size-4" />} />
    </div>
}`,...(D=(U=m.parameters)==null?void 0:U.docs)==null?void 0:D.source}}};var H,E,V;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Key display only (no tooltip)</h3>
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="md" placeholder="Search lab..." showKey icon={<Filter className="size-4" />} />
    </div>
}`,...(V=(E=h.parameters)==null?void 0:E.docs)==null?void 0:V.source}}};var q,$,J;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Key display + tooltip (code-based filter)</h3>
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="lg" placeholder="Search lab..." showKey withTooltip icon={<Filter className="size-4" />} />
    </div>
}`,...(J=($=b.parameters)==null?void 0:$.docs)==null?void 0:J.source}}};var Q,G,X;u.parameters={...u.parameters,docs:{...(Q=u.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Action Mode (No Checkboxes)</h3>
      <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
    </div>
}`,...(X=(G=u.parameters)==null?void 0:G.docs)==null?void 0:X.source}}};var Z,Y,ee;x.parameters={...x.parameters,docs:{...(Z=x.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(ee=(Y=x.parameters)==null?void 0:Y.docs)==null?void 0:ee.source}}};var te,oe,se;y.parameters={...y.parameters,docs:{...(te=y.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">With Preselected Items</h3>
      <InteractiveFilterButton label="Status" options={basicOptions} initialSelected={['option1', 'option3']} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </div>
}`,...(se=(oe=y.parameters)==null?void 0:oe.docs)==null?void 0:se.source}}};var ie,ae,le;N.parameters={...N.parameters,docs:{...(ie=N.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Open on Appear</h3>
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </div>
}`,...(le=(ae=N.parameters)==null?void 0:ae.docs)==null?void 0:le.source}}};const Xe=["PopOverSize","WithCheckboxList","WithLongTextAndTooltips","WithItemIcons","WithoutCounts","WithReactNodeLabels","WithKeyOnly","WithKeyAndTooltip","ActionMode","AllVariants","WithPreselectedItems","OpenOnAppear"];export{u as ActionMode,x as AllVariants,N as OpenOnAppear,n as PopOverSize,r as WithCheckboxList,d as WithItemIcons,b as WithKeyAndTooltip,h as WithKeyOnly,c as WithLongTextAndTooltips,y as WithPreselectedItems,m as WithReactNodeLabels,p as WithoutCounts,Xe as __namedExportsOrder,Ge as default};
