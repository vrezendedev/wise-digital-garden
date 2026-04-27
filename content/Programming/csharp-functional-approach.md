---
title: "Considering a More Functional Approach with C#"
date: 2026-02-17
tags:
  - functional programming
  - c sharp
  - ecs
  - game development
---

### Disclaimer

This article uses examples from an old and obsolete version of Theia ECS; nonetheless, the topics discussed here are still valid and worthy of analysis.

### Introduction

**In game development**, **mutability** is something that **can’t be avoided and definitely shouldn’t be**. Fully immutable entities are often counterproductive in real-time game loops, but we should use immutable data where it fits nicely. But functional programming isn’t only about immutable state; it’s much more than that.

==What I’m going to talk about is far from pure functional programming because of the nature and purpose of the code being written==. Still, we can always use good ideas from different paradigms. While developing [[what-is-sandtide|Sandtide]], I usually go for a **hybrid path**, not strictly following a single paradigm and, in my opinion, that’s **an ideal way to create software**. That’s why we should consider a more functional approach, just as we should consider a more procedural approach, and so on.

In game development, it’s undeniable how many OOP advocates there are out there, which can sometimes limit architectural exploration. ==We shouldn’t be stuck with only a single set of solutions;== we should think about a problem while acknowledging all possible solutions from all kinds of sources. **It isn’t about using the same design pattern over and over again**. I can’t even describe the weird state machine implementations I’ve seen out there... you shouldn’t use them as a solution for anything!

So, I’ll try to point out, using a few examples, **how we can adopt a more functional approach without going all in on that paradigm**. Of course, ==every example is set in a game programming context==, so you should definitely keep that in mind before jumping to conclusions.

### Functional Programming and Entity-Component-System

I can’t deny that I was constantly thinking about similarities between ECS and functional programming during the early-stage development of Theia (Obsolete Version); it definitely changed how I approached the public API.

In ECS, **data is dumb** and has no manners, because it doesn’t know how to behave itself ~ba dum tss~. **Components are containers** of values and shouldn’t dictate behavior. Systems act through **queries, which act like higher-order functions**, to alter the states of these components (and that differs completely from the idea of immutability).

Unlike in common OOP architectures, in ECS we think about ==data and transforms, not stateful, behavioral objects==, so we separate logic from data. Furthermore, we aim for **predictability** and **modularity** when updating the game state by following a more declarative style and organizing updates as sequences of function calls, similar to **functional programming pipelines**.

The following example shows that behavior is modeled through composable functions operating on explicit data. **Systems are values**: in functional programming, a function becomes a first-class value when it can be stored, passed, and composed like any other piece of data. Behavior is no longer attached to an object, it becomes a value that can be manipulated and reused.

**Queries are higher-order functions**: the query itself is abstract and does not define behavior. Instead, it accepts behavior as a parameter and applies it to matching components, mirroring higher-order functions in functional programming where control flow is parameterized by behavior.

Execution is structured as a visible pipeline.

==It isn’t pure functional programming, but it clearly adopts part of that mindset==.

```csharp
namespace Sandtide.Source.DTOs;

public readonly struct Draw
{
    public readonly required World World { get; init; }
    public readonly required GameTime GameTime { get; init; }
    public readonly required Viewport Viewport { get; init; }
    public readonly required SpriteBatch SpriteBatch { get; init; }
    public readonly required Rectangle RectangleClip { get; init; }
    public readonly required Quad QuadClip { get; init; }
}

// ...

global using SandtideBundle = TheiaECS.Extended.Source.Core.Systems.Bundle<
    Sandtide.Source.DTOs.Initialize,
    Sandtide.Source.DTOs.Load,
    Sandtide.Source.DTOs.Update,
    Sandtide.Source.DTOs.Draw
>;

namespace Sandtide.Source.Systems;

public static class Core
{
    private static SandtideBundle s_bundle;

    static Core() => s_bundle = new SandtideBundle();

    //...

    public static void Draw(in Draw dto)
        => s_bundle
            .Draw(dto, WorldDrawer.Islands)
            .Draw(dto, WorldDrawer.Entities);
}

// ...

namespace Sandtide.Source.Systems.Drawers;

public static class WorldDrawer
{
    public static readonly SandtideBundle.Drawer Islands = (in Draw dto) =>
    {
        // Logic operating on islands chunks
    };

    public static readonly SandtideBundle.Drawer Entities = (in Draw dto) =>
    {
        dto.World.ExecuteHermitQuery(
            ArchetypesWrapper.QDraw,
            (ref Transform t, ref Sprite s) =>
            {
               // Logic operating on components
            }
        );
    };
}
```

