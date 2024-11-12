+++
title = "R Markdown: hide code blocks"
[taxonomies]
category = ['model']
tag = ['language']
+++

In writing an R Markdown document to describe a within-host malaria model that I'm working on, I have focused on the HTML version of the document and made use of [code folding](https://bookdown.org/yihui/rmarkdown-cookbook/fold-show.html) to hide several code blocks by default.

The PDF version of the document includes the complete listing of each code block, but I instead wanted to remove the folded code blocks from the PDF version.
And while it took me a long time to find a solution, the solution itself is quite simple.

For each folded code block:

~~~markdown
```{r block_name, class.source = 'fold-hide'}
# Code goes here ...
```
~~~

use the [`echo`](https://bookdown.org/yihui/rmarkdown-cookbook/hide-one.html) option and [`is_latex_output()`](https://bookdown.org/yihui/rmarkdown-cookbook/latex-html.html) to hide the code block when exporting to PDF:

~~~markdown
```{r block_name, class.source = 'fold-hide', echo = ! knitr::is_latex_output()}
# Code goes here ...
```
~~~
