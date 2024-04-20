import React, { useState } from 'react';
import './index.css';
import Comp from '../comp/index';
import Canv from '../canvas/index'

type TestProps = {
  text: string,
  obj: {
    n: number
  }
}

export default ({ obj }: TestProps) => {
  // const dumyFn = useCallback(() => {
  //   console.log("use callback called");
  //   return function () {

  //   };
  // }, [obj]);

  // console.log("dummyFn: ", dumyFn);
  const [counter, setCounter] = useState(3);
  const [obj2, setObj] = useState({ n: 2 });
  console.log("render in parent, with obj: ", obj);

  return (<>
    <div onClick={(e) => {
      console.log(e);
      // setCounter(counter * 2);
      obj = {
        n: obj.n * 10,
      };
      console.log("obj: ", obj);
      if (obj.n > 100000) {
        setObj({
          n: obj2.n + 1,
        });
      }
    }}>{obj.n / 10}, {counter}</div>
    <Canv></Canv>
    <Comp f={(e) => {
      console.log("click comp");
      return 1;
    }} obj={obj}></Comp>
  </>);
};