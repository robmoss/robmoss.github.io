---
title: 'Biological modelling and domain-specific languages'
tags:
  - language
  - modelling
---
In "<a href="https://doi.org/10.1371/journal.pcbi.1002521">The Layer-Oriented Approach to Declarative Languages for Biological Modeling</a>", Raikov and De Schutter propose a "layer-oriented" declarative language to map high-level biological concepts to computational representations.
The layer-oriented approach was chosen because "*additional functionality can be transparently added to the language by adding more layers*".

This is an area that has interested me ever since I began my PhD.
Domain-specific languages are a very neat way to express computational problems in a manner that (hopefully) captures the essentials of the problem domain with a minimum of noise.
And declarative languages (e.g., logic languages such as Prolog and <a href="https://www.mercurylang.org/">Mercury</a>, and functional languages such as <a href="https://www.haskell.org/">Haskell</a> and <a href="https://caml.inria.fr/ocaml/">OCaml</a>) are more readily able to express the logic of a problem without (overly) digressing into the algorithmic details of solving the problem.

I suppose my biggest concern with the layer-oriented approach is that an extension to the language is presumably constrained by the existing layers&mdash;a layer can only be added between two existing layers, or at the top or bottom of the entire collection of layers.
Thus, the choice of a core set of layers would set fixed constraints on the concerns and the levels of abstraction that an extension could possibly support.
Of course, if a more traditional Computer Science approach were taken (e.g., a core language and syntactical extensions such as macros), then extensions would necessarily be orthogonal and so constrained by the underlying language.
At least, that's my gut feeling.

In more practical terms, my exposure to the word of ontologies (spanning physiology, biology, chemistry and physics) has given me a much greater appreciation for the scope of *model documentation* and how such documentation can be precisely defined and referenced.
In my opinion, it would be a great development for models to be presented with their parameter values (or sets of parameter values) associated not only with ontological terms (providing definitions that span different notations and presentations), but also with references to the source data, review articles and modelling papers from which the values were derived, fitted or compared against.
This would be a way of publishing a vast amount of the grunt-work that goes into developing and analysing a model, in a concise and machine-readable format.

All in all, I think this is an idea that certainly needs to be given broad consideration in the biological modelling world.
By taking what little Computer Science can offer (beyond farming large-scale computation to experienced programmers and large multi-core systems), hopefully future biological models can more clearly and succinctly communicate not only the "*how*", but also the "*what*" and "*why*".
