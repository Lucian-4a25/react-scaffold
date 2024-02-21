import './index.css';
import React, { useMemo } from 'react';
import { Ribbons } from './ribbon';
import * as d3 from "d3";
import { Donuts } from './donut';
export * from "./gene_cicro/index";

type ChordDiagramProps = {
  matrix: Array<Array<number>>,
  width: number,
  height: number,
  chord_inner_radius: number,
  chord_outer_radius: number,
  pad_angle: number,
  pad_radius?: number,
};

/**
 * generic chord diagram implementation
 */
export default ({ chord_inner_radius: donut_inner_radius, chord_outer_radius: donut_outer_radius, pad_angle, pad_radius = 0, matrix, width, height, }: ChordDiagramProps) => {
  // generate input data
  const chord_data = useMemo(() => {
    return d3.chord()
      .padAngle(pad_angle)
      .sortSubgroups(d3.descending)
      (matrix);
  }, [pad_angle, matrix]);
  console.log("chords info:", chord_data);
  // console.log("donut_paths: ", donut_paths);
  // groups info are used to draw donut chart
  const groups = chord_data.groups;

  // ribbons info are used to draw relation line
  const ribbons = chord_data.slice(0);

  return (
    <svg width={width} height={height} >
      <g style={{ transform: `translate(${width / 2}px,${height / 2}px)` }}>
        <Ribbons ribbons={ribbons} radius={donut_inner_radius - pad_radius} stroke='black' strokeWidth={1} fill="rgb(105, 179, 162)" />
        <Donuts inner_radius={donut_inner_radius} outer_radius={donut_outer_radius} donuts={groups} stroke='black' fill="grey" />
      </g>
    </svg>);
};