<script language="javascript">
function hide_noscript() {
  var to_hide = document.getElementsByClassName("hidejs");
  var to_show = document.getElementsByClassName("showjs");
  for (var i = 0; i < to_hide.length; i++) {
    to_hide[i].style["display"] = "none";
  }
  for (var i = 0; i < to_show.length; i++) {
    to_show[i].style["display"] = "block";
  }
}
</script>

# Acute Renal Function Curves

The following figures plot model simulation results against acute renal function curves obtained from experimental studies in the rat.
This work was done in collaboration with S.&nbsp;Randall Thomas and has been [published](https://doi.org/10.1152/ajprenal.00089.2013) by *AJP Renal*.

The model source code is available [here](https://hub.darcs.net/rgm/kidney_2013-10-09).
This repository includes parameter sets and solutions for every simulation presented in the [accompanying manuscript](https://doi.org/10.1152/ajprenal.00089.2013), as well as scripts that reproduce the manuscript figures.

<p class="showjs">
<strong>Instructions:</strong> Table 1 contains links to each publication's PubMed page, and allows the user to toggle the visibility of each experimental study on the plots below.
</p>

<p class="showjs">
Hover the cursor over a line on either plot to identify the source of the data series; clicking on a line will keep that line selected, clicking on the tooltip will toggle whether the line will remain selected.
</p>

<p class="hidejs">
<strong>Please enable javascript to view the plots.</strong>
</p>

<div class="rfc_plot">
  <span id="jna" class="plot"></span><br/>
  <strong>Figure 1:</strong> Regulation of sodium excretion.
</div>

<div class="rfc_plot">
  <span id="jv" class="plot"></span><br/>
  <strong>Figure 2:</strong> Regulation of water excretion.
</div>

<!-- Generate the plots. -->
<script type="text/javascript" src="https://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<!--<script type="text/javascript" src="./plot.js" charset="utf-8"></script> -->
