import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as c,E as u,c as h,G as x,b as m,L as g}from"./less-than-or-equal-operator-icon-BI5aNTvi.js";import{N as I}from"./not-in-operator-icon-DdiM-lgK.js";import{T as f}from"./transcript-canonical-icon-DVFe8yV-.js";import{T as v,a as T}from"./transcript-mane-plus-icon-BNU4ui7j.js";import{b as j,a as N,S as D}from"./shape-circle-icon-BxJCNapB.js";function p({size:a=16,fill:n="currentColor",...r}){return e.jsx("svg",{height:a,width:a,viewBox:"0 0 16 16",xmlns:"http://www.w3.org/2000/svg",fill:n,...r,children:e.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M7.99985 14.3998C11.5345 14.3998 14.3999 11.5344 14.3999 7.99982C14.3999 4.4652 11.5345 1.59982 7.99985 1.59982C4.46523 1.59982 1.59985 4.4652 1.59985 7.99982C1.59985 11.5344 4.46523 14.3998 7.99985 14.3998ZM8 11.9998C10.2091 11.9998 12 10.2089 12 7.9998C12 5.79066 10.2091 3.9998 8 3.9998C5.79086 3.9998 4 5.79066 4 7.9998C4 10.2089 5.79086 11.9998 8 11.9998Z"})})}p.__docgenInfo={description:"",methods:[],displayName:"ShapeDonutIcon",props:{size:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"16",computed:!1}},fill:{defaultValue:{value:"'currentColor'",computed:!1},required:!1}}};function d({size:a=16,fill:n="currentColor",...r}){return e.jsx("svg",{height:a,width:a,viewBox:"0 0 16 16",xmlns:"http://www.w3.org/2000/svg",fill:n,...r,children:e.jsx("path",{d:"M14.3999 13.4C14.3999 13.9523 13.9521 14.4 13.3999 14.4H2.59985C2.04757 14.4 1.59985 13.9523 1.59985 13.4V2.60001C1.59985 2.04772 2.04757 1.60001 2.59985 1.60001H13.3999C13.9521 1.60001 14.3999 2.04772 14.3999 2.60001V13.4Z"})})}d.__docgenInfo={description:"",methods:[],displayName:"ShapeSquareIcon",props:{size:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"16",computed:!1}},fill:{defaultValue:{value:"'currentColor'",computed:!1},required:!1}}};const w={title:"General/Icons",component:c,args:{size:24,fill:"currentColor",className:"shrink-0"}},t={args:{},render:a=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"font-bold text-xl",children:"Icons:"}),e.jsxs("div",{children:["We use Lucide Icons:"," ",e.jsx("a",{href:"https://lucide.dev/icons/",target:"_blank",className:"text-primary underline hover:no-underline",children:"https://lucide.dev/icons/"})]})]}),e.jsx("h1",{className:"font-bold text-xl",children:"Operators:"}),e.jsxs("div",{className:"grid grid-cols-12 gap-2",children:[e.jsx(s,{icon:c,title:"Element",args:a}),e.jsx(s,{icon:u,title:"Equal",args:a}),e.jsx(s,{icon:h,title:"Greater Than",args:a}),e.jsx(s,{icon:x,title:"Grater Than Or Equal",args:a}),e.jsx(s,{icon:m,title:"Less Than",args:a}),e.jsx(s,{icon:g,title:"Less Than Or Equal",args:a}),e.jsx(s,{icon:I,title:"Not In",args:a})]}),e.jsx("h1",{className:"font-bold text-xl",children:"Shapes:"}),e.jsxs("div",{className:"grid grid-cols-12 gap-2",children:[e.jsx(s,{icon:j,title:"Triangle Up",args:a}),e.jsx(s,{icon:N,title:"Triangle Down",args:a}),e.jsx(s,{icon:D,title:"Circle",args:a}),e.jsx(s,{icon:p,title:"Donut",args:a}),e.jsx(s,{icon:d,title:"Square",args:a})]}),e.jsx("h1",{className:"font-bold text-xl",children:"Transcript:"}),e.jsxs("div",{className:"grid grid-cols-12 gap-2",children:[e.jsx(s,{icon:f,title:"Canonical",args:a}),e.jsx(s,{icon:v,title:"Mane Plus",args:a}),e.jsx(s,{icon:T,title:"Mane Select",args:a})]})]})},s=({icon:a,title:n,args:r})=>e.jsxs("div",{className:"flex flex-col gap-1 items-center",children:[e.jsx(a,{...r}),e.jsx("div",{className:"text-xs text-center",children:n})]});var o,i,l;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="space-y-6">
      <div>
        <h1 className="font-bold text-xl">Icons:</h1>
        <div>
          We use Lucide Icons:{' '}
          <a href="https://lucide.dev/icons/" target="_blank" className="text-primary underline hover:no-underline">
            https://lucide.dev/icons/
          </a>
        </div>
      </div>
      <h1 className="font-bold text-xl">Operators:</h1>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={ElementOperatorIcon} title="Element" args={args} />
        <IconDisplay icon={EqualOperatorIcon} title="Equal" args={args} />
        <IconDisplay icon={GreaterThanOperatorIcon} title="Greater Than" args={args} />
        <IconDisplay icon={GreaterThanOrEqualOperatorIcon} title="Grater Than Or Equal" args={args} />
        <IconDisplay icon={LessThanOperatorIcon} title="Less Than" args={args} />
        <IconDisplay icon={LessThanOrEqualOperatorIcon} title="Less Than Or Equal" args={args} />
        <IconDisplay icon={NotInOperatorIcon} title="Not In" args={args} />
      </div>
      <h1 className="font-bold text-xl">Shapes:</h1>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={ShapeTriangleUpIcon} title="Triangle Up" args={args} />
        <IconDisplay icon={ShapeTriangleDownIcon} title="Triangle Down" args={args} />
        <IconDisplay icon={ShapeCircleIcon} title="Circle" args={args} />
        <IconDisplay icon={ShapeDonutIcon} title="Donut" args={args} />
        <IconDisplay icon={ShapeSquareIcon} title="Square" args={args} />
      </div>
      <h1 className="font-bold text-xl">Transcript:</h1>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={TranscriptCanonicalIcon} title="Canonical" args={args} />
        <IconDisplay icon={TranscriptManePlusIcon} title="Mane Plus" args={args} />
        <IconDisplay icon={TranscriptManeSelectIcon} title="Mane Select" args={args} />
      </div>
    </div>
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const b=["Default"];export{t as Default,b as __namedExportsOrder,w as default};
