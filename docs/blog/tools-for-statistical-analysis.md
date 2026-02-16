---
title: 'Tools for statistical analysis'
tags:
  - statistics
---
For me, the choice of platform came down to <a href="https://www.r-project.org/">R</a> or <a href="https://www.scipy.org/">SciPy</a>.
I am aware of <a href="https://sagemath.org/">Sage</a>, but it seemed like such a huge and sprawling collection that I found it a little off-putting (and I suspect it greatly exceeds my needs).
In the end, I chose <strong>R</strong> because I had (very limited) experience with it, and I figured I'd enjoy using a statistical language more than a general-purpose language for this kind of work.
That's not to say I didn't get thoroughly confused at times, of course.
I found the following R packages and documentation very useful:

<ul>

<li> The <a href="https://cran.r-project.org/manuals.html">R manuals</a> and <a href="https://cran.r-project.org/faqs.html">FAQs</a> are a good place to start.
</li>

<li> <a href="https://had.co.nz/ggplot2/">ggplot2</a> is a very flexible (and pretty!)
graphing package.
</li>

<li> <a href="https://rocr.bioinf.mpi-sb.mpg.de/">ROCR</a> is a visualisation package for evaluating classifiers (e.g., <acronym title="generalized linear model">GLM</acronym>s).
</li>

<li> Writing R Extensions (in <a href="https://cran.r-project.org/doc/manuals/R-exts.html">html</a> and <a href="https://cran.r-project.org/doc/manuals/R-exts.pdf">pdf</a>) describes how to write your own packages (such as my <a href="https://github.com/rma/rma.g92">clumsy attempt</a> as part of a sensitivity analysis of the Guyton model).
</li>

<li> If you're having difficulties, the <a href="https://www.burns- stat.com/pages/Tutor/R_inferno.pdf">R Inferno</a> may be useful (from the preface: <em>"If you are using R and you think you're in hell, this is a map for you"</em>).
</li>

<li> The R community has recently started a <a href="https://en.wikibooks.org/wiki/R_Programming">wiki book</a>, whose sections are currently in varying stages of completeness.
</li>

</ul>

In addition, there are several other tools that can be very handy at certain times:

<ul>

<li> <a href="https://github.com/pn2200/g3data">g3data</a> is an <strong>excellent</strong> tool for extracting data points from published graphs.
</li>

<li> <a href="https://ggobi.org/">GGobi</a> is a visualisation tool for exploring high-dimensional data.
</li>

<li> <a href="https://www.theusrus.de/Mondrian/">Mondrian</a> is an interactive data visualisation tool.
</li>

</ul>

But despite all the time I've spent with R and other statistical tools, I'm still very much aware that I am a complete novice when it comes to statistics.
I really need to start reading some good foundational texts, although I always ended up digging through the proofs and derivations because I'm rarely comfortable unless I'm convinced I understand the <em>how</em> and the <em>why</em>.
