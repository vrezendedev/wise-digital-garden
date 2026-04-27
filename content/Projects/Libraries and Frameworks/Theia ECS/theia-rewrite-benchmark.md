---
title: "Theia Rewrite: Updated Benchmark Results"
date: 2026-04-26
---

### It’s Done! (Almost)

It’s been almost **two months** since I decided to **develop the entire framework from scratch** again, and here we are, **the job is done**! Theia ECS is completely renewed and comes with **even more features than before**:

- Validation and strict constraints to ensure the use of **only blittable types**;
- **Events** (entity lifecycle, components, and relations), allowing different event scopes (World or Assemblage);
- **Jobs**, with **built-in parallel** systems and parallel query execution (per _chunk_);
- **Types as enums** (capable of matching or including a certain component or relation to an enum value);
- **World-bounded** single-instance components, known as **singleton components** (called Uniques);
- Improved DataTable, now called ManagedData (a custom, dictionary-like collection for classes);
- A **greatly improved relation system**: ==bilateral linkage, with all operations as O(1) and thread-safe==;
- Improved Systems;
- A greatly **improved serialization/deserialization system**;
- Exceptions (yes, that is a feature!) screaming at the programmer so we don’t mess things up; for example, it **throws when attempting to perform an action that may trigger a structural change during a query**.

Other basic features have also been improved, and _we’ll go over everything in detail another day_.

This new version **greatly improves what I started around one or two years ago**, and now, to be totally fair, _I feel ashamed of a lot of the mistakes made in the old version_... but just like our _for loops_, ==we need to iterate on our solutions in order to improve our work==.

As I pointed out in the [[theia-rewrite|sneak peek]] article, ==Theia’s new version is fully implemented in managed C#== (that means no unsafe code), and now, with version 1.0 finished and **updated benchmark results**, I can safely say that ==Theia is one of the fastest C# ECS framework (usually scoring #1 in most counts across many different categories, according to the presented benchmark) for the operations that matter most in a running game loop==: iterating entities via queries (it got even faster after a refactor I did since the sneak peek article), spawning and despawning, and relation management.

Just to refresh our memories, due to its archetype’s underlying implementation, which aims for lazy initialization of chunks, structural changes when adding or removing components can be a little costly at high entity counts, as I mentioned before.

Without further ado, as I did in the sneak peek, I’ve decided to compile all the results and plot them on a graph. **Check out the results for yourself below!** Theia’s new version will be **released soon**, including the benchmark (with the results) and unit test projects; the **final step is solid documentation**, which is already on the way!
