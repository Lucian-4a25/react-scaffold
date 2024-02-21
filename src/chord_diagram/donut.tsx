import React, { useMemo } from "react";
import * as d3 from "d3";

type DonutProps = {
  inner_radius: number,
  outer_radius: number,
  startAngle: number,
  endAngle: number,
} & DonutStyleAttrs;

type DonutStyleAttrs = {
  stroke?: string,
  strokeWidth?: number,
  fill?: string
  strokeDasharray?: string,
};

type DonutsProps = {
  inner_radius: number,
  outer_radius: number,
  donuts: {
    startAngle: number,
    endAngle: number,
  }[],
} & DonutStyleAttrs;


/**
 * Basic donut render component
 */
export const Donut = ({ inner_radius, outer_radius, startAngle, endAngle, ...style }: DonutProps) => {
  const donut_generator = useMemo(() => {
    return d3.arc<{
      startAngle: number,
      endAngle: number
    }>().innerRadius(inner_radius).outerRadius(outer_radius);
  }, [inner_radius, outer_radius]);

  const donut_path = useMemo(() => {
    return donut_generator({
      startAngle,
      endAngle,
    })
  }, [donut_generator, startAngle, endAngle]);

  return (<path d={donut_path} style={style} />);
};

export const Donuts = ({ inner_radius, outer_radius, donuts, ...style }: DonutsProps) => {
  const donut_generator = useMemo(() => {
    return d3.arc<{
      startAngle: number,
      endAngle: number
    }>().innerRadius(inner_radius).outerRadius(outer_radius);
  }, [inner_radius, outer_radius]);
  const donut_paths = useMemo(() => {
    return donuts.map(({ startAngle, endAngle }) => {
      return donut_generator({
        startAngle,
        endAngle,
      })
    });
  }, [donut_generator, donuts]);

  return <g style={style}>
    {donut_paths.map(path => {
      return <path key={path} d={path}></path>
    })}
  </g>
};