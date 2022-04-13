+++
title = 'Live coding, Emacs, and ghci'
[taxonomies]
category = ['teaching']
tag = ['tutorial']
+++

This semester I'm co-lecturing Declarative Programming (COMP90048). The topics I'll be covering include monads, laziness, performance, and type system expressiveness, with [Haskell](https://www.haskell.org/) as our language of choice. This will be the first time that I'll try live coding in front of students, because I've previously lectured non-programming subjects such as multi-variable calculus and infectious disease modelling.

The obvious choice of tool for live demonstrations of Haskell code and expression evaluation is `ghci`. And I happen to have `ghci` already installed, by virtue of using [xmonad](http://xmonad.org/) to manage my windows and workspaces. I also spend most of my working hours living in [Emacs](https://www.gnu.org/software/emacs/), which has great support for working with interactive programming environments (also referred to as REPLs, Read-Eval-Print Loops) and for taking code blocks from open files and evaluating them in these environments. So I know what my preferred tools are. But it wasn't immediately clear to me what the precise *workflow* should be.

<!-- more -->

# The problem

First things first, I installed [haskell-mode](https://github.com/haskell/haskell-mode). Since I'm currently testing out [Spacemacs](http://spacemacs.org/) (a nice veneer of pre-configured packages for Emacs) this was as easy as opening a file with a `.hs` extension and responding "yes" to the haskell-mode installation prompt (see the [manual](https://haskell.github.io/haskell-mode/manual/latest/) if you don't use Spacemacs). This meant I could now open Haskell files, load them in interactive `ghci` buffers, and use the defined functions and types for live coding. For example, with the following content in `Test.hs`:

```haskell
f :: Num a => a -> a -> a
f x y = x^2 + y^2
```

I could open this file in Emacs and use `haskell-process-load-file` (**C-c C-l** or **SPC m s b**) to launch a new `ghci` session and load this definition:

```txt
λ> f 3 4
25
λ>
```

But I'm picky; this isn't enough. I don't want to manage lots of individual files that each contain a handful of definitions. I'd rather organise all of these examples in a single [Org mode](https://orgmode.org/) document. Org mode allows you to embed blocks of code in a simple manner:

```txt
#+BEGIN_SRC haskell
f :: Num a => a -> a -> a
f x y = x^2 + y^2
#+END_SRC
```

When the cursor is inside one of these source code blocks, you can use `org-edit-src-code` (**C-c '** or **SPC m '**) to open a transient buffer that contains only the contents of that block, with all of the language-specific bells and whistles at your disposal. So my first thought was to use `haskell-process-load-file` from within one of these buffers. It didn't work:

```txt
Unexpected response from haskell process.
```

# Looking for a solution

But this is Emacs. *I can dig into these commands and see what's going wrong*. So **C-h f** `haskell-process-load-file` tells me that this function accepts no arguments and loads the current buffer file. But I can also inspect the code for this function (*click on link*) and I can immediately see that it's loading the buffer contents from an external file (as returned by `buffer-file-name` on line 9):

```el,linenos
(defun haskell-process-load-file ()
  "Load the current buffer file."
  (interactive)
  (save-buffer)
  (haskell-interactive-mode-reset-error (haskell-session))
  (haskell-process-file-loadish (format "load \"%s\"" (replace-regexp-in-string
                                                       "\""
                                                       "\\\\\""
                                                       (buffer-file-name)))
                                nil
                                (current-buffer)))
```

Presumably the transient buffer isn't associated with a file name, and so `(buffer-file-name)` will return `nil`, meaning that `ghci` is unable to load this non-existent file. *Spoiler:* I later realised that the transient buffer is actually associated with the Org mode document from whence it came, and so `ghci` will attempt to compile and load the Org mode document as a Haskell source file. Either way, `ghci` is trying to load something that *isn't* a valid Haskell source file.

It was relatively simple to write a modified version of `haskell-process-load-file` that saves the buffer to a temporary file, using `org-babel-temp-file` to generate the filename.

```el,linenos
(defun haskell-process-load-buffer ()
  "Load the current buffer via a temporary file."
  (interactive)
  (let ((buffer (current-buffer))
        (body (buffer-string))
        (tmp-file (concat (org-babel-temp-file "haskell-load-") ".hs")))
    (with-temp-buffer
      (insert body)
      (write-file tmp-file)
      (haskell-interactive-mode-reset-error (haskell-session))
      (haskell-process-file-loadish
       (format "load \"%s\"" (replace-regexp-in-string
                              "\""
                              "\\\\\""
                              tmp-file))
       nil
       buffer))))
```

I'd rather not duplicate some of the internals of `haskell-process-load-file`, but calling `haskell-process-load-file` from within the `with-temp-buffer` block produces the following error message:

```txt
Haskell process command errored with: (error "Selecting deleted buffer")
```

This occurs because the temporary buffer created by `with-temp-buffer` will cease to exist once control exits that scope. It's not critical &#x2014; the code is still loaded successfully &#x2014; but I'd rather not have error messages appear unless they're *meaningful*. This can be avoided by manually calling `haskell-process-file-loadish` and passing it a reference to the original code buffer.

# Refining the solution

Calling `haskell-process-load-buffer` from within transient code buffers now works as expected. But it's tedious having to use a different command when working in a transient buffer &#x2014; it would be ideal to replace all of the key bindings for `haskell-process-load-file` to call this function instead. A much simpler approach (and less error-prone than searching through all of the different keymaps to identify the appropriate key bindings) is to use Emacs' *advice system*, which allows you to [modify](https://www.gnu.org/software/emacs/manual/html_node/elisp/Advising-Functions.html) an existing function.

```el,linenos
(defun haskell-process-load-buffer (orig-fun &rest args)
  (if (and (buffer-file-name) (not org-src-mode))
      ;; The buffer is associated with a file, and is not a transient Org mode
      ;; code buffer, so the file *should* only contain Haskell code.
      ;; In which case, call the original function.
      (apply orig-fun args)
    ;; The alternative is that the buffer is not associated with a Haskell
    ;; file and its contents should be saved to a temporary file.
    (let* ((buffer (current-buffer))
           (body (buffer-string))
           (tmp-prefix "haskell-load-")
           (tmp-suffix ".hs")
           (tmp-file
            (if org-src-mode
                ;; Org Babel has its own temp-file functions.
                (concat (org-babel-temp-file tmp-prefix) tmp-suffix)
              ;; Create a normal Emacs temporary file.
              (make-temp-file tmp-prefix nil tmp-suffix))))
      (with-temp-buffer
        ;; Copy the contents of the original buffer into this temporary buffer
        ;; and save it to the newly-created temporary file.
        (insert body)
        (write-file tmp-file)
        ;; Instruct ghci to load this file, as per haskell-process-load-file.
        (haskell-interactive-mode-reset-error (haskell-session))
        (haskell-process-file-loadish
         (format "load \"%s\"" (replace-regexp-in-string
                                "\""
                                "\\\\\""
                                tmp-file))
         nil
         buffer)))))

;; Install a wrapper around the existing haskell-process-load-file function.
(advice-add 'haskell-process-load-file :around
            #'haskell-process-load-buffer)
```

Another approach would be to call `haskell-process-load-file` within a `with-temp-buffer` block, perhaps that's simpler? Then the check would be `(if (buffer-file-name) (orig-fun) (...))`. *But* that's when I discovered that this temporary code buffer is associated with the `.org` file in which it is contained.

# Multiple code blocks and tangling

Org mode allows you to extract source code from multiple code blocks and "[tangle](https://orgmode.org/manual/Extracting-source-code.html)" them together to produce a source code file. And for each code block, you can define the file into which it should be tangled by using the `:tangle` header argument. When the argument is `:tangle yes`, the output file will be the same as the Org file, but with an appropriate extension (".hs" in this case); you can also use `:tangle path/to/file.hs` to write the code block(s) to a specific file. In the example below the two code blocks will be tangled together to produce `Test1.hs`, which will contain the definitions of both `f` and `g`:

```txt
#+BEGIN_SRC haskell :tangle TestTangle.hs
  f x y = x + y
#+END_SRC

#+BEGIN_SRC haskell :tangle TestTangle.hs
  g x = f x x
#+END_SRC
```

This would appear as two code blocks (shown below) and they could be placed anywhere in the document &#x2014; they don't need to be adjacent.

```haskell
f :: Num a => a -> a -> a
f x y = x + y
```

For example, this text will not be included in `TestTangle.hs` when the two blocks (above and below) are tangled together.

```haskell
g :: Num a => a -> a
g x = f x x
```

## Why tangle code blocks

Why tangle these blocks, rather than simply concatenating their contents? Because Org mode supports features such as [passing variables and results](https://orgmode.org/manual/Specific-header-arguments.html) between blocks, and [referring to other code blocks](https://orgmode.org/manual/Noweb-reference-syntax.html), and so exporting the source code is more complex than simply extracting the code verbatim from within each code block.

So when working in a transient code buffer, all of the relevant code blocks should be tangled together. If the code block shouldn't be tangled (the default, which can also be achieved with `:tangle no`) then it's probably sensible to tangle just the single block.

## How to tangle code blocks

You can discover how to tangle code blocks by looking at the documentation for `org-babel-tangle`, using **M-x describe-function** (**C-h f**).

```txt
(org-babel-tangle &optional ARG TARGET-FILE LANG)

Write code blocks to source-specific files.
Extract the bodies of all source code blocks from the current
file into their own source-specific files.
With one universal prefix argument, only tangle the block at point.
When two universal prefix arguments, only tangle blocks for the
tangle file of the block at point.
Optional argument TARGET-FILE can be used to specify a default
export file for all source blocks.  Optional argument LANG can be
used to limit the exported source code blocks by language.
```

If you're not familiar with the [universal prefix argument](https://www.gnu.org/software/emacs/manual/html_node/elisp/Prefix-Command-Arguments.html) (**C-u**), the salient point is that when `ARG` is set to `(4)` only the code block at the point (i.e., the cursor's current position) will be tangled, and when `ARG` is set to `(16)` only code blocks for the tangle file of the code block at the point will be tangled.

So if the code block should be tangled (`:tangle yes` or `:tangle file.hs`) this can be achieved with `(org-babel-tangle '(16))`, and if the code block shouldn't be tangled it should be written to a temporary file and tangled with `(org-babel-tangle '(4) temp-file)`.

Finally, when working in an Org buffer you can inspect the code block at the point with `(org-babel-get-src-block-info t)` (the argument `t` prevents Org from resolving remote variable references, which could require executing other code blocks). When working in a transient code buffer, these details are stored in the variable `org-src--babel-info` and the parent Org buffer is stored in the variable `org-src--source-buffer`; these details can be discovered by using **M-x describe-variable** (**C-h v**).

# Putting it all together

So the following situations need to be covered when dealing with Org mode source blocks:

-   The current buffer is a transient buffer that is being used to edit the contents of a code block in an Org mode file.
-   The current buffer is an Org mode file and the cursor is a source code block.

In either case, the relevant source code blocks should be tangled, and the resulting code loaded from the tangled file.

It might also be useful to tangle *only* the current code block, even if there are other code blocks that should be tangled into the same file, so that the contents of that code block can be interrogated in isolation. A simple way to [overload a command's behaviour](https://www.emacswiki.org/emacs/PrefixArgument) is to make use of the universal prefix argument (i.e., the approach used by `org-babel-tangle` and many, many other Emacs commands), allowing the user to select either behaviour; see lines 62&#x2013;65.

```el,linenos,hl_lines=62-65
(defun send-to-haskell/file-with-buffer (file-name buffer)
  "Load FILE-NAME in a REPL session and associate it with BUFFER."
  (haskell-interactive-mode-reset-error (haskell-session))
  (haskell-process-file-loadish
   (format "load \"%s\"" (replace-regexp-in-string
                          "\""
                          "\\\\\""
                          file-name))
   nil
   buffer))

(defun send-to-haskell/org-src-block (&optional arg)
  "Tangle the current Org mode source block and load it in a REPL session.
With one universal prefix argument, only tangle the block at point."
  (interactive "P")
  (let* ((src-block
          (cond ((string= major-mode "org-mode")
                 ;; In an Org mode buffer, is the cursor in a source block?
                 (let ((info (org-babel-get-src-block-info t)))
                   (if info
                       (list info nil (current-buffer))
                     nil)))
                (org-src-mode
                 ;; In a transient source code buffer.
                 (list org-src--babel-info (current-buffer)
                       (org-src--source-buffer)))
                (t
                 ;; Not in an Org mode source block or transient code buffer.
                 nil)))
         (is-haskell-src
          (and src-block (string= "haskell" (nth 0 (nth 0 src-block))))))
    (unless is-haskell-src
      (user-error "Not in a Haskell source code block"))
    (when is-haskell-src
      (let* ((info (nth 0 src-block))
             (code-buffer (nth 1 src-block))
             (org-buffer (nth 2 src-block))
             (lang (nth 0 info))
             (contents (nth 1 info))
             (params (nth 2 info))
             (tangle-to (cdr (assq :tangle params)))
             (posn (nth 5 info)))
        ;; Tangle the relevant code block(s) and get the tangled file name.
        (let ((out-file
               (cond ((string= tangle-to "no")
                      ;; Tangle this *single block* to a temporary file
                      (let* ((tmp-prefix "haskell-load-")
                             (tmp-suffix ".hs")
                             (tmp-file (concat
                                        (org-babel-temp-file tmp-prefix)
                                        tmp-suffix)))
                        (with-current-buffer org-buffer
                          (goto-char posn)
                          (let ((tangled-files
                                 (org-babel-tangle '(4) tmp-file)))
                            (message "Tangled: %s" tangled-files)
                            (nth 0 tangled-files)))))
                     (t
                      ;; Tangle all relevant blocks to a specified file
                      (with-current-buffer org-buffer
                        (goto-char posn)
                        ;; If `arg' is '(4), only tangle this single block.
                        (let* ((arg (if (equal arg '(4)) '(4) '(16)))
                               (tangled-files
                                (org-babel-tangle arg "haskell")))
                          (message "Tangled: %s" tangled-files)
                          (nth 0 tangled-files)))))))
          ;; Now visit this tangled file and load it in ghci.
          (if code-buffer
              ;; There is an existing code buffer, use a temporary buffer to
              ;; visit the tangled file.
              (with-temp-buffer
                (insert-file-contents out-file t)
                (send-to-haskell/file-with-buffer out-file code-buffer))
            ;; No existing code buffer, visit the file normally.
            ;; Set `NOWARN' to `t' to avoid prompting the user to reread the
            ;; file if the contents (on disk) have changed.
            (let ((tangled-buffer (find-file-noselect out-file t)))
              (with-current-buffer tangled-buffer
                ;; Ensure the buffer name starts and ends with an asterisk.
                (let ((buf-name (buffer-name)))
                  (unless (and (string-prefix-p "*" buf-name)
                               (string-suffix-p "*" buf-name))
                    (rename-buffer (concat "*" buf-name "*"))))
                (send-to-haskell/file-with-buffer out-file tangled-buffer))))
          nil)))))
```

More generally, the following cases should also be handled:

-   The current buffer is not associated with a file and only contains Haskell code, in which case its contents should be saved to a temporary file, from which the code can then be loaded.
-   The current buffer is associated with a Haskell source file, in which case `haskell-process-load-file` can be used as-is.

Again, Emacs' advice system can be used to wrap `haskell-process-load-file` and handle each of these cases. Note that the order of the clauses in following the `cond` statement is important, because `org-src-mode` buffers are associated with a non-Haskell file (i.e., their parent Org document), and that the value of the prefix argument (`current-prefix-arg`) is explicitly provided as an argument to `send-to-haskell/org-src-block`.

```el,linenos
(defun send-to-haskell/hplf-advice (orig-fun &rest args)
  "Wrapper function for `haskell-process-load-file'."
  (interactive)
  (cond
   (org-src-mode
    (send-to-haskell/org-src-block current-prefix-arg))
   ((string= major-mode "org-mode")
    (send-to-haskell/org-src-block current-prefix-arg))
   ((buffer-file-name) (apply orig-fun args))
   (t
    (let ((buffer (current-buffer))
          (content (buffer-string))
          (tmp-file (make-temp-file "haskell-load-" nil ".hs")))
      (with-temp-buffer
        (insert content)
        (write-file tmp-file)
        (send-to-haskell/file-with-buffer tmp-file buffer))))))

;; Install the wrapper around `haskell-process-load-file'.
(advice-add 'haskell-process-load-file :around
            #'send-to-haskell/hplf-advice)
```

Finally, it's convenient to use the same binding in Org mode buffers as in Haskell buffers (e.g., **M-m m s b** if you're using Spacemacs):

```el
;; Replace the Org mode binding for M-m m s (org-schedule).
(spacemacs/set-leader-keys-for-major-mode 'org-mode "s" nil)
(spacemacs/set-leader-keys-for-major-mode 'org-mode
  "sb" 'haskell-process-load-file)
```

And voilà! I can now send Haskell code to a REPL session from within Org documents and from transient code buffers with **M-m m s b**, and I can send individual code blocks from within Org documents with **C-u M-m m s b**.

# Appendix: Additional configuration

In the process of coming up with this solution, I also made several other changes to my configuration.

## Default extension for tangled files

To ensure that the default tangled filename ends with ".hs", it's a good idea to load Org support for evaluating Haskell source code. This is simple to do in Spacemacs (example shown below) and in [vanilla Emacs](https://orgmode.org/manual/Languages.html).

```el
(spacemacs|use-package-add-hook org
  :post-config
  (require 'ob-haskell))
```

Note that this will also enable direct [evaluation](https://orgmode.org/manual/Evaluating-code-blocks.html) of Haskell source code blocks in Org documents.

## Spacemacs key bindings relevant to live coding

For the purposes of live coding, I also want to switch from my default (dark) theme to a light theme, greatly increase the font size, and quickly switch between code and REPL buffers. So here are some relevant (Spacemacs) bindings:

-   **SPC w w:** toggle between open windows
    -   Can also use **M-1**, **M-2**, etc.
-   **SPC T n:** cycle colour themes
-   **SPC z x +:** increase font size, enter scaling mode
-   **SPC z x 0:** reset font size, enter scaling mode
-   **SPC m s b:** send active Haskell buffer to REPL
-   **SPC m s s:** show the REPL *without* activating it
-   **SPC m s S:** show the REPL *and* activate it

*Reminder to self:* in insert mode, use **M-m** instead of **SPC**.

## Customising the REPL

By default, Spacemacs would start the REPL buffer in *evil mode*. But since my primary activity in these buffers is to enter simple expressions for evaluation, I'd rather start the REPL in *insert mode*:

```el
(add-to-list 'evil-insert-state-modes  'haskell-interactive-mode)
```

I also wanted to silence the several warning messages that appear at the top of every REPL session:

```el
(setq haskell-process-show-debug-tips 'nil)
```

You can also ensure that the REPL appears in a [separate frame](http://haskell.github.io/haskell-mode/manual/latest/Interactive-Haskell.html), but I'm not certain whether I want this behaviour.

## Code block indentation

I didn't like how code blocks were indented by 2 additional spaces, relative to the `#+BEGIN_SRC` and `#+END_SRC` lines. This is [simple to fix](https://emacs.stackexchange.com/a/18892):

```el
(setq org-edit-src-content-indentation 0)
```

## Code folding

Similar to Org mode, you can enable code folding in Haskell buffers by using [outshine](https://github.com/alphapapa/outshine), as described on the Org mode [wiki](https://orgmode.org/worg/org-tutorials/org-outside-org.html).

```el
(add-hook 'haskell-mode-hook
          (lambda ()
            (set (make-local-variable 'outline-regexp)
                                      "-- \\*+")
            (require 'outshine)
            (outline-minor-mode)))
```

Then mark sections, subsections, etc, in a similar manner to Org mode, and use `TAB` to collapse and expand each section.

```haskell
-- * Section

f x = x^2

-- ** Subsection

g x = x^3

-- * Another section

h x = (f x) + (g x)
```
