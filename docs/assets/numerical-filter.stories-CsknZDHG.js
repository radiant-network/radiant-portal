import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{a as U}from"./index-B-lxVbXh.js";import{R as u,q as h,M as L,D as ge}from"./query-builder-remote-DQDcrGW9.js";import{r as p}from"./index-DQLiH3RP.js";import{B as K}from"./button-nzUmcdh6.js";import{u as Oe,C as Ve}from"./applications-config-pyPLye2e.js";import{d as X,S as Z,a as C,b as ee,c as ae}from"./select-CBLAvfYe.js";import{I as Q}from"./input-DyY2UfVx.js";import{C as Me}from"./checkbox-BPlUEr5r.js";import{L as Ae}from"./label-BwU4_qxe.js";import{E as $e,L as qe,G as Le,a as Qe,b as Ue,c as Ge}from"./less-than-or-equal-operator-icon-BI5aNTvi.js";import{u as He}from"./i18n-Beob4nnL.js";import{u as Ye,o as We}from"./index-n0DPRcfI.js";import{S as te}from"./skeleton-Shk8p_SP.js";import{w as G,u as I,e as y}from"./index-B7YJKKKT.js";import{c as re}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-fYFwtGmU.js";import"./index-b4Krvw3J.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-Buj5FGR_.js";import"./dropdown-menu-5z4VmTsG.js";import"./index-DZeBqZZX.js";import"./index-CKWZTibS.js";import"./index-CS2et-gJ.js";import"./index-BlJj-Uol.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-2a7OmUZw.js";import"./index-DDGWSPzp.js";import"./chevron-down-QEmn0_AS.js";import"./iframe-XRCfNpsj.js";import"./index-BjfAAjgr.js";function Ne({children:s}){return e.jsx("p",{className:"text-sm text-muted-foreground",children:s})}Ne.__docgenInfo={description:"",methods:[],displayName:"TextMuted",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const ze=s=>We.statisticsGermlineOccurrences(s.seqId,s.statisticsBody).then(t=>t.data);function ne(s,t,n=!1){const i={seqId:"1",statisticsBody:{field:s}},a=n?ge:h.getResolvedActiveQuery(t);return a&&(i.statisticsBody.sqon={content:a.content,op:a.op}),Ye(i,ze,{revalidateOnFocus:!1})}function se(s,t,n,i){var N;let a=!1,m=u.LessThan,v="0",_="0",l="",b=!1;const x=t.content.find(d=>"content"in d&&"field"in d.content?d.content.field===s:!1),g=t.content.find(d=>"content"in d&&"field"in d.content?d.content.field===`${s}_unit`:!1);if(x){const d=x.content.value;if(console.log("[NumericalFilter] values",d),d.includes("__missing__"))return{hasUnappliedItems:a,selectedRange:m,minValue:v,maxValue:_,numericalValue:l,hasNoData:!0,selectedUnit:void 0};a=!0,d.length===2?(m=u.Between,v=Number(d[0]).toFixed(3),_=Number(d[1]).toFixed(3)):l=d[0],x.op&&(m=x.op)}else console.log("[NumericalFilter else] no filter exists",n),b=!1,(n==null?void 0:n.defaultMin)!==void 0?(v=n.defaultMin.toString(),l=n.defaultMin.toString()):(i==null?void 0:i.min)!==void 0&&(v=Number(i.min.toFixed(3)).toString(),l=Number(i.min.toFixed(3)).toString()),(n==null?void 0:n.defaultMax)!==void 0?_=n.defaultMax.toString():(i==null?void 0:i.max)!==void 0&&(_=Number(i.max.toFixed(3)).toString()),n!=null&&n.defaultOperator&&(m=u[n.defaultOperator]);return{hasUnappliedItems:a,selectedRange:m,minValue:v,maxValue:_,numericalValue:l,hasNoData:b,selectedUnit:g?g.content.value[0]:(N=n==null?void 0:n.rangeTypes)!=null&&N.length?n.rangeTypes[0].key:void 0}}function T({field:s}){var W,z,P,J;const{t}=He(),n=Oe(),i=n.variant_exploration.app_id,a=s.key,m={[u.GreaterThan]:{display:t("common.filters.operators.greaterThan"),dropdown:t("common.filters.operators.greaterThan"),icon:Ge},[u.LessThan]:{display:t("common.filters.operators.lessThan"),dropdown:t("common.filters.operators.lessThan"),icon:Ue},[u.Between]:{display:t("common.filters.operators.between"),dropdown:t("common.filters.operators.between"),icon:Qe},[u.GreaterThanOrEqualTo]:{display:t("common.filters.operators.greaterThanOrEqual"),dropdown:t("common.filters.operators.greaterThanOrEqual"),icon:Le},[u.LessThanOrEqualTo]:{display:t("common.filters.operators.lessThanOrEqual"),dropdown:t("common.filters.operators.lessThanOrEqual"),icon:qe},[u.In]:{display:t("common.filters.operators.in"),dropdown:t("common.filters.operators.in"),icon:$e}},{data:v,isLoading:_}=ne(a,i,!0),{data:l,isLoading:b}=ne(a,i,!1),[x,g]=p.useState(u.GreaterThan),[N,d]=p.useState("0"),[F,R]=p.useState("0"),[O,V]=p.useState("0"),[M,A]=p.useState(!1),[B,Be]=p.useState(),[Ie,f]=p.useState(!1),be=n.variant_exploration.aggregations,o=(W=Object.values(be).flatMap(r=>r.items).find(r=>r.key===a))==null?void 0:W.defaults,je=s.type==="numerical"&&(o==null?void 0:o.noDataInputOption),H=(o==null?void 0:o.intervalDecimal)!==void 0&&((o==null?void 0:o.max)!==void 0||(o==null?void 0:o.min)!==void 0)||l&&(l.min!==void 0||l.max!==void 0),$=(o==null?void 0:o.min)??(l==null?void 0:l.min)??0,q=(o==null?void 0:o.max)??(l==null?void 0:l.max)??100,Y=p.useCallback(()=>{const r=h.getResolvedActiveQuery(i);if(r!=null&&r.content){var c=se(a,r,o,l);A(c.hasNoData),V(c.minValue),R(c.maxValue),f(c.hasUnappliedItems),g(c.selectedRange),d(c.numericalValue)}},[i,a,o,l]);p.useEffect(()=>{Y()},[Y]);const we=p.useCallback(r=>{g(r),f(!0)},[]),Se=p.useCallback(r=>{A(r),f(!0)},[]),Ee=p.useCallback(r=>{Be(r),f(!0)},[]),De=()=>{f(!1);var r=se(a,ge,o,v);A(r.hasNoData),V(r.minValue),R(r.maxValue),f(r.hasUnappliedItems),g(r.selectedRange),d(r.numericalValue)},ke=p.useCallback(()=>{if(f(!1),M){h.updateActiveQueryField(i,{field:a,value:["__missing__"],merge_strategy:L.OVERRIDE_VALUES});return}let r=[];r=x===u.Between?[parseFloat(O.toString()),parseFloat(F.toString())]:[parseFloat(N.toString())],h.updateActiveQueryField(i,{field:a,value:r,merge_strategy:L.OVERRIDE_VALUES,operator:x}),B&&h.updateActiveQueryField(i,{field:`${a}_unit`,value:[B],merge_strategy:L.OVERRIDE_VALUES})},[i,a,x,N,O,F,M,B]),Fe=Object.entries(u).map(([r,c])=>{if(c in m){const Re=m[c].icon;return e.jsx(X,{value:c,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Re,{size:16}),e.jsx("span",{children:m[c].dropdown})]})},c)}return null}).filter(Boolean);return e.jsxs("div",{className:"p-2 w-full max-w-md",id:`${a}_container`,children:[e.jsxs("div",{className:"space-y-3 pt-2",children:[e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("div",{id:`${a}_operator`,children:e.jsxs(Z,{value:x,onValueChange:we,children:[e.jsx(C,{children:e.jsx(ee,{placeholder:t("common.filters.operators.selectOperator"),children:m[x].display})}),e.jsx(ae,{children:Fe})]})}),x===u.Between?e.jsxs("div",{className:"flex gap-2 flex-row",children:[e.jsx(Q,{className:"w-half",value:O,onChange:r=>{const c=r.target.value;isNaN(Number(c))||(V(c),f(!0))},min:$,max:q,id:`${a}_min`,"data-testid":`${a}_min`}),e.jsx(Q,{className:"w-half",value:F,onChange:r=>{const c=r.target.value;isNaN(Number(c))||(R(c),f(!0))},min:$,max:q,id:`${a}_max`,"data-testid":`${a}_max`})]}):e.jsx(Q,{className:"w-full",value:N,onChange:r=>{const c=r.target.value;isNaN(Number(c))||(d(c),f(!0))},min:$,max:q,id:`${a}_value`,"data-testid":`${a}_value`}),H&&e.jsx("div",{id:`${a}_interval`,children:e.jsxs(Ne,{children:[t("common.filters.labels.actualInterval")," : ",(z=l==null?void 0:l.min)==null?void 0:z.toFixed(3)," -"," ",(P=l==null?void 0:l.max)==null?void 0:P.toFixed(3)]})})]}),(o==null?void 0:o.rangeTypes)&&o.rangeTypes.length>0&&e.jsx("div",{id:`${a}_range_type_container`,children:b&&_?e.jsxs(e.Fragment,{children:[e.jsx(te,{className:"h-5 w-16 mb-1",id:`${a}_unit_label_skeleton`}),e.jsx(te,{className:"h-9 w-full",id:`${a}_select_skeleton`})]}):e.jsxs(e.Fragment,{children:[e.jsx(Ae,{className:"text-sm",id:`${a}_unit_label`,children:t("common.filters.labels.unit")}),e.jsxs(Z,{defaultValue:B||o.rangeTypes[0].key,onValueChange:Ee,children:[e.jsx(C,{children:e.jsx(ee,{placeholder:t("common.filters.labels.selectUnit"),children:((J=o.rangeTypes.find(r=>r.key===B))==null?void 0:J.name)||t("common.filters.labels.selectUnit")})}),e.jsx(ae,{children:o.rangeTypes.map(r=>e.jsx(X,{value:r.key,children:r.name},r.key))})]})]})}),je&&!H&&e.jsxs("label",{className:"flex items-center space-x-2 overflow-hidden",id:`${a}_no_data_label`,children:[e.jsx(Me,{checked:M,onCheckedChange:Se,id:`${a}_no_data`}),e.jsx("span",{children:t("common.filters.labels.noData")})]})]}),e.jsx("hr",{className:"my-4 border-border",id:`${a}_divider`}),e.jsxs("div",{className:"flex align-right justify-end items-center space-x-2",children:[e.jsx(K,{size:"xs",variant:"ghost",onClick:De,disabled:!Ie,id:`${a}_clear`,children:t("common.filters.buttons.clear")}),e.jsx("div",{className:"flex space-x-2",children:e.jsx(K,{size:"xs",className:"h-7",color:"primary",onClick:ke,id:`${a}_apply`,children:t("common.filters.buttons.apply")})})]})]})}T.__docgenInfo={description:"",methods:[],displayName:"NumericalFilter",props:{field:{required:!0,tsType:{name:"AggregationConfig"},description:""}}};const k={...re,variant_exploration:{...re.variant_exploration,aggregations:{variant:{items:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:u.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:u.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}}}},Ra={title:"Feature/Query Filters/Numerical Filter",component:T,args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:u.GreaterThan}}},decorators:[s=>e.jsx(Ve,{config:k,children:e.jsx(s,{})})]},j={render:s=>e.jsx("div",{className:"space-y-6",children:e.jsx(T,{...s})}),play:async({canvasElement:s})=>{const t=G(s),n=t.getByTestId("impact_score_value");await I.type(n,"75"),y(n).toHaveValue(75);const i=t.getByRole("button",{name:/apply/i});y(i).toBeEnabled(),await I.click(i)}},w={render:s=>(U("activeQuery")(h.updateActiveQueryField(k.variant_exploration.app_id,{field:"impact_score",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(T,{...s})})),play:async({canvasElement:s})=>{const n=await G(s).findByText("No data");await I.click(n),y(n.previousElementSibling).toBeChecked()}},S={args:{field:{key:"impact_score",type:"multiple"}},render:s=>e.jsx("div",{className:"space-y-6",children:e.jsx(T,{...s})})},E={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:u.Between}}},render:s=>(U("activeQuery")(h.updateActiveQueryField(k.variant_exploration.app_id,{field:"age",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(T,{...s})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},D={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:u.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:s=>(U("activeQuery")(h.updateActiveQueryField(k.variant_exploration.app_id,{field:"age_unit",value:[]})),e.jsx("div",{className:"space-y-6",children:e.jsx(T,{...s})})),play:async({canvasElement:s})=>{const t=G(s),n=t.getByText("Between");y(n).toBeInTheDocument();const i=t.getByTestId("age_min"),a=t.getByTestId("age_max");y(i).toBeInTheDocument(),y(a).toBeInTheDocument();const m=t.getByText("Year");y(m).toBeInTheDocument();const v=t.getByText("Clear");y(v).toBeDisabled(),await I.type(i,"50"),y(v).toBeEnabled(),await I.click(v),y(i).toHaveValue(0),y(a).toHaveValue(120),y(m).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var ie,oe,le;j.parameters={...j.parameters,docs:{...(ie=j.parameters)==null?void 0:ie.docs,source:{originalSource:`{
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
}`,...(le=(oe=j.parameters)==null?void 0:oe.docs)==null?void 0:le.source}}};var ce,de,ue;w.parameters={...w.parameters,docs:{...(ce=w.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  render: args => {
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
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
}`,...(ue=(de=w.parameters)==null?void 0:de.docs)==null?void 0:ue.source}}};var me,pe,ye;S.parameters={...S.parameters,docs:{...(me=S.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(ye=(pe=S.parameters)==null?void 0:pe.docs)==null?void 0:ye.source}}};var ve,xe,fe;E.parameters={...E.parameters,docs:{...(ve=E.parameters)==null?void 0:ve.docs,source:{originalSource:`{
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
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
}`,...(fe=(xe=E.parameters)==null?void 0:xe.docs)==null?void 0:fe.source}}};var he,_e,Te;D.parameters={...D.parameters,docs:{...(he=D.parameters)==null?void 0:he.docs,source:{originalSource:`{
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.variant_exploration.app_id, {
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
}`,...(Te=(_e=D.parameters)==null?void 0:_e.docs)==null?void 0:Te.source}}};const Oa=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{j as Default,w as NoDataToggle,S as NoDataToggleHidden,E as RangeFilterWithInterval,D as RangeFilterWithRangeTypes,Oa as __namedExportsOrder,Ra as default};
