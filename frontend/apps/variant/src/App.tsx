// import React from 'react'
import * as React from 'react';

//import { useState } from 'react'
import './App.css'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/base/ui/accordion"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "components/base/ui/table"
import { variantsData } from './variant_data'

export interface AppProps {
  api: string,
}

function App({ api }: AppProps) {
  //const [count, setCount] = useState(0)
  console.log(api);
  return (
    <div className="flex flex-1">
      <aside className="w-1/4 p-4">
        <ul>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Aggregation 1</AccordionTrigger>
                <AccordionContent>
                  <input type="checkbox" id="aggre1" name="aggre1" value="Aggre1" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </li>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Aggregation 2</AccordionTrigger>
                <AccordionContent>
                  <input type="checkbox" id="aggre1" name="aggre1" value="Aggre1" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </li>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Aggregation 3</AccordionTrigger>
                <AccordionContent>
                  <input type="checkbox" id="aggre1" name="aggre1" value="Aggre1" />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

          </li>
        </ul>
      </aside>

      <main className="flex-1 p-4 h-full">
        <h1 className="text-2xl font-bold">Variant</h1>
        <Table>
          <TableCaption>Variant Data</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Variant</TableHead>
              <TableHead>dna Change</TableHead>
              <TableHead className="text-right">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variantsData.variants.map((data) => (
              <TableRow key={data.ensembl_gene_id}>
                <TableCell className="font-medium">{data.symbol}</TableCell>
                <TableCell>{data.name}</TableCell>
                <TableCell className="text-right">{data.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Can be pagination</TableCell>
              <TableCell className="text-right">1 / 1</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

      </main>
    </div >
  )
}

export default App

