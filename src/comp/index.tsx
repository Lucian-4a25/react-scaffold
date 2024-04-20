import React, { SyntheticEvent, useMemo } from "react";


type CompProps = {
  obj: {
    n: number,
  },
  f: (event: SyntheticEvent) => number,
};

export default ({ obj, f }: CompProps) => {
  const cache = useMemo(() => {
    console.log("recaculate cache value");
    return obj.n;
  }, [obj]);

  // console.log("render in sub comp");
  return <>
    <div onClick={(e) => {
      // console.log('click sub comp');
      f(e);
    }}>{obj.n}</div>
  </>
}