When I was developing the **first version of Theia Extended (Obsolete Version)**, I considered creating systems as follows:

```csharp
public abstract class Unit<TInitialize, TLoad, TUpdate, TDraw>
    : ILifecycleProcessor<TInitialize, TLoad, TUpdate, TDraw>
{
    public readonly World World;

    internal readonly bool _parallel;

    public Unit(in World w, bool parallel = false)
    {
        World = w;
        _parallel = parallel;
    }

    public abstract void Initialize(in TInitialize param);

    public abstract void Load(in TLoad param);

    public abstract void Update(in TUpdate param);

    public abstract void Draw(in TDraw param);
}
```

This is a classic OOP structure but **enforces coupling between worlds and systems**, while **implicitly expecting behavior that doesn’t necessarily need to exist**, _e.g._, an Input "Unit" doesn’t necessarily need to load resources or even draw anything on screen. An approach that could resembles functional programming would look like this:

```csharp
namespace TheiaECS.Extended.Source.Core.Systems;

public class Bundle<TInitialize, TLoad, TUpdate, TDraw>
{
    public delegate void Initializer(in TInitialize param);

    public delegate void Loader(in TLoad param);

    public delegate void Updater(in TUpdate param);

    public delegate void Drawer(in TDraw param);

    public Bundle<TInitialize, TLoad, TUpdate, TDraw> Initialize(
        in TInitialize param,
        in Initializer initializer
    )
    {
        initializer.Invoke(param);
        return this;
    }

    public Bundle<TInitialize, TLoad, TUpdate, TDraw> Load(in TLoad param, in Loader loader)
    {
        loader.Invoke(param);
        return this;
    }

    public Bundle<TInitialize, TLoad, TUpdate, TDraw> Update(in TUpdate param, in Updater updater)
    {
        updater.Invoke(param);
        return this;
    }

    public Bundle<TInitialize, TLoad, TUpdate, TDraw> Draw(in TDraw param, in Drawer drawer)
    {
        drawer.Invoke(param);
        return this;
    }
}
```

This is the **current implementation of Systems** in Theia Extended (Obsolete Version). It provides ==minimal coupling== because systems no longer hold references to the world or enforce a lifecycle contract; instead, all required data and behavior are passed explicitly at the call site. It enables ==method chaining for explicit pipelines, independent and reusable functions, declarative execution order, encourages readonly immutable parameters, and treats behavior as first-class values==, as illustrated in the first example. **The method chaining is an aesthetic choice** and, in my opinion, enhances readability while making the pipeline flow more explicit.

### Being More Declarative: An Example with Theia ECS Queries

```csharp
dto.World.ExecuteQueryAsProspective(
    ArchetypesWrapper.QBuildings,
    (ref Entity e, ref Transform t, ref Sprite s, ref Storage storage, ref Activity activity) =>
    {
        // Logic operating on components
    }
);
```

Declarative programming means describing the desired outcome rather than the intermediate steps required to achieve it. In Theia (Obsolete Version), queries require **filtering** and **behavioral inputs** while ==explicitly stating their intent== through `ExecuteQueryAsCreational`, `ExecuteQueryAsProspective`, and `ExecuteHermitQuery`.

These queries allow the developer to **describe the shape of the data to be transformed**. They implicitly act as ==data contracts==: there are no hidden dependencies, since the queries declare the exact coupling surface as the set of data the lambda depends on.

This declarative aspect makes systems easier to reason about because the ==input is explicitly constrained==. **Behavior is injected, and iteration is abstracted away** (since it doesn’t matter at the surface level). In functional terms, you could read it as:

> Map this function to each entity matching the QBuildings query, where the function operates on the query’s specified component set.

It’s about making data access explicit, constraining dependencies, and separating what should happen from how it is executed. These _contractual_ lambdas provide a clear scope for mutating components and **bring clarity** to their intended behavior.

### Immutability as a Boundary for Shared State

