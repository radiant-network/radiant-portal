import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{n as r,t as i}from"./createLucideIcon-BZk7HdX5.js";import{n as a,t as o}from"./calendar-CKWCmKJi.js";import{n as s,t as c}from"./filter-button-EG4FD94T.js";import{n as l,t as u}from"./file-text-DLvHsPz8.js";import{n as d,t as f}from"./settings-CoBxXs2v.js";import{n as p,t as m}from"./users-B1eOm8So.js";import{i as h,n as g,r as _}from"./story-section-DVTm6cGm.js";import{n as v,t as y}from"./priority-indicator-DrTqOtm2.js";var b,x;function S(){return(S=e((()=>{r(),b={name:`database`,size:24,node:[[`ellipse`,{cx:`12`,cy:`5`,rx:`9`,ry:`3`,key:`msslwz`}],[`path`,{d:`M3 5V19A9 3 0 0 0 21 19V5`,key:`1wlel7`}],[`path`,{d:`M3 12A9 3 0 0 0 21 12`,key:`mv7ke4`}]]},b.node,x=i(b)})))()}var C,w;function T(){return(T=e((()=>{r(),C={name:`funnel`,size:24,node:[[`path`,{d:`M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z`,key:`sc7q7i`}]],aliases:[`filter`]},C.node,w=i(C)})))()}var E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y;function X(){return(X=e((()=>{E=t(),a(),S(),l(),T(),d(),p(),s(),v(),h(),D=n(),O={title:`Components/Buttons/Filter Button`,component:c,args:{label:`Filter`,selected:[],options:[],onSelect:()=>{}}},k=[{key:`option1`,label:`Option 1`,count:42},{key:`option2`,label:`Option 2`,count:28},{key:`option3`,label:`Option 3`,count:15},{key:`option4`,label:`Option 4`,count:7},{key:`option5`,label:`Option 5`,count:3}],A=[{key:`cardiovascular_disease`,label:`Cardiovascular Disease and Related Conditions Including Hypertension`,tooltip:`This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.`,count:156,icon:m},{key:`diabetes_complications`,label:`Diabetes Mellitus Type 2 with Complications and Comorbidities`,tooltip:`Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.`,count:89,icon:x},{key:`respiratory_conditions`,label:`Chronic Respiratory Conditions Including COPD and Asthma`,tooltip:`Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.`,count:67,icon:u},{key:`neurological_disorders`,label:`Neurological Disorders and Neurodegenerative Conditions`,tooltip:`Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.`,count:34,icon:f}],j=[{key:`users`,label:`Users`,count:42,icon:m},{key:`database`,label:`Database`,count:28,icon:x},{key:`files`,label:`Files`,count:15,icon:u},{key:`calendar`,label:`Calendar`,count:7,icon:o}],M=[{key:`option1`,label:`Option 1`},{key:`option2`,label:`Option 2`},{key:`option3`,label:`Option 3`}],N=[`routine`,`urgent`,`asap`,`stat`].map((e,t)=>({key:e,label:(0,D.jsx)(y,{size:`sm`,code:e}),count:[42,28,15,7][t]})),P=[{key:`EXTUM`,label:`Tumoral Analysis`,tooltip:`External Tumoral Analysis`,count:234},{key:`CHUSJ`,label:`CHU Sainte-Justine Laboratory`,count:156},{key:`LSPQ`,label:`Laboratoire de santé publique du Québec`,count:89},{key:`MUHC`,label:`McGill University Health Centre`,count:42}],F=[{key:`download`,label:`Download Report`,icon:u},{key:`export`,label:`Export Data`,icon:x},{key:`schedule`,label:`Schedule Analysis`,icon:o},{key:`share`,label:`Share Results`,icon:m}],I=({initialSelected:e=[],...t})=>{let[n,r]=(0,E.useState)(e);return(0,D.jsx)(c,{...t,selected:n,onSelect:r})},L={render:()=>(0,D.jsx)(g,{title:`Popover sizes`,children:(0,D.jsx)(`div`,{className:`flex gap-2`,children:[`xs`,`sm`,`md`,`lg`].map(e=>(0,D.jsx)(c,{popoverSize:e,label:`size ${e}`,options:k,selected:[],onSelect:function(e){throw Error(`Function not implemented.`)}},e))})})},R={render:()=>(0,D.jsx)(g,{title:`Basic filter with checkboxes`,children:(0,D.jsx)(I,{label:`Status`,options:k,placeholder:`Search status...`,icon:(0,D.jsx)(w,{className:`size-4`})})})},z={render:()=>(0,D.jsx)(g,{title:`Long text with tooltips`,children:(0,D.jsx)(I,{label:`Medical Conditions`,options:A,placeholder:`Search conditions...`,withTooltip:!0,icon:(0,D.jsx)(m,{className:`size-4`})})})},B={render:()=>(0,D.jsx)(g,{title:`Checkbox list with per-item icons`,children:(0,D.jsx)(I,{label:`Type`,options:j,placeholder:`Search type...`,icon:(0,D.jsx)(w,{className:`size-4`})})})},V={render:()=>(0,D.jsx)(g,{title:`Options without counts`,children:(0,D.jsx)(I,{label:`Status`,options:M,placeholder:`Search status...`,icon:(0,D.jsx)(w,{className:`size-4`})})})},H={render:()=>(0,D.jsx)(g,{title:`React node labels (PriorityIndicator)`,children:(0,D.jsx)(I,{label:`Priority`,options:N,placeholder:`Search priority...`,icon:(0,D.jsx)(w,{className:`size-4`})})})},U={render:()=>(0,D.jsx)(g,{title:`Key display only (no tooltip)`,children:(0,D.jsx)(I,{label:`Lab`,options:P,popoverSize:`md`,placeholder:`Search lab...`,showKey:!0,icon:(0,D.jsx)(w,{className:`size-4`})})})},W={render:()=>(0,D.jsx)(g,{title:`Key display + tooltip (code-based filter)`,children:(0,D.jsx)(I,{label:`Lab`,options:P,popoverSize:`lg`,placeholder:`Search lab...`,showKey:!0,withTooltip:!0,icon:(0,D.jsx)(w,{className:`size-4`})})})},G={render:()=>(0,D.jsx)(g,{title:`Action mode (no checkboxes)`,children:(0,D.jsx)(I,{label:`Actions`,options:F,actionMode:!0,closeOnSelect:!0,placeholder:`Search actions...`,icon:(0,D.jsx)(f,{className:`size-4`})})})},K={render:()=>(0,D.jsx)(g,{title:`With preselected items`,children:(0,D.jsx)(I,{label:`Status`,options:k,initialSelected:[`option1`,`option3`],placeholder:`Search status...`,icon:(0,D.jsx)(w,{className:`size-4`})})})},q={render:()=>(0,D.jsx)(g,{title:`Open on appear`,children:(0,D.jsx)(I,{label:`Auto Open`,options:k,isOpen:!0,placeholder:`Search...`,icon:(0,D.jsx)(w,{className:`size-4`})})})},J={render:()=>(0,D.jsxs)(_,{children:[(0,D.jsx)(g,{title:`Basic filter with checkboxes`,children:(0,D.jsx)(I,{label:`Status`,options:k,placeholder:`Search status...`,icon:(0,D.jsx)(w,{className:`size-4`})})}),(0,D.jsx)(g,{title:`Long text with tooltips`,children:(0,D.jsx)(I,{label:`Medical Conditions`,options:A,placeholder:`Search conditions...`,withTooltip:!0,icon:(0,D.jsx)(m,{className:`size-4`})})}),(0,D.jsx)(g,{title:`Key display only (no tooltip)`,children:(0,D.jsx)(I,{label:`Lab`,options:P,popoverSize:`md`,placeholder:`Search lab...`,showKey:!0,icon:(0,D.jsx)(w,{className:`size-4`})})}),(0,D.jsx)(g,{title:`Key display + tooltip (code-based filter)`,children:(0,D.jsx)(I,{label:`Lab`,options:P,popoverSize:`lg`,placeholder:`Search lab...`,showKey:!0,withTooltip:!0,icon:(0,D.jsx)(w,{className:`size-4`})})}),(0,D.jsx)(g,{title:`Checkbox list with per-item icons`,children:(0,D.jsx)(I,{label:`Type`,options:j,placeholder:`Search type...`,icon:(0,D.jsx)(w,{className:`size-4`})})}),(0,D.jsx)(g,{title:`Options without counts`,children:(0,D.jsx)(I,{label:`Status`,options:M,placeholder:`Search status...`,icon:(0,D.jsx)(w,{className:`size-4`})})}),(0,D.jsx)(g,{title:`React node labels (PriorityIndicator)`,children:(0,D.jsx)(I,{label:`Priority`,options:N,placeholder:`Search priority...`,icon:(0,D.jsx)(w,{className:`size-4`})})}),(0,D.jsx)(g,{title:`Action mode`,children:(0,D.jsx)(I,{label:`Actions`,options:F,actionMode:!0,closeOnSelect:!0,placeholder:`Search actions...`,icon:(0,D.jsx)(f,{className:`size-4`})})})]})},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Popover sizes">
      <div className="flex gap-2">
        {['xs', 'sm', 'md', 'lg'].map(size => <FilterButton key={size} popoverSize={size as PopoverSize} label={\`size \${size}\`} options={basicOptions} selected={[]} onSelect={function (_selected: string[]): void {
        throw new Error('Function not implemented.');
      }} />)}
      </div>
    </StorySection>
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Basic filter with checkboxes">
      <InteractiveFilterButton label="Status" options={basicOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Long text with tooltips">
      <InteractiveFilterButton label="Medical Conditions" options={longTextOptions} placeholder="Search conditions..." withTooltip={true} icon={<Users className="size-4" />} />
    </StorySection>
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Checkbox list with per-item icons">
      <InteractiveFilterButton label="Type" options={iconOptions} placeholder="Search type..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Options without counts">
      <InteractiveFilterButton label="Status" options={noCountOptions} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="React node labels (PriorityIndicator)">
      <InteractiveFilterButton label="Priority" options={priorityOptions} placeholder="Search priority..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Key display only (no tooltip)">
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="md" placeholder="Search lab..." showKey icon={<Filter className="size-4" />} />
    </StorySection>
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Key display + tooltip (code-based filter)">
      <InteractiveFilterButton label="Lab" options={labCodeOptions} popoverSize="lg" placeholder="Search lab..." showKey withTooltip icon={<Filter className="size-4" />} />
    </StorySection>
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Action mode (no checkboxes)">
      <InteractiveFilterButton label="Actions" options={actionOptions} actionMode={true} closeOnSelect={true} placeholder="Search actions..." icon={<Settings className="size-4" />} />
    </StorySection>
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With preselected items">
      <InteractiveFilterButton label="Status" options={basicOptions} initialSelected={['option1', 'option3']} placeholder="Search status..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Open on appear">
      <InteractiveFilterButton label="Auto Open" options={basicOptions} isOpen={true} placeholder="Search..." icon={<Filter className="size-4" />} />
    </StorySection>
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
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
}`,...J.parameters?.docs?.source}}},Y=[`PopOverSize`,`WithCheckboxList`,`WithLongTextAndTooltips`,`WithItemIcons`,`WithoutCounts`,`WithReactNodeLabels`,`WithKeyOnly`,`WithKeyAndTooltip`,`ActionMode`,`WithPreselectedItems`,`OpenOnAppear`,`AllVariants`]})))()}X();export{G as ActionMode,J as AllVariants,q as OpenOnAppear,L as PopOverSize,R as WithCheckboxList,B as WithItemIcons,W as WithKeyAndTooltip,U as WithKeyOnly,z as WithLongTextAndTooltips,K as WithPreselectedItems,H as WithReactNodeLabels,V as WithoutCounts,Y as __namedExportsOrder,O as default};