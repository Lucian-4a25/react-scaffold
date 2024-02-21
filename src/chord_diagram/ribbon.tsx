import React, { useMemo } from "react";
import * as d3 from "d3";
// import { Ribbon } from "d3";

type RibbonSubgroup = {
  startAngle: number,
  endAngle: number
};

type Ribbon = {
  source: RibbonSubgroup,
  target: RibbonSubgroup,
};

type RibbonProps = {
  radius: number,
  ribbon: Ribbon,
} & RibbonStyleAttrs;

type RibbonsProps = {
  ribbons: Ribbon[],
  radius: number,
} & RibbonStyleAttrs;

// style attrs
type RibbonStyleAttrs = {
  stroke?: string,
  strokeWidth?: number,
  fill?: string
  strokeDasharray?: string,
}

/**
 * Basic ribbon item render
 * @param ribbon item prop 
 */
export const Ribbon = ({ radius, ribbon, ...style }: RibbonProps) => {
  const ribbon_generator = useMemo(() => {
    return d3.ribbon<Ribbon, RibbonSubgroup>().radius(radius);
  }, [radius]);
  const ribbon_path = useMemo(() => {
    const path = ribbon_generator(ribbon);
    if (typeof path === "undefined") {
      return "";
    }
    return path;

  }, [ribbon_generator, ribbon]);

  return (
    <path d={ribbon_path} style={style} ></path>
  );
};

/**
 * A group of ribbons to render
 */
export const Ribbons = ({ ribbons, radius, ...ribbon_style }: RibbonsProps) => {
  const ribbon_generator = useMemo(() => {
    return d3.ribbon<Ribbon, RibbonSubgroup>().radius(radius);
  }, [radius]);

  // generate ribbon path data
  const ribbon_paths = useMemo(() => {
    const paths = ribbons.map(ribbon => {
      const path = ribbon_generator(ribbon);
      if (typeof path === "undefined") {
        return "";
      }
      return path;
    });
    return paths;
  }, [ribbon_generator, ribbons]);

  return <g style={ribbon_style}>
    {ribbon_paths.map(path => {
      return <path key={path} d={path} ></path>
    })}
  </g>;
}