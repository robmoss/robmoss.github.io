#!/bin/sh
#
# Draw flow networks for two orientations of the X2 tile.
#
# Nodes are aligned based on https://stackoverflow.com/a/62389801.
#

OUT_FILE="../../static/images/18xx-montreal-x2-flow-networks.png"
dot -Tpng -Gdpi=72 > "${OUT_FILE}" <<EOF

digraph {

  # Columns
  subgraph {
    in_a [label="in", group=a1];
    invis_a1 [style=invis, label="in", group=a1];
  }
  subgraph {
    QLS_a [label="QLS", group=a2];
    LPR_a [label="LPR", group=a2];
  }
  subgraph {
    RC1_a [label="#1", group=a3];
    RC3_a [label="#3", group=a3];
  }
  subgraph {
    invis_a2 [style=invis, label="out", group=a4];
    out_a [label="out", group=a4];
  }

  # Rows
  subgraph {
    rank = same;
    in_a;
    QLS_a;
    RC1_a;
    invis_a2;
  }
  subgraph {
    rank = same;
    invis_a1;
    LPR_a;
    RC3_a;
    out_a;
  }

  # Edges
  in_a -> invis_a1 [style=invis];
  invis_a1 -> LPR_a [style=invis];
  in_a -> QLS_a [label="1"];
  in_a -> LPR_a [label="1"];
  QLS_a -> RC1_a [label="1"];
  LPR_a -> RC3_a [label="1"];
  RC1_a -> out_a [label="1"];
  RC3_a -> out_a [label="1"];
  RC1_a -> invis_a2 [style=invis];
  invis_a2 -> out_a [style=invis];

  # Columns
  subgraph {
    in_b [label="in", group=b1];
    invis_b1 [style=invis, label="in", group=b1];
  }
  subgraph {
    QLS_b [label="QLS", group=b2];
    LPR_b [label="LPR", group=b2];
  }
  subgraph {
    RC1_b [style=invis, label="#1", group=b3];
    RC3_b [label="#3", group=b3];
  }
  subgraph {
    invis_b2 [style=invis, label="out", group=b4];
    out_b [label="out", group=b4];
  }

  # Rows
  subgraph {
    rank = same;
    in_b;
    QLS_b;
    RC1_b;
    invis_b2;
  }
  subgraph {
    rank = same;
    invis_b1;
    LPR_b;
    RC3_b;
    out_b;
  }

  # Edges
  in_b -> invis_b1 [style=invis];
  invis_b1 -> LPR_b [style=invis];
  in_b -> QLS_b [label="1"];
  in_b -> LPR_b [label="1"];
  QLS_b -> RC3_b [label="1"];
  LPR_b -> RC3_b [label="1"];
  RC1_b -> out_b [style=invis];
  RC3_b -> out_b [label="1"];
  RC1_b -> invis_b2 [style=invis];
  invis_b2 -> out_b [style=invis];
}

EOF
