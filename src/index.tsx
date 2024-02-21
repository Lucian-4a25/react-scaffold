import React from 'react';
import { createRoot } from 'react-dom/client';
import ChordDiagram, { GeneChordDiagram } from './chord_diagram/index';
import './index.css';

const domNode = document.getElementById('app');
const root = createRoot(domNode);

root.render(<div>
  {/* <ChordDiagram width={500} height={500} pad_radius={5} chord_inner_radius={230} chord_outer_radius={240} pad_angle={0.05} matrix={[[11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907]]} /> */}
  <GeneChordDiagram width={800} height={800} pad_radius={5} chord_inner_radius={230} chord_outer_radius={240} pad_angle={0.05}
    gene_matrix=
    {[[87332.00, 87643.00, 84969.00, 87234.00],
    [75643.00, 79184.00, 77444.00, 76810.00],
    [87332.00, 87643.00, 84969.00, 87234.00],
    [75643.00, 79184.00, 77444.00, 76810.00],
    [87332.00, 87643.00, 84969.00, 87234.00]]}
    cols={["Con1", "Con2", "Treat1", "Treat2"]}
    rows={["Gene1", "Gene2", "Gene3", "Gene4", "Gene5"]}
    dashed_line_radius={280}
    donut_inner_radius={330}
    donut_outer_radius={350} />
</div>);
