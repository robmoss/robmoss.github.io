+++
title = "Models"

[extra]
nav_id = "Models"
maths = true
+++

# Models

<div class="blurb">
  Model source code, documentation, and interactive plots.
  All code presented here is made available under permissive licenses.
  Please check each respository for details.

  <nav>
    <a href="https://bitbucket.org/robmoss/" title="Bitbucket profile"><img src="/images/logo-bb.png"></a>
    <a href="http://github.com/robmoss/" title="Github profile"><img src="/images/logo-gh.png"></a>
    <a href="https://gitlab.unimelb.edu.au/rgmoss/" title="Gitlab profile"><img src="/images/logo-gl.png"></a>
  </nav>
  <!-- NOTE: the following is HTML, not Markdown, to avoid it becoming a paragraph and having undesired vertical space above and below. -->
  I am currently working on <a href="https://git-is-my-lab-book.net/">Git is my lab book</a>, a collection of materials to support early- and mid-career researchers who want to develop their computing skills and make effective use of available tools and infrastructure.
</div>

## A User's Guide to Infectious Disease Modelling

The PRISM<sup>2</sup> CRE published [A User's Guide to Infectious Disease Modelling](https://prism.edu.au/publications/prism-modeling-guideline/) in 2016.
This provides an introduction to interpreting the results of mathematical modelling studies in epidemiology.
The primary target audience is policy makers who want to capitalise on these kinds of studies to inform immunisation policy and the control of vaccine preventable diseases.

## Interactive epidemic models

- This [interactive SEIR demo](https://robmoss.github.io/seir-demo/) illustrates how epidemiological parameters, such as the basic reproduction number, affect the size and duration of an epidemic.

- This [interactive SIR demo](https://robmoss.github.io/sir-demo/) illustrates how outbreaks in small populations are driven by stochastic events.
  It is designed for use in a talk or presentation, where the model population size can be set to the number of people in the audience \\(N\\), each of whom should be given a unique number from \\(\{1 \dots N\}\\).
  A [simplified interface](https://robmoss.github.io/sir-demo/simple.html) is also provided.

## Renal physiology models

Before I came to infectious diseases epidemiology, I modelled how kidneys regulate water and salt balance.

- I developed a whole-kidney model that predicted steady-state salt and water excretion rates in response to renal pressure and circulating hormone levels, as illustrated in these [interactive plots](http://web.archive.org/web/20201212124457/https://robmoss.github.io/model/rfc/).

- I added an explicit glomerular capillary bed to an existing model of afferent arteriole autoregulation, in order to predict the [glomerular filtration rate](@/models/aa-autoreg/index.md).

## Making models accessible and useful

As mathematical models grow larger and more complex they become harder to analyse and understand.
Once a model is sufficiently complex, the likelihood of someone being able to replicate its behaviour based on the model description in a publication becomes negligible.
Making the model source code available is necessary **but insufficient** to render a model comprehensible.
This has led to a proliferation of [semantic](https://sed-ml.org/) [markup](https://sbml.org/) [languages](https://www.cellml.org/) and [detailed](https://co.mbine.org/standards/miriam) [guidelines](https://co.mbine.org/standards/miase) for describing models and *in silico* experiments.

The importance of clear, concise and [helpful](https://diataxis.fr/) [documentation](https://web.archive.org/web/20200606231144/https://documentation.divio.com/) is [paramount](https://web.archive.org/web/20200618075304/https://jacobian.org/tags/great-documentation/) to ensuring a published model and results can be **replicated independently** of the original model implementation.
It can be hard to write [good prose](http://web.archive.org/web/20170614175347/http://www.americanscientist.org/issues/id.877,y.0,no.,content.true,page.1,css.print/issue.aspx) and to *teach* the user rather than simply [telling them](http://stevelosh.com/blog/2013/09/teach-dont-tell/) what to do.
Explanations can be [confusing and difficult to understand](https://web.archive.org/web/20210819195037/https://jvns.ca/blog/confusing-explanations/).
That's why it's important a have good editor; only edit the documentation [yourself](http://web.archive.org/web/20140616001452/http://lifehacker.com/5968996/how-to-edit-your-own-writing/all) as a last resort.
Good documentation means that your model/software is [learnable](http://brikis98.blogspot.com.tr/2014/05/you-are-what-you-document.html).
