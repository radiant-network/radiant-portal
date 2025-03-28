import{j as t}from"./jsx-runtime-Cf8x2fCZ.js";import{a as A}from"./index-B-lxVbXh.js";import{R as i,q as v,M as F}from"./query-builder-remote-cbsUKmD0.js";import{r as l}from"./index-tvICUrOf.js";import{B as U}from"./button-8ZB15y1Y.js";import{S as ge}from"./api-DIydnFvJ.js";import{u as Be,C as Ne}from"./applications-config-B4jBJrF9.js";import{S as Y,a as W,b as z,c as P,d as K}from"./select-DOtmeYAo.js";import{I as V}from"./input-BZ84EvCs.js";import{C as Ie}from"./checkbox-DL8sunIr.js";import{L as be}from"./label-DJRwmf0z.js";import{a as we,c as Ee,b as je,E as ke,L as Se,G as De}from"./less-than-or-equal-operator-icon-DY2uWcgl.js";import{u as Oe}from"./i18n-Ber6Uh7x.js";import{w as $,u as _,e as d}from"./index-BZkcKs8Z.js";import"./index-yBjzXJbu.js";import"./v4-CtRu48qb.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-BJjHF_QO.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./IconButton-DL58Pmf8.js";import"./index-C1xbsqtW.js";import"./index-sxzTQ1UW.js";import"./chevron-down-D97Dr_NX.js";import"./iframe-DkzBV2aV.js";function ue({children:s}){return t.jsx("p",{className:"text-sm text-muted-foreground",children:s})}ue.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};function x({field:s}){var L,G;const{t:r}=Oe(),c={[i.GreaterThan]:{display:r("common.filters.operators.greaterThan"),dropdown:r("common.filters.operators.greaterThan"),icon:De},[i.LessThan]:{display:r("common.filters.operators.lessThan"),dropdown:r("common.filters.operators.lessThan"),icon:Se},[i.Between]:{display:r("common.filters.operators.between"),dropdown:r("common.filters.operators.between"),icon:ke},[i.GreaterThanOrEqualTo]:{display:r("common.filters.operators.greaterThanOrEqual"),dropdown:r("common.filters.operators.greaterThanOrEqual"),icon:je},[i.LessThanOrEqualTo]:{display:r("common.filters.operators.lessThanOrEqual"),dropdown:r("common.filters.operators.lessThanOrEqual"),icon:Ee},[i.In]:{display:r("common.filters.operators.in"),dropdown:r("common.filters.operators.in"),icon:we}},a=s.key,[m,p]=l.useState(i.GreaterThan),[y,q]=l.useState(0),[D,g]=l.useState(0),[O,B]=l.useState(0),[R,N]=l.useState(!1),[T,M]=l.useState(),[me,f]=l.useState(!1),Q=Be(),e=(L=Q.variant_entity.aggregations.find(n=>n.key===a))==null?void 0:L.defaults,h=Q.variant_entity.app_id,pe=s.type==="numerical",ye=(e==null?void 0:e.intervalDecimal)!==void 0&&(e==null?void 0:e.max)!==void 0&&(e==null?void 0:e.min)!==void 0;l.useEffect(()=>{var H;const n=v.getResolvedActiveQuery(h);if(!(n!=null&&n.content))return;const u=n.content.find(o=>"content"in o&&"field"in o.content?o.content.field===a:!1),I=n.content.find(o=>"content"in o&&"field"in o.content?o.content.field===`${a}_unit`:!1);if(u){const o=u.content.value;if(o.includes("__missing__")){N(!0);return}o.length===2&&(p(i.Between),B(Number(o[0])),g(Number(o[1]))),u.op&&!(e!=null&&e.defaultOperator)&&p(u.op)}else(e==null?void 0:e.defaultMin)!==void 0&&B(e.defaultMin),(e==null?void 0:e.defaultMax)!==void 0&&g(e.defaultMax),e!=null&&e.defaultOperator&&p(e.defaultOperator),N(!1);if(I){const o=I.content.value[0];M(o)}else(H=e==null?void 0:e.rangeTypes)!=null&&H.length&&(console.log("aggConfig.rangeTypes",e.rangeTypes),M(e.rangeTypes[0].key))},[h,a,e]);const fe=l.useCallback(n=>{p(n),f(!0)},[]),ve=l.useCallback(n=>{N(n),f(!0)},[]),xe=l.useCallback(n=>{M(n),f(!0)},[]),he=l.useCallback(()=>{f(!1),N(!1),(e==null?void 0:e.defaultMin)!==void 0&&(B(e.defaultMin),q(e.defaultMin)),(e==null?void 0:e.defaultMax)!==void 0&&g(e.defaultMax)},[e]),Te=l.useCallback(()=>{if(f(!1),R){v.updateActiveQueryField(h,{field:a,value:["__missing__"],merge_strategy:F.OVERRIDE_VALUES});return}let n=[];n=m===i.Between?[parseFloat(O.toString()),parseFloat(D.toString())]:[parseFloat(y.toString())],v.updateActiveQueryField(h,{field:a,value:n,merge_strategy:F.OVERRIDE_VALUES}),T&&v.updateActiveQueryField(h,{field:`${a}_unit`,value:[T],merge_strategy:F.OVERRIDE_VALUES})},[h,a,m,y,O,D,R,T]),_e=Object.entries(i).map(([n,u])=>{if(u in c){const I=c[u].icon;return t.jsx(Y,{value:u,children:t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(I,{size:16}),t.jsx("span",{children:c[u].dropdown})]})},u)}return null}).filter(Boolean);return t.jsxs("div",{className:"p-2 w-full max-w-md",id:`${a}_container`,children:[t.jsxs("div",{className:"space-y-3 pt-2",children:[t.jsxs("div",{className:"flex flex-col gap-3",children:[t.jsx("div",{id:`${a}_operator`,children:t.jsxs(W,{defaultValue:`${ge.GreaterThan}`,onValueChange:fe,children:[t.jsx(z,{children:t.jsx(P,{placeholder:r("common.filters.operators.selectOperator"),children:c[m].display})}),t.jsx(K,{children:_e})]})}),m===i.Between?t.jsxs("div",{className:"flex gap-2 flex-row",children:[t.jsx(V,{type:"number",className:"w-half",value:O,onChange:n=>{B(Number(n.target.value)),f(!0)},min:e==null?void 0:e.min,max:e==null?void 0:e.max,id:`${a}_min`,"data-testid":`${a}_min`}),t.jsx(V,{type:"number",className:"w-half",value:D,onChange:n=>{g(Number(n.target.value)),f(!0)},min:e==null?void 0:e.min,max:e==null?void 0:e.max,id:`${a}_max`,"data-testid":`${a}_max`})]}):t.jsx(V,{type:"number",className:"w-full",value:y,onChange:n=>q(Number(n.target.value)),min:e==null?void 0:e.min,max:e==null?void 0:e.max,id:`${a}_value`,"data-testid":`${a}_value`}),ye&&t.jsx("div",{id:`${a}_interval`,children:t.jsxs(ue,{children:[r("common.filters.labels.actualInterval")," : ",e.min," - ",e.max]})})]}),(e==null?void 0:e.rangeTypes)&&e.rangeTypes.length>0&&t.jsxs("div",{id:`${a}_range_type_container`,children:[t.jsx(be,{className:"text-sm",id:`${a}_unit_label`,children:r("common.filters.labels.unit")}),t.jsxs(W,{defaultValue:T||e.rangeTypes[0].key,onValueChange:xe,children:[t.jsx(z,{children:t.jsx(P,{placeholder:r("common.filters.labels.selectUnit"),children:((G=e.rangeTypes.find(n=>n.key===T))==null?void 0:G.name)||r("common.filters.labels.selectUnit")})}),t.jsx(K,{children:e.rangeTypes.map(n=>t.jsx(Y,{value:n.key,children:n.name},n.key))})]})]}),pe&&t.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${a}_no_data_label`,children:[t.jsx(Ie,{checked:R,onCheckedChange:ve,id:`${a}_no_data`}),t.jsx("span",{children:r("common.filters.labels.noData")})]})]}),t.jsx("hr",{className:"my-4 border-border",id:`${a}_divider`}),t.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[t.jsx(U,{className:"text-gray-600",onClick:he,disabled:!me,id:`${a}_clear`,children:r("common.filters.buttons.clear")}),t.jsx("div",{className:"flex space-x-2",children:t.jsx(U,{size:"sm",className:"h-7",color:"primary",onClick:Te,id:`${a}_apply`,children:r("common.filters.buttons.apply")})})]})]})}x.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const S={variant_entity:{app_id:"variant_entity_toggle_filter",aggregations:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:i.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:i.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}},pt={title:"Feature/Query Filters/Numerical Filter",component:x,tags:["autodocs"],args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:i.GreaterThan}}},decorators:[s=>t.jsx(Ne,{config:S,children:t.jsx(s,{})})]},b={render:s=>t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...s})}),play:async({canvasElement:s})=>{const r=$(s),c=r.getByTestId("impact_score_value");await _.type(c,"75"),d(c).toHaveValue(75);const a=r.getByRole("button",{name:/apply/i});d(a).toBeEnabled(),await _.click(a)}},w={render:s=>(A("activeQuery")(v.updateActiveQueryField(S.variant_entity.app_id,{field:"impact_score",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...s})})),play:async({canvasElement:s})=>{const c=await $(s).findByText("No data");await _.click(c),d(c.previousElementSibling).toBeChecked()}},E={args:{field:{key:"impact_score",type:"multiple"}},render:s=>t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...s})})},j={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:i.Between}}},render:s=>(A("activeQuery")(v.updateActiveQueryField(S.variant_entity.app_id,{field:"age",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...s})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},k={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:i.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:s=>(A("activeQuery")(v.updateActiveQueryField(S.variant_entity.app_id,{field:"age_unit",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(x,{...s})})),play:async({canvasElement:s})=>{const r=$(s),c=r.getByText("Between");d(c).toBeInTheDocument();const a=r.getByTestId("age_min"),m=r.getByTestId("age_max");d(a).toBeInTheDocument(),d(m).toBeInTheDocument();const p=r.getByText("Year");d(p).toBeInTheDocument();const y=r.getByText("Clear");d(y).toBeDisabled(),await _.type(a,"50"),d(y).toBeEnabled(),await _.click(y),d(a).toHaveValue(0),d(m).toHaveValue(120),d(p).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var J,X,Z;b.parameters={...b.parameters,docs:{...(J=b.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(Z=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var C,ee,te;w.parameters={...w.parameters,docs:{...(C=w.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(te=(ee=w.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ae,re,ne;E.parameters={...E.parameters,docs:{...(ae=E.parameters)==null?void 0:ae.docs,source:{originalSource:`{
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
}`,...(ne=(re=E.parameters)==null?void 0:re.docs)==null?void 0:ne.source}}};var se,ie,oe;j.parameters={...j.parameters,docs:{...(se=j.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(oe=(ie=j.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var le,ce,de;k.parameters={...k.parameters,docs:{...(le=k.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(de=(ce=k.parameters)==null?void 0:ce.docs)==null?void 0:de.source}}};const yt=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{b as Default,w as NoDataToggle,E as NoDataToggleHidden,j as RangeFilterWithInterval,k as RangeFilterWithRangeTypes,yt as __namedExportsOrder,pt as default};
