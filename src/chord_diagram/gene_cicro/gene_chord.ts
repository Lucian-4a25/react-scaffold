interface ChordGroup {
  startAngle: number,
  endAngle: number,
  index: number
}

type ChordGroups = ChordGroup[];

interface Ribbon {
  source: ChordSubgroup,
  target: ChordSubgroup
}

type Ribbons = Ribbon[];

interface ChordSubgroup {
  startAngle: number,
  endAngle: number,
  index: number
}

type GeneChords = {
  rowGroups: ChordGroups,
  colGroups: ChordGroups,
  ribbons: Ribbons
};

const PI = Math.PI;

type GeneOpt = {
  // row names of raw data
  rows: Array<string>,
  // col names of raw data
  cols: Array<string>,
  // the size of pad space between two donuts
  pad?: number
  // TODO(me): the order is a little wired...
  reverseSubgroupVisit?: boolean,
  // maybe support more function, like sort ect.
}


// TODO(me): a more robust gene chords version
/**
 * Generate graph data from raw gene data
 * @param geneMatrix Raw matrix gene data
 * @param opt options to generate graph data
 * @returns GeneChords to construct shape
 */
export function generate_gene_chords(geneMatrix: Array<Array<number>>, { rows, cols, pad = 0.05, reverseSubgroupVisit: reverseSubgroup = false}: GeneOpt) : GeneChords  {
  const rowLen = geneMatrix.length;
  if (rowLen == 0) {
    return {
      rowGroups: [],
      colGroups: [],
      ribbons: [],
    }
  }
  const colLen = geneMatrix[0].length;
  if (rowLen != rows.length) {
    console.error("rows length does not matched with gene matrix");
    throw new Error("rows length does not matched with gene matrix");
  }
  if (colLen != cols.length) {
    console.error("cols length does not matched with gene matrix");
    throw new Error("cols length does not matched with gene matrix");
  }

  if (pad < 0 /* || Math.max(rowLen, colLen) * pad > PI */) {
    console.error("invalid pad value");
    throw new Error("invalid pad value");
  }

  // calulate sum of every row group
  const rowGroupSum = new Array(rowLen).fill(0, 0);
  const colGroupSum = new Array(colLen).fill(0, 0);
  let globalSum = 0;
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      const val = geneMatrix[i][j];
      rowGroupSum[i] += val;
      colGroupSum[j] += val;
      globalSum  += val;
    }
  }

  // calucalte the angle of each group
  // For rows, final range is PI/2 ~ PI * 3/2，but d3-ribbon need to minus PI / 2，so
  // our range is from PI ~ 2 * PI
  // For cols, final range is -PI/2 ~ PI/2, same reason,
  // our range is from 0 ~ PI
  
  // d3-ribbon will make pad avaible for us, we only need to caclulate from start value
  let accum = PI;
  const rowAngleSum = PI - rowLen * pad;
  const rowGroups: ChordGroups = [];
  const ribbons: Ribbons = [];
  for (let i = 0; i < rowLen; i++) {
    const rowS = rowGroupSum[i];
    const range = (rowS / globalSum) * rowAngleSum;
    rowGroups.push({
      startAngle: accum,
      endAngle: accum + range,
      index: i
    });
    for (let j = 0; j < colLen; j++) {
      const colIdx = reverseSubgroup ? (colLen - j - 1) : j;
      const colRange = (geneMatrix[i][colIdx] / rowS) * range;
      ribbons.push({
        source: {
          startAngle: accum,
          endAngle: accum += colRange,
          index: i
        },
        // how to figure out the value of target?
        // TODO(me): maybe there is better to handle this?
        target: {
          startAngle: 0,
          endAngle: 0,
          index: rowLen + colIdx
        }
      });
    }
    accum += pad;
  }

  // reset init value
  accum = 0;
  const colAngleSum = PI - colLen * pad;
  const colGroups: ChordGroups = [];
  for (let j = 0; j < colLen; j++) {
    const colS = colGroupSum[j];
    const range = (colS / globalSum) * colAngleSum;
    colGroups.push({
      startAngle: accum,
      endAngle: accum + range,
      index: rowLen + j,
    });
    for (let i = 0; i < rowLen; i++) {
      const rowIdx = reverseSubgroup ? (rowLen - i - 1 ) : i;
      const colRange = (geneMatrix[rowIdx][j] / colS) * range;
      ribbons[rowIdx * colLen + j].target = {
        startAngle: accum,
        endAngle: accum += colRange,
        index: rowLen + j,
      }
    }
    accum += pad;
  }
  
  return {
    ribbons,
    colGroups,
    rowGroups
  }
}