import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{a as v}from"./index-B-lxVbXh.js";import{w as f,u as c,e as t}from"./index-DtL3pAzF.js";import{N as o}from"./filter-list-BjEMo-0o.js";import{C as A}from"./applications-config-DwuB3Ut-.js";import{q as x}from"./query-builder-remote-8d6Fjvxv.js";import{R as s}from"./sqon-DNOccLjA.js";import{c as h}from"./config-mock-BXxtYAjK.js";import"./v4-CtRu48qb.js";import"./index-CGj_12n1.js";import"./accordion-DPra3b9Q.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-BpLad_a1.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./utils-D-KgF5mV.js";import"./chevron-right-CKDh57Sc.js";import"./createLucideIcon-8Lr1oLzj.js";import"./chevron-down-BLzVWgYU.js";import"./button-B_h73SoW.js";import"./action-button-DglMD9AQ.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./check-DRc1RmCY.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-o6S5DVRl.js";import"./iframe-DzvJA_t5.js";import"./i18next-DOi7g2fS.js";import"./card-CVaWHAcA.js";import"./checkbox-filter-CLNLTy1D.js";import"./number-format-DxX1Gy7s.js";import"./checkbox-CuLJw5hI.js";import"./index-qxuqJ0RB.js";import"./label-ymyzYynk.js";import"./input-Dm5winle.js";import"./skeleton-Shk8p_SP.js";import"./switch-Eyi4i66A.js";import"./api-Cjk_w81c.js";import"./index-DxlLpgFR.js";import"./api-Dm3M0Tve.js";import"./search-DqA1hdnz.js";import"./less-than-or-equal-operator-icon-BI5aNTvi.js";import"./select-WOQZTtP8.js";import"./chevron-up-BzG59QGX.js";const y={...h,snv_occurrence:{...h.snv_occurrence,aggregations:{variant:{items:[{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:s.GreaterThan}},{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}]}}}},Ce={title:"QueryBuilder/Query Filters/Numerical Filter",component:o,args:{field:{key:"impact_score",type:"numerical",defaults:{min:0,max:100,defaultMin:0,defaultMax:100,intervalDecimal:2,defaultOperator:s.GreaterThan}}},decorators:[e=>a.jsx(A,{config:y,children:a.jsx(e,{})})]},l={render:e=>a.jsx("div",{className:"space-y-3",children:a.jsx(o,{...e})}),play:async({canvasElement:e})=>{const r=f(e),i=r.getByTestId("impact_score_value");await c.type(i,"75"),t(i).toHaveValue(75);const n=r.getByRole("button",{name:/apply/i});t(n).toBeEnabled(),await c.click(n)}},p={render:e=>(v("activeQuery")(x.updateActiveQueryField(y.snv_occurrence.app_id,{field:"impact_score",value:[]})),a.jsx("div",{className:"space-y-3",children:a.jsx(o,{...e})})),play:async({canvasElement:e})=>{const i=await f(e).findByText("No data");await c.click(i),t(i.previousElementSibling).toBeChecked()}},m={args:{field:{key:"impact_score",type:"multiple"}},render:e=>a.jsx("div",{className:"space-y-3",children:a.jsx(o,{...e})})},u={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between}}},render:e=>(v("activeQuery")(x.updateActiveQueryField(y.snv_occurrence.app_id,{field:"age",value:[]})),a.jsx("div",{className:"space-y-3",children:a.jsx(o,{...e})})),parameters:{docs:{description:{story:'A numerical filter with range constraints. Note: Shows ">" operator by default due to global config override.'}}}},d={args:{field:{key:"age",type:"numerical",defaults:{min:0,max:120,defaultMin:0,defaultMax:120,intervalDecimal:0,defaultOperator:s.Between,rangeTypes:[{key:"year",name:"Year"},{key:"month",name:"Month"},{key:"day",name:"Day"}]}}},render:e=>(v("activeQuery")(x.updateActiveQueryField(y.snv_occurrence.app_id,{field:"age_unit",value:[]})),a.jsx("div",{className:"space-y-3",children:a.jsx(o,{...e})})),play:async({canvasElement:e})=>{const r=f(e),i=r.getByText("Between");t(i).toBeInTheDocument();const n=r.getByTestId("age_min"),B=r.getByTestId("age_max");t(n).toBeInTheDocument(),t(B).toBeInTheDocument();const T=r.getByText("Year");t(T).toBeInTheDocument();const g=r.getByText("Clear");t(g).toBeDisabled(),await c.type(n,"50"),t(g).toBeEnabled(),await c.click(g),t(n).toHaveValue(0),t(B).toHaveValue(120),t(T).toHaveTextContent("Year")},parameters:{docs:{description:{story:"A numerical filter with range type options (Year, Month, Day) and unit selection. Tests validate range operator changes, unit selection, no data visibility, and clear functionality."}}}};var w,D,_;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: args => <div className="space-y-3">
      <NumericalFilter {...args} />
    </div>,
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
      field: 'impact_score',
      value: []
    }));
    return <div className="space-y-3">
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
}`,...(N=(k=p.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};var E,b,M;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    field: {
      key: 'impact_score',
      type: 'multiple'
    }
  },
  render: args => <div className="space-y-3">
      <NumericalFilter {...args} />
    </div>
}`,...(M=(b=m.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var F,R,S;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
      field: 'age',
      value: []
    }));
    return <div className="space-y-3">
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
    action('activeQuery')(queryBuilderRemote.updateActiveQueryField(config.snv_occurrence.app_id, {
      field: 'age_unit',
      value: []
    }));
    return <div className="space-y-3">
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
}`,...(O=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:O.source}}};const Ve=["Default","NoDataToggle","NoDataToggleHidden","RangeFilterWithInterval","RangeFilterWithRangeTypes"];export{l as Default,p as NoDataToggle,m as NoDataToggleHidden,u as RangeFilterWithInterval,d as RangeFilterWithRangeTypes,Ve as __namedExportsOrder,Ce as default};
