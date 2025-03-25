import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{a as A}from"./index-B-lxVbXh.js";import{R as s,q as y,M as F}from"./query-builder-remote-Dylwn0Sg.js";import{r as l}from"./index-DUAV1Q2A.js";import{B as H}from"./button-CxxI4gy-.js";import{S as ge}from"./api-DIydnFvJ.js";import{u as Te,C as Be}from"./applications-config-DDwFTzON.js";import{S as U,a as Y,b as W,c as z,d as P}from"./select-zrKBR8sU.js";import{I as V}from"./input-BBoUXjlS.js";import{C as Ne}from"./checkbox-C5px12ct.js";import{L as Ie}from"./label-B8_SsO4Y.js";import{a as we,c as je,b as Ee,E as Se,L as ke,G as be}from"./less-than-or-equal-operator-icon-Bw5nz3Pd.js";import{w as $,u as g,e as c}from"./index-DZ0MIZXx.js";import"./v4-CtRu48qb.js";import"./index-CpwtQhPK.js";import"./index-CSO_qfi8.js";import"./index-CqVsPxxY.js";import"./ActionButton-DnR3bAYu.js";import"./dropdown-menu-B4A7Rs1f.js";import"./Combination-GE29BHtn.js";import"./index-D74gQ3ji.js";import"./check-CSglOr1T.js";import"./createLucideIcon-BJ1WAg3L.js";import"./utils-BNf5BS2b.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./IconButton-C7j2XGxo.js";import"./index-DeoL25kd.js";import"./index-GqlsT5mP.js";import"./chevron-down-D2oNhZia.js";function de({children:r}){return t.jsx("p",{className:"text-sm text-muted-foreground",children:r})}de.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const w={[s.GreaterThan]:{display:"Greater than",dropdown:"Greater than",icon:be},[s.LessThan]:{display:"Less than",dropdown:"Less than",icon:ke},[s.Between]:{display:"Between",dropdown:"Between",icon:Se},[s.GreaterThanOrEqualTo]:{display:"Greater than or equal to",dropdown:"Greater than or equal to",icon:Ee},[s.LessThanOrEqualTo]:{display:"Less than or equal to",dropdown:"Less than or equal to",icon:je},[s.In]:{display:"In",dropdown:"In",icon:we}};function v({field:r}){var L,G;const a=r.key,[o,d]=l.useState(s.GreaterThan),[x,h]=l.useState(0),[p,T]=l.useState(0),[R,B]=l.useState(0),[M,N]=l.useState(!1),[_,O]=l.useState(),[ue,m]=l.useState(!1),q=Te(),e=(L=q.variant_entity.aggregations.find(n=>n.key===a))==null?void 0:L.defaults,f=q.variant_entity.app_id,pe=r.type==="numerical",me=(e==null?void 0:e.intervalDecimal)!==void 0&&(e==null?void 0:e.max)!==void 0&&(e==null?void 0:e.min)!==void 0;l.useEffect(()=>{var Q;const n=y.getResolvedActiveQuery(f);if(!(n!=null&&n.content))return;const u=n.content.find(i=>"content"in i&&"field"in i.content?i.content.field===a:!1),I=n.content.find(i=>"content"in i&&"field"in i.content?i.content.field===`${a}_unit`:!1);if(u){const i=u.content.value;if(i.includes("__missing__")){N(!0);return}i.length===2&&(d(s.Between),B(Number(i[0])),T(Number(i[1]))),u.op&&!(e!=null&&e.defaultOperator)&&d(u.op)}else(e==null?void 0:e.defaultMin)!==void 0&&B(e.defaultMin),(e==null?void 0:e.defaultMax)!==void 0&&T(e.defaultMax),e!=null&&e.defaultOperator&&d(e.defaultOperator),N(!1);if(I){const i=I.content.value[0];O(i)}else(Q=e==null?void 0:e.rangeTypes)!=null&&Q.length&&(console.log("aggConfig.rangeTypes",e.rangeTypes),O(e.rangeTypes[0].key))},[f,a,e]);const ye=l.useCallback(n=>{d(n),m(!0)},[]),ve=l.useCallback(n=>{N(n),m(!0)},[]),xe=l.useCallback(n=>{O(n),m(!0)},[]),fe=l.useCallback(()=>{m(!1),N(!1),(e==null?void 0:e.defaultMin)!==void 0&&(B(e.defaultMin),h(e.defaultMin)),(e==null?void 0:e.defaultMax)!==void 0&&T(e.defaultMax)},[e]),he=l.useCallback(()=>{if(m(!1),M){y.updateActiveQueryField(f,{field:a,value:["__missing__"],merge_strategy:F.OVERRIDE_VALUES});return}let n=[];n=o===s.Between?[parseFloat(R.toString()),parseFloat(p.toString())]:[parseFloat(x.toString())],y.updateActiveQueryField(f,{field:a,value:n,merge_strategy:F.OVERRIDE_VALUES}),_&&y.updateActiveQueryField(f,{field:`${a}_unit`,value:[_],merge_strategy:F.OVERRIDE_VALUES})},[f,a,o,x,R,p,M,_]),_e=Object.entries(s).map(([n,u])=>{if(u in w){const I=w[u].icon;return t.jsx(U,{value:u,children:t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(I,{size:16}),t.jsx("span",{children:w[u].dropdown})]})},u)}return null}).filter(Boolean);return t.jsxs("div",{className:"p-2 w-full max-w-md",id:`${a}_container`,children:[t.jsxs("div",{className:"space-y-3 pt-2",children:[t.jsxs("div",{className:"flex flex-col gap-3",children:[t.jsx("div",{id:`${a}_operator`,children:t.jsxs(Y,{defaultValue:`${ge.GreaterThan}`,onValueChange:ye,children:[t.jsx(W,{children:t.jsx(z,{placeholder:"Select range operator",children:w[o].display})}),t.jsx(P,{children:_e})]})}),o===s.Between?t.jsxs("div",{className:"flex gap-2 flex-row",children:[t.jsx(V,{type:"number",className:"w-half",value:R,onChange:n=>{B(Number(n.target.value)),m(!0)},min:e==null?void 0:e.min,max:e==null?void 0:e.max,id:`${a}_min`,"data-testid":`${a}_min`}),t.jsx(V,{type:"number",className:"w-half",value:p,onChange:n=>{T(Number(n.target.value)),m(!0)},min:e==null?void 0:e.min,max:e==null?void 0:e.max,id:`${a}_max`,"data-testid":`${a}_max`})]}):t.jsx(V,{type:"number",className:"w-full",value:x,onChange:n=>h(Number(n.target.value)),min:e==null?void 0:e.min,max:e==null?void 0:e.max,id:`${a}_value`,"data-testid":`${a}_value`}),me&&t.jsx("div",{id:`${a}_interval`,children:t.jsxs(de,{children:["Actual interval : ",e.min," - ",e.max]})})]}),(e==null?void 0:e.rangeTypes)&&e.rangeTypes.length>0&&t.jsxs("div",{id:`${a}_range_type_container`,children:[t.jsx(Ie,{className:"text-sm",id:`${a}_unit_label`,children:"Unit"}),t.jsxs(Y,{defaultValue:_||e.rangeTypes[0].key,onValueChange:xe,children:[t.jsx(W,{children:t.jsx(z,{placeholder:"Select unit",children:((G=e.rangeTypes.find(n=>n.key===_))==null?void 0:G.name)||"Select unit"})}),t.jsx(P,{children:e.rangeTypes.map(n=>t.jsx(U,{value:n.key,children:n.name},n.key))})]})]}),pe&&t.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${a}_no_data_label`,children:[t.jsx(Ne,{checked:M,onCheckedChange:ve,id:`${a}_no_data`}),t.jsx("span",{children:"No data"})]})]}),t.jsx("hr",{className:"my-4 border-border",id:`${a}_divider`}),t.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[t.jsx(H,{className:"text-gray-600",onClick:fe,disabled:!ue,id:`${a}_clear`,children:"Clear"}),t.jsx("div",{className:"flex space-x-2",children:t.jsx(H,{size:"sm",className:"h-7",color:"primary",onClick:he,id:`${a}_apply`,children:"Apply"})})]})]})}v.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const D={variant_entity:{app_id:"variant_entity_toggle_filter",aggregations:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:s.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}},ot={title:"Feature/Query Filters/Numerical Filter",component:v,tags:["autodocs"],args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:s.GreaterThan}}},decorators:[r=>t.jsx(Be,{config:D,children:t.jsx(r,{})})]},j={render:r=>t.jsx("div",{className:"space-y-6",children:t.jsx(v,{...r})}),play:async({canvasElement:r})=>{const a=$(r),o=a.getByTestId("impact_score_value");await g.type(o,"75"),c(o).toHaveValue(75);const d=a.getByRole("button",{name:/apply/i});c(d).toBeEnabled(),await g.click(d)}},E={render:r=>(A("activeQuery")(y.updateActiveQueryField(D.variant_entity.app_id,{field:"impact_score",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(v,{...r})})),play:async({canvasElement:r})=>{const o=await $(r).findByText("No data");await g.click(o),c(o.previousElementSibling).toBeChecked()}},S={args:{field:{key:"impact_score",type:"multiple"}},render:r=>t.jsx("div",{className:"space-y-6",children:t.jsx(v,{...r})})},k={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between}}},render:r=>(A("activeQuery")(y.updateActiveQueryField(D.variant_entity.app_id,{field:"age",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(v,{...r})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},b={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:r=>(A("activeQuery")(y.updateActiveQueryField(D.variant_entity.app_id,{field:"age_unit",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(v,{...r})})),play:async({canvasElement:r})=>{const a=$(r),o=a.getByText("Between");c(o).toBeInTheDocument();const d=a.getByTestId("age_min"),x=a.getByTestId("age_max");c(d).toBeInTheDocument(),c(x).toBeInTheDocument();const h=a.getByText("Year");c(h).toBeInTheDocument();const p=a.getByText("Clear");c(p).toBeDisabled(),await g.type(d,"50"),c(p).toBeEnabled(),await g.click(p),c(d).toHaveValue(0),c(x).toHaveValue(120),c(h).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var K,C,J;j.parameters={...j.parameters,docs:{...(K=j.parameters)==null?void 0:K.docs,source:{originalSource:`{
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
}`,...(J=(C=j.parameters)==null?void 0:C.docs)==null?void 0:J.source}}};var X,Z,ee;E.parameters={...E.parameters,docs:{...(X=E.parameters)==null?void 0:X.docs,source:{originalSource:`{
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
}`,...(ee=(Z=E.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,ae,ne;S.parameters={...S.parameters,docs:{...(te=S.parameters)==null?void 0:te.docs,source:{originalSource:`{
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
}`,...(ne=(ae=S.parameters)==null?void 0:ae.docs)==null?void 0:ne.source}}};var re,se,ie;k.parameters={...k.parameters,docs:{...(re=k.parameters)==null?void 0:re.docs,source:{originalSource:`{
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
}`,...(ie=(se=k.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var le,oe,ce;b.parameters={...b.parameters,docs:{...(le=b.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(ce=(oe=b.parameters)==null?void 0:oe.docs)==null?void 0:ce.source}}};const ct=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{j as Default,E as NoDataToggle,S as NoDataToggleHidden,k as RangeFilterWithInterval,b as RangeFilterWithRangeTypes,ct as __namedExportsOrder,ot as default};
