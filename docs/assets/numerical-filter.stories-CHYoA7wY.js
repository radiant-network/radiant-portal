import{j as t}from"./jsx-runtime-Cf8x2fCZ.js";import{a as G}from"./index-B-lxVbXh.js";import{R as c,q as v,M as Q}from"./query-builder-remote-Bzymk9lJ.js";import{r as d}from"./index-tvICUrOf.js";import{B as J}from"./button-CrKCvLOn.js";import{S as je}from"./api-BKFoIFaX.js";import{u as ke,C as De}from"./applications-config-B4jBJrF9.js";import{d as X,S as Z,a as ee,b as te,c as ae}from"./select-Cu07QDAL.js";import{I as L}from"./input-aUNQvU1u.js";import{C as Oe}from"./checkbox-Yaa9_JVB.js";import{L as Fe}from"./label-DJRwmf0z.js";import{a as Re,c as Me,b as Ve,E as Ae,L as qe,G as $e}from"./less-than-or-equal-operator-icon-DY2uWcgl.js";import{u as Qe}from"./i18n-BK_BOcFt.js";import{u as Le,o as Ge}from"./api-D6S2JuOj.js";import{w as H,u as _,e as p}from"./index-BZkcKs8Z.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-DRj5dfdv.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./index-C66Dxnp2.js";import"./index-C1xbsqtW.js";import"./index-sxzTQ1UW.js";import"./chevron-down-D97Dr_NX.js";import"./iframe-C8conwkP.js";function he({children:i}){return t.jsx("p",{className:"text-sm text-muted-foreground",children:i})}he.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const He=i=>Ge.statisticsOccurrences(i.seqId,i.statisticsBody).then(a=>a.data);function Ue(i,a=!1,m){let o;a?o={seqId:"5011",statisticsBody:{field:i}}:o=null;const n=v.getResolvedActiveQuery(m);return n&&o&&(o.statisticsBody.sqon={content:n.content,op:n.op}),Le(o,He,{revalidateOnFocus:!1})}function x({field:i}){var Y,W,z,P;const{t:a}=Qe(),m=ke(),o=m.variant_entity.app_id,n=i.key,f={[c.GreaterThan]:{display:a("common.filters.operators.greaterThan"),dropdown:a("common.filters.operators.greaterThan"),icon:$e},[c.LessThan]:{display:a("common.filters.operators.lessThan"),dropdown:a("common.filters.operators.lessThan"),icon:qe},[c.Between]:{display:a("common.filters.operators.between"),dropdown:a("common.filters.operators.between"),icon:Ae},[c.GreaterThanOrEqualTo]:{display:a("common.filters.operators.greaterThanOrEqual"),dropdown:a("common.filters.operators.greaterThanOrEqual"),icon:Ve},[c.LessThanOrEqualTo]:{display:a("common.filters.operators.lessThanOrEqual"),dropdown:a("common.filters.operators.lessThanOrEqual"),icon:Me},[c.In]:{display:a("common.filters.operators.in"),dropdown:a("common.filters.operators.in"),icon:Re}},{data:r,isLoading:Ce}=Ue(n,!0,o),[h,T]=d.useState(c.GreaterThan),[F,B]=d.useState("0"),[R,N]=d.useState("0"),[M,I]=d.useState("0"),[V,A]=d.useState(!1),[g,U]=d.useState(),[ge,y]=d.useState(!1),e=(Y=m.variant_entity.aggregations.find(s=>s.key===n))==null?void 0:Y.defaults,_e=i.type==="numerical"&&(e==null?void 0:e.noDataInputOption),C=(e==null?void 0:e.intervalDecimal)!==void 0&&((e==null?void 0:e.max)!==void 0||(e==null?void 0:e.min)!==void 0)||r&&(r.min!==void 0||r.max!==void 0),q=(e==null?void 0:e.min)??(r==null?void 0:r.min)??0,$=(e==null?void 0:e.max)??(r==null?void 0:r.max)??100,b=d.useCallback(()=>{var K;const s=v.getResolvedActiveQuery(o);if(!(s!=null&&s.content))return;const l=s.content.find(u=>"content"in u&&"field"in u.content?u.content.field===n:!1),w=s.content.find(u=>"content"in u&&"field"in u.content?u.content.field===`${n}_unit`:!1);if(l){const u=l.content.value;if(u.includes("__missing__")){A(!0);return}if(u.length===2){T(c.Between);const Se=Number(u[0]).toFixed(3),Ee=Number(u[1]).toFixed(3);I(Se),N(Ee)}else B(u[0]);l.op&&!(e!=null&&e.defaultOperator)&&T(l.op)}else A(!1),(e==null?void 0:e.defaultMin)!==void 0?(I(e.defaultMin.toString()),B(e.defaultMin.toString())):(r==null?void 0:r.min)!==void 0&&(I(Number(r.min.toFixed(3)).toString()),B(Number(r.min.toFixed(3)).toString())),(e==null?void 0:e.defaultMax)!==void 0?N(e.defaultMax.toString()):(r==null?void 0:r.max)!==void 0&&N(Number(r.max.toFixed(3)).toString()),e!=null&&e.defaultOperator&&T(e.defaultOperator);U(w?w.content.value[0]:(K=e==null?void 0:e.rangeTypes)!=null&&K.length?e.rangeTypes[0].key:void 0)},[o,n,e,r]);d.useEffect(()=>{b()},[b]);const Te=d.useCallback(s=>{T(s),y(!0)},[]),Be=d.useCallback(s=>{A(s),y(!0)},[]),Ne=d.useCallback(s=>{U(s),y(!0)},[]),Ie=d.useCallback(()=>{y(!1),b()},[b]),be=d.useCallback(()=>{if(y(!1),V){v.updateActiveQueryField(o,{field:n,value:["__missing__"],merge_strategy:Q.OVERRIDE_VALUES});return}let s=[];s=h===c.Between?[parseFloat(M.toString()),parseFloat(R.toString())]:[parseFloat(F.toString())],v.updateActiveQueryField(o,{field:n,value:s,merge_strategy:Q.OVERRIDE_VALUES,operator:h}),g&&v.updateActiveQueryField(o,{field:`${n}_unit`,value:[g],merge_strategy:Q.OVERRIDE_VALUES})},[o,n,h,F,M,R,V,g]),we=Object.entries(c).map(([s,l])=>{if(l in f){const w=f[l].icon;return t.jsx(X,{value:l,children:t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(w,{size:16}),t.jsx("span",{children:f[l].dropdown})]})},l)}return null}).filter(Boolean);return t.jsxs("div",{className:"p-2 w-full max-w-md",id:`${n}_container`,children:[t.jsxs("div",{className:"space-y-3 pt-2",children:[t.jsxs("div",{className:"flex flex-col gap-3",children:[t.jsx("div",{id:`${n}_operator`,children:t.jsxs(Z,{defaultValue:`${je.GreaterThan}`,onValueChange:Te,children:[t.jsx(ee,{children:t.jsx(te,{placeholder:a("common.filters.operators.selectOperator"),children:f[h].display})}),t.jsx(ae,{children:we})]})}),h===c.Between?t.jsxs("div",{className:"flex gap-2 flex-row",children:[t.jsx(L,{className:"w-half",value:M,onChange:s=>{const l=s.target.value;console.log("value",l),!isNaN(Number(l))&&(I(l),y(!0))},min:q,max:$,id:`${n}_min`,"data-testid":`${n}_min`}),t.jsx(L,{className:"w-half",value:R,onChange:s=>{const l=s.target.value;isNaN(Number(l))||(N(l),y(!0))},min:q,max:$,id:`${n}_max`,"data-testid":`${n}_max`})]}):t.jsx(L,{className:"w-full",value:F,onChange:s=>{const l=s.target.value;isNaN(Number(l))||(B(l),y(!0))},min:q,max:$,id:`${n}_value`,"data-testid":`${n}_value`}),C&&t.jsx("div",{id:`${n}_interval`,children:t.jsxs(he,{children:[a("common.filters.labels.actualInterval")," : ",(W=r==null?void 0:r.min)==null?void 0:W.toFixed(3)," -"," ",(z=r==null?void 0:r.max)==null?void 0:z.toFixed(3)]})})]}),(e==null?void 0:e.rangeTypes)&&e.rangeTypes.length>0&&t.jsxs("div",{id:`${n}_range_type_container`,children:[t.jsx(Fe,{className:"text-sm",id:`${n}_unit_label`,children:a("common.filters.labels.unit")}),t.jsxs(Z,{defaultValue:g||e.rangeTypes[0].key,onValueChange:Ne,children:[t.jsx(ee,{children:t.jsx(te,{placeholder:a("common.filters.labels.selectUnit"),children:((P=e.rangeTypes.find(s=>s.key===g))==null?void 0:P.name)||a("common.filters.labels.selectUnit")})}),t.jsx(ae,{children:e.rangeTypes.map(s=>t.jsx(X,{value:s.key,children:s.name},s.key))})]})]}),_e&&!C&&t.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${n}_no_data_label`,children:[t.jsx(Oe,{checked:V,onCheckedChange:Be,id:`${n}_no_data`}),t.jsx("span",{children:a("common.filters.labels.noData")})]})]}),t.jsx("hr",{className:"my-4 border-border",id:`${n}_divider`}),t.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[t.jsx(J,{size:"xs",variant:"ghost",onClick:Ie,disabled:!ge,id:`${n}_clear`,children:a("common.filters.buttons.clear")}),t.jsx("div",{className:"flex space-x-2",children:t.jsx(J,{size:"xs",className:"h-7",color:"primary",onClick:be,id:`${n}_apply`,children:a("common.filters.buttons.apply")})})]})]})}x.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const O={variant_entity:{app_id:"variant_entity_toggle_filter",aggregations:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}},bt={title:"Feature/Query Filters/Numerical Filter",component:x,tags:["autodocs"],args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:c.GreaterThan}}},decorators:[i=>t.jsx(De,{config:O,children:t.jsx(i,{})})]},S={render:i=>t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...i})}),play:async({canvasElement:i})=>{const a=H(i),m=a.getByTestId("impact_score_value");await _.type(m,"75"),p(m).toHaveValue(75);const o=a.getByRole("button",{name:/apply/i});p(o).toBeEnabled(),await _.click(o)}},E={render:i=>(G("activeQuery")(v.updateActiveQueryField(O.variant_entity.app_id,{field:"impact_score",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...i})})),play:async({canvasElement:i})=>{const m=await H(i).findByText("No data");await _.click(m),p(m.previousElementSibling).toBeChecked()}},j={args:{field:{key:"impact_score",type:"multiple"}},render:i=>t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...i})})},k={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between}}},render:i=>(G("activeQuery")(v.updateActiveQueryField(O.variant_entity.app_id,{field:"age",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...i})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},D={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:c.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:i=>(G("activeQuery")(v.updateActiveQueryField(O.variant_entity.app_id,{field:"age_unit",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...i})})),play:async({canvasElement:i})=>{const a=H(i),m=a.getByText("Between");p(m).toBeInTheDocument();const o=a.getByTestId("age_min"),n=a.getByTestId("age_max");p(o).toBeInTheDocument(),p(n).toBeInTheDocument();const f=a.getByText("Year");p(f).toBeInTheDocument();const r=a.getByText("Clear");p(r).toBeDisabled(),await _.type(o,"50"),p(r).toBeEnabled(),await _.click(r),p(o).toHaveValue(0),p(n).toHaveValue(120),p(f).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var ne,re,se;S.parameters={...S.parameters,docs:{...(ne=S.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  render: args => {
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Test numeric input
    const numericInput = canvas.getByTestId('impact_score_value');
    await userEvent.type(numericInput, '75');
    expect(numericInput).toHaveValue(75);

    // Test apply button
    const applyButton = canvas.getByRole('button', {
      name: /apply/i
    });
    expect(applyButton).toBeEnabled();
    await userEvent.click(applyButton);
  }
}`,...(se=(re=S.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var ie,oe,le;E.parameters={...E.parameters,docs:{...(ie=E.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
      field: 'impact_score',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const noDataToggle = await canvas.findByText('No data');
    await userEvent.click(noDataToggle);
    expect(noDataToggle.previousElementSibling).toBeChecked();
  }
}`,...(le=(oe=E.parameters)==null?void 0:oe.docs)==null?void 0:le.source}}};var ce,de,ue;j.parameters={...j.parameters,docs:{...(ce=j.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'impact_score',
      type: 'multiple'
    }
  },
  render: args => {
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  }
}`,...(ue=(de=j.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var me,pe,ye;k.parameters={...k.parameters,docs:{...(me=k.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between
      }
    }
  },
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
      field: 'age',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'
      }
    }
  }
}`,...(ye=(pe=k.parameters)==null?void 0:pe.docs)==null?void 0:ye.source}}};var ve,fe,xe;D.parameters={...D.parameters,docs:{...(ve=D.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'age',
      type: 'numerical',
      defaults: {
        min: 0,
        max: 120,
        defaultMin: 0,
        defaultMax: 120,
        intervalDecimal: 0,
        defaultOperator: RangeOperators.Between,
        rangeTypes: [{
          key: 'year',
          name: 'Year'
        }, {
          key: 'month',
          name: 'Month'
        }, {
          key: 'day',
          name: 'Day'
        }]
      }
    }
  },
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_entity.app_id, {
      field: 'age_unit',
      value: []
    }));
    return <div className="space-y-6">
        <NumericalFilter {...args} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);

    // Test initial state
    const operatorSelect = canvas.getByText('Between');
    expect(operatorSelect).toBeInTheDocument();

    // Verify both inputs are visible with "Between" operator
    const minInput = canvas.getByTestId('age_min');
    const maxInput = canvas.getByTestId('age_max');
    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();

    // Test unit type selection
    const unitSelect = canvas.getByText('Year');
    expect(unitSelect).toBeInTheDocument();

    // Test clear functionality
    const clearButton = canvas.getByText('Clear');
    expect(clearButton).toBeDisabled();
    await userEvent.type(minInput, '50');
    expect(clearButton).toBeEnabled();
    await userEvent.click(clearButton);
    expect(minInput).toHaveValue(0);
    expect(maxInput).toHaveValue(120);
    expect(unitSelect).toHaveTextContent('Year');
  },
  parameters: {
    docs: {
      description: {
        story: 'A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality.'
      }
    }
  }
}`,...(xe=(fe=D.parameters)==null?void 0:fe.docs)==null?void 0:xe.source}}};const wt=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{S as Default,E as NoDataToggle,j as NoDataToggleHidden,k as RangeFilterWithInterval,D as RangeFilterWithRangeTypes,wt as __namedExportsOrder,bt as default};
