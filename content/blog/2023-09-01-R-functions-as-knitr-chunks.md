+++
title = "R functions as knitr chunks"
[taxonomies]
category = ['model']
tag = ['language']
+++

In writing an R Markdown document to describe a within-host malaria model that I'm working on, I discovered that `knitr::read_chunk()` only accepts fixed line numbers and `# ---- some-label` marker comments.
So I've implemented `read_all_function_chunks()`, below, which extracts **each top-level function** as a separate chunk, and supports including roxygen documentation comments.

<!-- more -->

Note that it identifies top-level functions with simple regular expressions, but as long as the code is well-formatted this works fine.

You can use this to display the code for each function in an R file:

~~~markdown
```{r read_utils, cache = FALSE, include = FALSE}
read_all_function_chunks("./R/utils.R")
```

```{r utils-function-name-1}
```

```{r utils-function-name-2}
```
~~~

In this example, `./R/utils.R` should define the functions `name_1()` and `name_2()`.
Note that underscores are replaced by dashes in the chunk names, so that they will work properly when exporting to PDF via LaTeX.

```R
read_all_function_chunks <- function(path, prefix = NULL, roxygen = TRUE) {
  # Look for functions defined at the start of a line.
  func_rexp <- "^([a-zA-Z0-9_\\.]+) <- function\\("

  # Find all matching function definitions.
  lines <- xfun::read_utf8(path)
  matches <- regmatches(lines, regexec(func_rexp, lines))

  # Extract the name of each function.
  names <- as.character(na.exclude(sapply(matches, `[`, 2)))
  if (length(names) != length(unique(names))) {
    stop("Duplicate function names detected")
  }

  # Read each function as a separate chunk.
  read_function_chunks(path, names, prefix = prefix, roxygen = roxygen)
}

read_function_chunks <- function(path, names, prefix = NULL, roxygen = TRUE) {
  # Identify the start and end line of each function chunk.
  chunks <- find_functions(path, names, prefix = prefix, roxygen = roxygen)
  # Pass these details on to knitr.
  knitr::read_chunk(path, from = chunks$from, to = chunks$to,
                    labels = chunks$labels)

}

find_functions <- function(path, names, prefix = NULL, roxygen = TRUE) {
  lines <- xfun::read_utf8(path)

  # Find the line on which each function starts.
  start_rexps <- paste0("^", names, " <- function")
  starts <- sapply(start_rexps, function(rexp) grep(rexp, lines))
  if (length(starts) != length(names)) {
    stop("Found ", length(starts), " matches for ", length(names),
         " functions")
  }
  starts <- as.numeric(starts)

  # Optionally include roxygen comments above each function.
  if (roxygen) {
    find_roxygen_start <- function(fn_line) {
      ix <- fn_line - 1
      while (ix > 0 && grepl("^#'", lines[ix])) {
        ix <- ix - 1
      }
      ix + 1
    }
    starts <- sapply(starts, find_roxygen_start)
  }

  # Find the line on which each function ends.
  end_rexp <- "^}$"
  all_ends <- grep(end_rexp, lines)
  ends <- sapply(starts, function(start) min(all_ends[all_ends > start]))
  if (length(ends) != length(names)) {
    stop("Found ", length(starts), " ends for ", length(names),
         " functions")
  }
  if (any(ends[-length(ends)] >= starts[-1])) {
    stop("Found one or more over-lapping functions")
  }

  # Create a label for each function chunk.
  if (is.null(prefix)) {
    prefix <- sub("\\.R$", "-", gsub("_", "-", basename(path)))
  }
  labels <- paste0(prefix, gsub("_", "-", names))

  list(from = starts, to = ends, labels = labels)
}
```
