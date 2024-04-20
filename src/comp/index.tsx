import React, { SyntheticEvent, useMemo, useState } from "react";


type CompProps = {
  obj: {
    n: number,
  },
  f: (event: SyntheticEvent) => number,
};

export default ({ obj, f }: CompProps) => {
  // const cache = useMemo(() => {
  //   console.log("recaculate cache value");
  //   return obj.n;
  // }, [obj]);

  const [counter, setCounter] = useState(1);

  // console.log("render in sub comp");
  return <>
    <div onClick={(e) => {
      setCounter(counter + 1);
      // console.log('click sub comp');
      // f(e);
    }}>{/* {obj.n} */}"click me"</div>
    <div>{counter}</div>
  </>
}