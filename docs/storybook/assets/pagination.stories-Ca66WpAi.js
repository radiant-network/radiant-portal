import{n as e,o as t}from"./rolldown-runtime-C0FnF6B9.js";import{t as n}from"./react-BRh_h4kc.js";import{t as r}from"./jsx-runtime-BdxMnOeJ.js";import{a as i,c as a,d as o,f as s,i as c,l,n as u,o as d,r as f,s as p,u as m}from"./pagination-D4rFOyBs.js";import{D as h,_ as g}from"./api-BYWbfnMs.js";import{r as _,t as v}from"./lib-DQSoxJmH.js";import{i as y,n as b,r as x}from"./story-section-DVTm6cGm.js";import{i as S,n as C,t as w}from"./applications-config-D877dlRU.js";var T,E,D,O,k,A,j,M;function N(){return(N=e((()=>{T=t(n(),1),_(),h(),s(),S(),y(),E=r(),D={variant_entity:{app_id:w.variant_entity},germline_snv_occurrence:{app_id:w.germline_snv_occurrence,aggregations:[],saved_filter_type:g.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:w.germline_cnv_occurrence,aggregations:[],saved_filter_type:g.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:w.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:g.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:w.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:g.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:w.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:g.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:w.admin},portal:{name:``,navigation:{}}},O={title:`Components/Paginations/Pagination`,component:u,decorators:[e=>(0,E.jsx)(v,{children:(0,E.jsx)(C,{config:D,children:(0,E.jsx)(e,{className:`w-full`})})})]},k={render:()=>(0,E.jsxs)(x,{children:[(0,E.jsx)(b,{title:`Container with numbers`,children:(0,E.jsx)(u,{className:`mx-0 w-fit`,children:(0,E.jsxs)(f,{children:[(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`1`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`2`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`3`})})]})})}),(0,E.jsx)(b,{title:`First`,children:(0,E.jsx)(i,{})}),(0,E.jsx)(b,{title:`Last`,children:(0,E.jsx)(p,{})}),(0,E.jsx)(b,{title:`Previous`,children:(0,E.jsx)(o,{})}),(0,E.jsx)(b,{title:`Next`,children:(0,E.jsx)(l,{})}),(0,E.jsx)(b,{title:`Ellipsis`,children:(0,E.jsx)(c,{})}),(0,E.jsx)(b,{title:`Page size`,children:(0,E.jsx)(m,{pageSize:20,onPageSizeChange:()=>{},className:`w-fit`})})]})},A={render:()=>(0,E.jsxs)(x,{children:[(0,E.jsx)(b,{title:`Basic pagination`,children:(0,E.jsx)(u,{className:`mx-0 w-fit`,children:(0,E.jsxs)(f,{children:[(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`1`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{isActive:!0,children:`2`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`3`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`4`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`5`})})]})})}),(0,E.jsx)(b,{title:`With navigation`,children:(0,E.jsx)(u,{className:`mx-0 w-fit`,children:(0,E.jsxs)(f,{children:[(0,E.jsx)(d,{children:(0,E.jsx)(i,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(o,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(c,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`4`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{isActive:!0,children:`5`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`6`})}),(0,E.jsx)(d,{children:(0,E.jsx)(c,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(l,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(p,{})})]})})}),(0,E.jsx)(b,{title:`Complete example`,children:(0,E.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`Showing 21-40`}),(0,E.jsx)(`span`,{className:`text-sm text-muted-foreground`,children:`of 1,234 results`})]}),(0,E.jsx)(u,{className:`mx-0 w-fit`,children:(0,E.jsxs)(f,{children:[(0,E.jsx)(d,{children:(0,E.jsx)(m,{pageSize:20,onPageSizeChange:()=>{}})}),(0,E.jsx)(d,{children:(0,E.jsx)(i,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(o,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`1`})}),(0,E.jsx)(d,{children:(0,E.jsx)(c,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`4`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{isActive:!0,children:`5`})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`6`})}),(0,E.jsx)(d,{children:(0,E.jsx)(c,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(a,{children:`62`})}),(0,E.jsx)(d,{children:(0,E.jsx)(l,{})}),(0,E.jsx)(d,{children:(0,E.jsx)(p,{})})]})})]})})]})},j={render:()=>{let[e,t]=T.useState(5),[n,r]=T.useState(20),s=1234,h=(e-1)*n+1,g=Math.min(e*n,s),_=e=>{t(Math.max(1,Math.min(e,62)))};return(0,E.jsx)(b,{title:`Interactive`,children:(0,E.jsxs)(`div`,{className:`space-y-4`,children:[(0,E.jsxs)(`div`,{className:`text-center`,children:[(0,E.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[`Current Page: `,e,` | Page Size: `,n,` | Total Pages: `,62]}),(0,E.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[`Showing `,h,`-`,g,` of `,s,` results`]})]}),(0,E.jsx)(u,{className:`mx-0 w-fit`,children:(0,E.jsxs)(f,{children:[(0,E.jsx)(d,{children:(0,E.jsx)(i,{onClick:()=>_(1)})}),(0,E.jsx)(d,{children:(0,E.jsx)(o,{onClick:()=>_(e-1)})}),(()=>{let t=[];{t.push((0,E.jsx)(d,{children:(0,E.jsx)(a,{isActive:e===1,onClick:()=>_(1),children:`1`})},1)),e>3&&t.push((0,E.jsx)(d,{children:(0,E.jsx)(c,{})},`ellipsis1`));let n=Math.max(2,e-1),r=Math.min(61,e+1);for(let i=n;i<=r;i++)t.push((0,E.jsx)(d,{children:(0,E.jsx)(a,{isActive:i===e,onClick:()=>_(i),children:i})},i));e<60&&t.push((0,E.jsx)(d,{children:(0,E.jsx)(c,{})},`ellipsis2`)),t.push((0,E.jsx)(d,{children:(0,E.jsx)(a,{isActive:e===62,onClick:()=>_(62),children:62})},62))}return t})(),(0,E.jsx)(d,{children:(0,E.jsx)(l,{onClick:()=>_(e+1)})}),(0,E.jsx)(d,{children:(0,E.jsx)(p,{onClick:()=>_(62)})})]})}),(0,E.jsx)(`div`,{className:`flex justify-center`,children:(0,E.jsx)(m,{pageSize:n,onPageSizeChange:r,pageSizeOptions:[10,20,50,100]})})]})})}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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