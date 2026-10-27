---
title: 'Tools for statistical analysis'
date: 2011-09-21
tags:
  - statistics
categories:
  - Statistics
---

For me, the choice of platform came down to [R](https://www.r-project.org/) or [SciPy](https://www.scipy.org/).
I am aware of [Sage](https://sagemath.org/), but it seemed like such a huge and sprawling collection that I found it a little off-putting (and I suspect it greatly exceeds my needs).
In the end, I chose **R** because I had (very limited) experience with it, and I figured I'd enjoy using a statistical language more than a general-purpose language for this kind of work.
That's not to say I didn't get thoroughly confused at times, of course.

<!-- more -->

I found the following R packages and documentation very useful:

- The [R manuals](https://cran.r-project.org/manuals.html) and [FAQs](https://cran.r-project.org/faqs.html) are a good place to start.

- [ggplot2](https://had.co.nz/ggplot2/) is a very flexible (and pretty!)
graphing package.

- [ROCR](https://rocr.bioinf.mpi-sb.mpg.de/) is a visualisation package for evaluating classifiers (e.g., [GLMs](https://en.wikipedia.org/wiki/Generalized_linear_model "Generalized Linear Models")).

- Writing R Extensions (in [html](https://cran.r-project.org/doc/manuals/R-exts.html) and [pdf](https://cran.r-project.org/doc/manuals/R-exts.pdf)) describes how to write your own packages (such as my [clumsy attempt](https://github.com/rma/rma.g92) as part of a sensitivity analysis of the Guyton model).

- If you're having difficulties, the [R Inferno](https://www.burns- stat.com/pages/Tutor/R_inferno.pdf) may be useful (from the preface: *"If you are using R and you think you're in hell, this is a map for you"*).

- The R community has recently started a [wiki book](https://en.wikibooks.org/wiki/R_Programming), whose sections are currently in varying stages of completeness.

In addition, there are several other tools that can be very handy at certain times:

- [g3data](https://github.com/pn2200/g3data) is an **excellent** tool for extracting data points from published graphs.

- [GGobi](https://ggobi.org/) is a visualisation tool for exploring high-dimensional data.

- [Mondrian](https://www.theusrus.de/Mondrian/) is an interactive data visualisation tool.

But despite all the time I've spent with R and other statistical tools, I'm still very much aware that I am a complete novice when it comes to statistics.
I really need to start reading some good foundational texts, although I always ended up digging through the proofs and derivations because I'm rarely comfortable unless I'm convinced I understand the *how* and the *why*.
