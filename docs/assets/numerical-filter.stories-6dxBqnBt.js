import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{a as v}from"./index-B-lxVbXh.js";import{R as s,q as f}from"./query-builder-remote-C8T8ZF2t.js";import{N as o}from"./numerical-filter-ZYQql_jr.js";import{C as A}from"./applications-config-pyPLye2e.js";import{w as x,u as c,e as a}from"./index-B7YJKKKT.js";import{c as h}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./api-fYFwtGmU.js";import"./index-DQLiH3RP.js";import"./button-COLXCjUX.js";import"./index-Dw-eQTPP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-BqVcLudk.js";import"./dropdown-menu-Begym49V.js";import"./index-DTwDs4x6.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-DogpHjiW.js";import"./i18n-CD-MtIeo.js";import"./iframe-DhTVCOe0.js";import"./context-DNAkM4o1.js";import"./select-B3-ZNG_-.js";import"./index-DDGWSPzp.js";import"./chevron-down-QEmn0_AS.js";import"./input-DyY2UfVx.js";import"./checkbox-Ce_wbgB6.js";import"./label-E-AdJZe_.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./use-aggregation-builder-Bjoi4SW_.js";import"./index-BjfAAjgr.js";import"./skeleton-Shk8p_SP.js";const y={...h,variant_exploration:{...h.variant_exploration,aggregations:{variant:{items:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:s.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}}}},ke={title:"Feature/Query Filters/Numerical Filter",component:o,args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:s.GreaterThan}}},decorators:[e=>t.jsx(A,{config:y,children:t.jsx(e,{})})]},l={render:e=>t.jsx("div",{className:"space-y-6",children:t.jsx(o,{...e})}),play:async({canvasElement:e})=>{const r=x(e),i=r.getByTestId("impact_score_value");await c.type(i,"75"),a(i).toHaveValue(75);const n=r.getByRole("button",{name:/apply/i});a(n).toBeEnabled(),await c.click(n)}},p={render:e=>(v("activeQuery")(f.updateActiveQueryField(y.variant_exploration.app_id,{field:"impact_score",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(o,{...e})})),play:async({canvasElement:e})=>{const i=await x(e).findByText("No data");await c.click(i),a(i.previousElementSibling).toBeChecked()}},m={args:{field:{key:"impact_score",type:"multiple"}},render:e=>t.jsx("div",{className:"space-y-6",children:t.jsx(o,{...e})})},u={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between}}},render:e=>(v("activeQuery")(f.updateActiveQueryField(y.variant_exploration.app_id,{field:"age",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(o,{...e})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},d={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:e=>(v("activeQuery")(f.updateActiveQueryField(y.variant_exploration.app_id,{field:"age_unit",value:[]})),t.jsx("div",{className:"space-y-6",children:t.jsx(o,{...e})})),play:async({canvasElement:e})=>{const r=x(e),i=r.getByText("Between");a(i).toBeInTheDocument();const n=r.getByTestId("age_min"),B=r.getByTestId("age_max");a(n).toBeInTheDocument(),a(B).toBeInTheDocument();const T=r.getByText("Year");a(T).toBeInTheDocument();const g=r.getByText("Clear");a(g).toBeDisabled(),await c.type(n,"50"),a(g).toBeEnabled(),await c.click(g),a(n).toHaveValue(0),a(B).toHaveValue(120),a(T).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var w,D,_;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(_=(D=l.parameters)==null?void 0:D.docs)==null?void 0:_.source}}};var I,k,N;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(N=(k=p.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};var E,b,F;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(F=(b=m.parameters)==null?void 0:b.docs)==null?void 0:F.source}}};var M,R,S;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(S=(R=u.parameters)==null?void 0:R.docs)==null?void 0:S.source}}};var j,Q,O;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(O=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:O.source}}};const Ne=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{l as Default,p as NoDataToggle,m as NoDataToggleHidden,u as RangeFilterWithInterval,d as RangeFilterWithRangeTypes,Ne as __namedExportsOrder,ke as default};
