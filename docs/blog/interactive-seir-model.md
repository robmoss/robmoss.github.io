---
title: 'Interactive SEIR model'
tags:
  - modelling
  - influenza
  - visualisation
---
Originally prepared as a simple demo for 2016 Open Day, this
[interactive model](https://robmoss.github.io/seir-demo/)
allows the viewer to explore how a variety of epidemiological parameters
affect the size and duration of an infectious disease epidemic, such as:

* The basic reproduction number \\(\left(R_0\right)\\), the average number of
  *persons that a single infectious individual will infect* in an entirely
  susceptible population;
* The delay between being *infected* and becoming *infectious*
  \\(\left(\frac{1}{\alpha}\right)\\);
* The duration for which an individual is *infectious*
  \\(\left(\frac{1}{\gamma}\right)\\);
* The duration for which an individual is *protected from re-infection*
  \\(\left(\frac{1}{\sigma}\right)\\);
* The degree to which individuals *mix inhomogeneously* \\(\left(\eta\right)\\);
  and
* The proportion of the population \\(S(0)\\) that is *initially susceptible*.

This is a **deterministic SEIR meta-population model**, where each individual
in the population is either *susceptible* to infection, has been *exposed* to
the pathogen, has progressed to being *infectious*, or has *recovered* from
infection and has (temporary or permanent) protection from reinfection.

The source code is
[available](https://bitbucket.org/robmoss/seir-demo-javascript) under the BSD
3-Clause license.