There are many ways to achieve global shared data, for example, through static classes or more pseudo-fancy approaches like [singletons](https://refactoring.guru/design-patterns/singleton).

It’s undeniable how dangerous these can become if mutable. Global mutable state implies that side effects are spread all over the source code. But should we avoid global state altogether?

From a more mechanics/feature-oriented perspective, in games, that’s pretty hard to do. For example, in [[what-is-sandtide|Sandtide]], the player has both global and local resources, and many entities can mutate those global resources. Therefore, we need a way to store these resources globally. For that, Theia Extended (Obsolete Version) provides `Atom<TValue>`for unmanaged values and `DataTable<TKey, TValue>` for managed values.

But what about from a program’s architectural perspective? Should systems mutate every shared dependency? The short answer is ==usually no==. And that’s where immutability shines. Not every dependency needs to be mutable, but not all immutable data is a compile-time constant known ahead of time. In C#, there are multiple ways to achieve immutability; for example, you can use `readonly struct` or `record`.

In [[what-is-sandtide|Sandtide]], update systems usually depend on the same parameters, which cannot be reconstructed during the game loop. A solution that implicitly highlights immutability could look like this:

```csharp
namespace Sandtide.Source.DTOs;

public readonly struct Update
{
    public readonly required World World { get; init; }
    public readonly required GameTime GameTime { get; init; }
    public readonly required Viewport Viewport { get; init; }
    public readonly required bool IsActive { get; init; }
}
```

This approach makes it clear that the `Update` data is immutable and ensures systems can safely read it. Of course, there are reference types within the struct, like `World`, and public properties can still be modified, but that’s just the nature of the program: it is a game!

But what does this have to do with global shared state? Immutability doesn’t eliminate shared state issues, but when we bring it to the table, **it makes it easier to reason about what needs to change and what doesn’t**. Functional programming embraces immutability at every step: once a variable is created, it cannot change (with a few exceptions), and every expression, with an output, produces immutable values. Sadly, that approach isn’t very practical for games, as I’ll explain below.

### Why Full Functional Programming Isn't Practical in Games

==Games require performance==, and that’s something that **needs to be addressed early on**, not when bottlenecks start occurring. There is a lot of content out there pointing to the performance advantages of ECS and data-oriented design, but **understanding how the language works is mandatory to create these high-performance systems**.

When creating Theia (Obsolete Version), ==one of the key concerns was addressing the boxing and unboxing of unmanaged values, minimizing garbage collection hits, and ensuring cache-friendly data locality and layout, among other low-level considerations==. It’s hard to imagine a scenario where component immutability would fit nicely, performance-wise, in a context that would involve constant boxing and unboxing. If components were immutable, every time one would change, it wouldn’t actually mutate it in place, it would:

1. Create a new component with the updated values;
2. Replace the old one in the chunk;
3. Potentially trigger boxing.

Now imagine doing that every single update. It would be **insane**.

Furthermore, consider garbage collection hits: if a component is mutated and the underlying chunk changes as a result, should we create a new chunk with new arrays based on the previous one just to maintain a pure flow? **That would be a nightmare and completely unfeasible**. Applying these changes would also degrade data locality.

And that is just scratching the surface of what even a few steps toward attempting to go fully functional in a stateful environment would entail. To be fair, one of my goals is to create a game or even an ECS framework using OCaml and Raylib, if I ever find the time. Maybe someday I can come back to share how I managed to do it and how I tackled these challenges.

Anyway, this doesn’t mean functional principles are useless in game development, far from it. Rather, it highlights that **their application must be strategic**, as demonstrated and exemplified above.

### Conclusion

**Game systems are inherently stateful**, no pun intended. Each frame results in multiple mutations driven by a **reactive environment**. Trying to force a purely functional architecture, or a fully object-oriented one, isn’t a good idea. ==These systems are extremely complex, both from a low-level and a high-level perspective==.

Adopting a more functional mindset, especially when working with ECS, encourages:

- Explicit data flow instead of implicit object coupling;
- Behavior as composable values instead of rigid hierarchies;
- Declarative intent instead of inheritance noise;
- Controlled mutability instead of accidental side effects.

**Systems should be pipelines of behavior**, and ==data shouldn’t manipulate itself==. Mutation should be localized and intentional. **This isn’t pure functional programming**, and I know that, but honestly: **it shouldn’t be**. It’s about ==borrowing ideas that improve reasoning, modularity, and predictability, while acknowledging performance constraints and design realities==. The goal is to write clear, explicit, high-performance game code.

**Good architecture isn’t about loyalty to a paradigm**. It’s about choosing the right constraints for the problem you’re solving.
