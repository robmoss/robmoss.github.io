---
title: 'Compartmental models in Rust'
tags:
  - language
  - modelling
---
I've been learning a bit of [Rust](https://www.rust-lang.org/) in the past few
weeks, mostly by writing some basic SIR-type models (both as ODE systems, and
as continuous-time and discrete-time Markov chains).
It takes most (maybe all) of the things that I like about
[OCaml](https://ocaml.org/) and adds more great features and safety guarantees,
thanks to its *ownership* model and *lifetimes*.
It's also very fast (no garbage collector, zero-cost abstractions) and has
fantastic [tooling](https://doc.crates.io/guide.html), although compilation
times can be very long, and package ("crate") availability can be very
hit-or-miss.
I've enjoyed it enough that I'm looking forward to writing more Rust code in
the future.
Although I've no plans to rewrite [pypfilt](https://pypfilt.readthedocs.io/) or
[epifx](https://epifx.readthedocs.io/) in Rust any time soon!
