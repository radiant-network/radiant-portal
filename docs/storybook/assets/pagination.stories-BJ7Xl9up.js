import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-BRh_h4kc.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{a as i,c as a,d as o,i as s,l as c,n as l,o as u,r as d,s as f,t as p,u as m}from"./pagination-J6NSAFim.js";import{m as h,w as g}from"./api-DXv3C38A.js";import{i as _,n as v,r as y}from"./story-section-DVTm6cGm.js";import{r as b,t as x}from"./lib-CZRp1gG1.js";import{i as S,n as C,t as w}from"./applications-config-D877dlRU.js";var T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{T=t(n(),1),b(),g(),o(),S(),_(),E=r(),D={variant_entity:{app_id:w.variant_entity},germline_snv_occurrence:{app_id:w.germline_snv_occurrence,aggregations:[],saved_filter_type:h.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:w.germline_cnv_occurrence,aggregations:[],saved_filter_type:h.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:w.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:h.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:w.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:h.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:w.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:h.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:w.admin},portal:{name:``,navigation:{}}},O={title:`Components/Paginations/Pagination`,component:p,decorators:[e=>(0,E.jsx)(x,{children:(0,E.jsx)(C,{config:D,children:(0,E.jsx)(e,{className:`w-full`})})})]},k={render:()=>(0,E.jsxs)(y,{children:[(0,E.jsx)(v,{title:`Container with numbers`,children:(0,E.jsx)(p,{className:`mx-0 w-fit`,children:(0,E.jsxs)(l,{children:[(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`1`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`2`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`3`})})]})})}),(0,E.jsx)(v,{title:`First`,children:(0,E.jsx)(s,{})}),(0,E.jsx)(v,{title:`Last`,children:(0,E.jsx)(u,{})}),(0,E.jsx)(v,{title:`Previous`,children:(0,E.jsx)(m,{})}),(0,E.jsx)(v,{title:`Next`,children:(0,E.jsx)(a,{})}),(0,E.jsx)(v,{title:`Ellipsis`,children:(0,E.jsx)(d,{})}),(0,E.jsx)(v,{title:`Page size`,children:(0,E.jsx)(c,{pageSize:20,onPageSizeChange:()=>{},className:`w-fit`})})]})},A={render:()=>(0,E.jsxs)(y,{children:[(0,E.jsx)(v,{title:`Basic pagination`,children:(0,E.jsx)(p,{className:`mx-0 w-fit`,children:(0,E.jsxs)(l,{children:[(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`1`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{isActive:!0,children:`2`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`3`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`4`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`5`})})]})})}),(0,E.jsx)(v,{title:`With navigation`,children:(0,E.jsx)(p,{className:`mx-0 w-fit`,children:(0,E.jsxs)(l,{children:[(0,E.jsx)(i,{children:(0,E.jsx)(s,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(m,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(d,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`4`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{isActive:!0,children:`5`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`6`})}),(0,E.jsx)(i,{children:(0,E.jsx)(d,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(a,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(u,{})})]})})}),(0,E.jsx)(v,{title:`Complete example`,children:(0,E.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`Showing 21-40`}),(0,E.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`of 1,234 results`})]}),(0,E.jsx)(p,{className:`mx-0 w-fit`,children:(0,E.jsxs)(l,{children:[(0,E.jsx)(i,{children:(0,E.jsx)(c,{pageSize:20,onPageSizeChange:()=>{}})}),(0,E.jsx)(i,{children:(0,E.jsx)(s,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(m,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`1`})}),(0,E.jsx)(i,{children:(0,E.jsx)(d,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`4`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{isActive:!0,children:`5`})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`6`})}),(0,E.jsx)(i,{children:(0,E.jsx)(d,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(f,{children:`62`})}),(0,E.jsx)(i,{children:(0,E.jsx)(a,{})}),(0,E.jsx)(i,{children:(0,E.jsx)(u,{})})]})})]})})]})},j={render:()=>{let[e,t]=T.useState(5),[n,r]=T.useState(20),o=1234,h=(e-1)*n+1,g=Math.min(e*n,o),_=e=>{t(Math.max(1,Math.min(e,62)))};return(0,E.jsx)(v,{title:`Interactive`,children:(0,E.jsxs)(`div`,{className:`space-y-4`,children:[(0,E.jsxs)(`div`,{className:`text-center`,children:[(0,E.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[`Current Page: `,e,` | Page Size: `,n,` | Total Pages: `,62]}),(0,E.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[`Showing `,h,`-`,g,` of `,o,` results`]})]}),(0,E.jsx)(p,{className:`mx-0 w-fit`,children:(0,E.jsxs)(l,{children:[(0,E.jsx)(i,{children:(0,E.jsx)(s,{onClick:()=>_(1)})}),(0,E.jsx)(i,{children:(0,E.jsx)(m,{onClick:()=>_(e-1)})}),(()=>{let t=[];{t.push((0,E.jsx)(i,{children:(0,E.jsx)(f,{isActive:e===1,onClick:()=>_(1),children:`1`})},1)),e>3&&t.push((0,E.jsx)(i,{children:(0,E.jsx)(d,{})},`ellipsis1`));let n=Math.max(2,e-1),r=Math.min(61,e+1);for(let a=n;a<=r;a++)t.push((0,E.jsx)(i,{children:(0,E.jsx)(f,{isActive:a===e,onClick:()=>_(a),children:a})},a));e<60&&t.push((0,E.jsx)(i,{children:(0,E.jsx)(d,{})},`ellipsis2`)),t.push((0,E.jsx)(i,{children:(0,E.jsx)(f,{isActive:e===62,onClick:()=>_(62),children:62})},62))}return t})(),(0,E.jsx)(i,{children:(0,E.jsx)(a,{onClick:()=>_(e+1)})}),(0,E.jsx)(i,{children:(0,E.jsx)(u,{onClick:()=>_(62)})})]})}),(0,E.jsx)(`div`,{className:`flex justify-center`,children:(0,E.jsx)(c,{pageSize:n,onPageSizeChange:r,pageSizeOptions:[10,20,50,100]})})]})})}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Container with numbers">
        <Pagination className="mx-0 w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StorySection>

      <StorySection title="First">
        <PaginationFirst />
      </StorySection>

      <StorySection title="Last">
        <PaginationLast />
      </StorySection>

      <StorySection title="Previous">
        <PaginationPrevious />
      </StorySection>

      <StorySection title="Next">
        <PaginationNext />
      </StorySection>

      <StorySection title="Ellipsis">
        <PaginationEllipsis />
      </StorySection>

      <StorySection title="Page size">
        <PaginationPageSize pageSize={20} onPageSizeChange={() => {}} className="w-fit" />
      </StorySection>
    </StoryShowcase>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Basic pagination">
        <Pagination className="mx-0 w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>5</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StorySection>

      <StorySection title="With navigation">
        <Pagination className="mx-0 w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive>5</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </StorySection>

      <StorySection title="Complete example">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing 21-40</span>
            <span className="text-sm text-muted-foreground">of 1,234 results</span>
          </div>

          <Pagination className="mx-0 w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationPageSize pageSize={20} onPageSizeChange={() => {}} />
              </PaginationItem>
              <PaginationItem>
                <PaginationFirst />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive>5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>6</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>62</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </StorySection>
    </StoryShowcase>
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentPage, setCurrentPage] = React.useState(5);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pageSize, setPageSize] = React.useState(20);
    const totalPages = 62;
    const totalResults = 1234;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalResults);
    const handlePageChange = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    const renderPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is small
        for (let i = 1; i <= totalPages; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }
      } else {
        // Show first page
        pages.push(<PaginationItem key={1}>
            <PaginationLink isActive={1 === currentPage} onClick={() => handlePageChange(1)}>
              1
            </PaginationLink>
          </PaginationItem>);

        // Show ellipsis if needed
        if (currentPage > 3) {
          pages.push(<PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show current page and neighbors
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) {
          pages.push(<PaginationItem key={i}>
              <PaginationLink isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>);
        }

        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
          pages.push(<PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>);
        }

        // Show last page
        pages.push(<PaginationItem key={totalPages}>
            <PaginationLink isActive={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>);
      }
      return pages;
    };
    return <StorySection title="Interactive">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Current Page: {currentPage} | Page Size: {pageSize} | Total Pages: {totalPages}
            </p>
            <p className="text-sm text-muted-foreground">
              Showing {startItem}-{endItem} of {totalResults} results
            </p>
          </div>

          <Pagination className="mx-0 w-fit">
            <PaginationContent>
              <PaginationItem>
                <PaginationFirst onClick={() => handlePageChange(1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
              </PaginationItem>

              {renderPageNumbers()}

              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLast onClick={() => handlePageChange(totalPages)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="flex justify-center">
            <PaginationPageSize pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={[10, 20, 50, 100]} />
          </div>
        </div>
      </StorySection>;
  }
}`,...j.parameters?.docs?.source}}},M=[`BuildingBlocks`,`CompletePagination`,`InteractivePagination`]})))()}N();export{k as BuildingBlocks,A as CompletePagination,j as InteractivePagination,M as __namedExportsOrder,O as default};