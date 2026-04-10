---
title: "Theia Complete Rewrite: Benchmark Results Sneak Peek"
date: 2026-04-09
---

### Yes, once more, I’ve redone everything

Theia exists for [[what-is-sandtide|Sandtide]]. And while developing it, I’ve realized **how wrong some stuff was...** not performance-wise, but maintainability-wise. I understood Theia, but ==only because I created it==, and that’s a huge problem! A few times, with my colleague, I had to explain how to use it properly to avoid memory corruption errors and things alike, and honestly, ==that’s terrible==.

A framework **should explicitly bring its philosophy along with it**, and Theia did it, but partially. I had good ideas while developing it, but it was far from perfect; actually, ==the framework wasn’t self-aware of its own mistakes==. What I’m trying to say, is that the framework itself wasn’t enforcing anything, it led to a certain way of development, but it wasn’t explicitly acknowledging its use to the developer. ==It’s not only about having good documentation, but the system must react to wrong inputs==.

Performance is important, sure it is! But we need to address performance while being, simultaneously, explicit and constrained. And that’s what the new version of Theia is about... I’m still refining some edges before releasing it publicly, but I’ve come here to share the first benchmark results, comparing it to other awesome frameworks, all written in C#.

**Theia’s new version is fully implemented in managed C# (that means no unsafe code)**, has a considerable amount of test coverage, and will be available with all the features from the previous version and more interesting ones!

I’ve decided to compile all the results and plot them on a graph, so it’s easier to visualize and digest them. I will release the result files along with Theia’s new version.

It’s safe to say that, by analyzing the data, **Theia’s new version is not only safer, as I promised, but fast!** In my opinion (try to ignore the fact that I’m the one who developed it), based on the data, Theia is a viable ECS framework. Due to its archetype’s underlying implementation, which aims for lazy initialization for chunks, at high entity counts, structural changes when adding or removing components are a little bit costly, and queries that involve very high entity counts can be impacted a little bit due to pointer dereferencing.

These weak spots are a tradeoff... these decisions allowed **reduction of unused memory consumption, safer chunk access (especially for parallelization), unlimited component types, and other ins-and-outs.** But no worries, Theia compensates its weaknesses a lot! As I like to point out, ==Theia is a fast-enough (and often, or sometimes, faster) ECS framework for your games!==
