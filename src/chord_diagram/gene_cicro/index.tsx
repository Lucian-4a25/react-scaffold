// differenct from chord diagram:
// 1. the row and column belong to differenct half circle
// 2. the outer are composed of another big donut and another dashed arc
import React, { useMemo } from "react";
import { generate_gene_chords } from './gene_chord';
import { Donuts } from '../donut';
import { Ribbon } from "../ribbon";
import * as d3 from "d3";

type GeneCicroProps = {
  // the matrix is a little different from chord diagram, 
  // need to normalize to fit into generic chord diagram
  cols: Array<string>,
  rows: Array<string>,
  gene_matrix: Array<Array<number>>,
  width: number,
  height: number,
  chord_inner_radius: number,
  chord_outer_radius: number,
  pad_angle: number,
  pad_radius: number,
  // specify the raidus of dashed line circle
  dashed_line_radius: number,
  // specify the raidus of outer most donuts
  donut_inner_radius: number,
  donut_outer_radius: number
};

const colors = ["#9E0142", "#D53E4F", "#F46D43", "#FDAE61", "#FEE08B", "#ABDDA4", "#66C2A5", "#3288BD", "#5E4FA2"];

export const GeneChordDiagram = ({ gene_matrix, width, height, chord_inner_radius, chord_outer_radius, pad_angle, pad_radius, cols, rows, dashed_line_radius, donut_outer_radius, donut_inner_radius }: GeneCicroProps) => {
  const data = useMemo(() => {
    return generate_gene_chords(gene_matrix, { pad: pad_angle, rows, cols, reverseSubgroupVisit: true });
  }, [gene_matrix]);
  const {
    ribbons,
    rowGroups,
    colGroups,
  } = data;
  // console.log("generate data: ", data);

  // draw dashed circle
  const dashedPaths = useMemo(() => {
    const rowPaths = rowGroups.map(({ startAngle, endAngle }) => {
      const ctx = d3.path();
      ctx.arc(0, 0, dashed_line_radius, startAngle - Math.PI / 2, endAngle - Math.PI / 2);
      return ctx.toString();
    });
    const colPaths = colGroups.map(({ startAngle, endAngle }) => {
      const ctx = d3.path();
      ctx.arc(0, 0, dashed_line_radius, startAngle - Math.PI / 2, endAngle - Math.PI / 2);
      return ctx.toString();
    });
    return rowPaths.concat(colPaths);
  }, [rowGroups, colGroups, dashed_line_radius]);

  // draw outermoust circle
  const donutGenerator = useMemo(() => {
    return d3.arc<{ startAngle: number, endAngle: number }>().innerRadius(donut_inner_radius).outerRadius(donut_outer_radius);
  }, [donut_inner_radius, donut_outer_radius]);
  const outerDonutPaths = useMemo(() => {
    const rowDonuts = rowGroups.map((row) => {
      return donutGenerator(row);
    });
    const colDonuts = colGroups.map((col) => {
      return donutGenerator(col);
    });
    const donutsPaths = rowDonuts.concat(colDonuts);

    return donutsPaths;
  }, [rowGroups, colGroups, donutGenerator]);
  // draw outermost legend
  const donutLegends = useMemo(() => {
    const rowLegends = rowGroups.map((row, i) => {
      const midAngle = (row.endAngle + row.startAngle) / 2 - Math.PI / 2;
      const radius = (donut_inner_radius + donut_outer_radius) / 2;
      // console.log("midAngle: ", Number(midAngle.toFixed(3)))
      return {
        x: radius * Math.cos(midAngle),
        y: radius * Math.sin(midAngle),
        angle: Number((midAngle - Math.PI * 3 / 2).toFixed(3)),
        text: rows[i]
      }
    });
    const colLegends = colGroups.map((col, j) => {
      const midAngle = (col.endAngle + col.startAngle) / 2 - Math.PI / 2;
      const radius = (donut_inner_radius + donut_outer_radius) / 2;
      return {
        x: radius * Math.cos(midAngle),
        y: radius * Math.sin(midAngle),
        angle: Number((midAngle - Math.PI * 3 / 2).toFixed(3)),
        text: cols[j]
      }
    });

    return rowLegends.concat(colLegends);
  }, [rowGroups]);

  return (<svg width={width} height={height} viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}>
    {
      outerDonutPaths.map(path => {
        return <path d={path} stroke='black' fill="grey"></path>
      })
    }
    {
      dashedPaths.map((path) => {
        return <path d={path} stroke='black' fill="none" strokeDasharray="3"></path>;
      })
    }
    <Donuts donuts={rowGroups} inner_radius={chord_inner_radius} outer_radius={chord_outer_radius} stroke='black' fill="grey" />
    <Donuts donuts={colGroups} inner_radius={chord_inner_radius} outer_radius={chord_outer_radius} stroke='black' fill="grey" />
    {
      ribbons.map((ribbon, i) => {
        const color = colors[Math.floor((i / cols.length)) % colors.length];
        return (<Ribbon ribbon={ribbon} radius={chord_inner_radius - pad_radius} fill={color} stroke='black' strokeWidth={1} ></Ribbon>);
      })
    }
    {/* {
      fontCenters.map(point => {
        return <circle cx={point.x} cy={point.y} r="3"></circle>
      })
    } */}
    {
      donutLegends.map(point => {
        return <text textAnchor="middle" alignment-baseline="middle" fontSize={15} style={{ transform: ` translate(${point.x}px,${point.y}px) rotate(${point.angle}rad) ` }}>{point.text}</text>
      })
    }
    {/*  */}

  </svg>);
}