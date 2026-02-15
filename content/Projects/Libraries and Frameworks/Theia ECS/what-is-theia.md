---
title: What is Theia and Theia Extended?
date: 2026-01-01
---

### Disclaimer

Much of the information here was already presented in [Theia ECS’s GitHub repository](https://github.com/vrezendedev/TheiaECS), but some things may be presented slightly differently here. So, with that said, let’s get started.

### What is it?

As I like to define, Theia is a fast-enough [(and often, or sometimes, faster)](https://github.com/vrezendedev/ECS-Benchmark) ECS framework for your games, offering a **distinct and expressive** approach written in 100% C# with **no external dependencies**. Theia empowers developers to express game logic naturally and efficiently through an expressive yet simple API, **easily enabling development of high-performance, memory-friendly code with minimal allocations**.

Theia Extended builds upon this foundation, providing **additional powerful and resourceful features** with only a single dependency: [MessagePack](https://github.com/MessagePack-CSharp/MessagePack-CSharp).

### Features

Theia’s features:

1. _Core_:
   - **Pure C#** Implementation;
   - **Archetype-Based Design**: efficiently organizes entities with similar component structures;
   - **Memory Efficiency**: uses ==pooling== and ==chunk-based memory allocation== to minimize GC pressure;
   - **Query System**: ==powerful querying capabilities== for entity and component retrieval;
   - **Deferred Operations**: supports ==deferred== creation, destruction, and component modifications;
   - **Type Safety**: leverages C# generics for type-safe component access;
   - **Assemblages**: ==pre-defined entity templates== for consistent and fast entity creation;
   - **O(1) Entities Operation**: ==constant-time entity creation, deletion and component lookup==.

---

2. _Extended_:
   - **Systems**: an approach for creating and organizing your ==game’s systems through delegates==;
   - **Singleton Components**: implements a centralized pattern for managing ==single-instance components== through the Atom class;
   - **Data Tables**: offers an efficient system for ==managing and accessing managed data==;
   - **Relations**: ==manages and tracks the parent-child relationships== between entities in a World;
   - **World Serialization**: utilizes Assemblages to serialize and deserialize Entities and their components, offering better control over what gets saved. It uses MessagePack for ==efficient binary serialization==.

Nowadays, Theia can support only up to 2,097,152 entities per World, but that **will change sooner than expected** with the next framework update, which applies the concept of chunkerization to entities and their metadata.

### Resources and Architecture

As seen in Theia’s repository, it contains seven projects:

- **TheiaECS_Common**: contains utility classes (_e.g._, pooled collections) used by both core and extended libraries;
- **TheiaECS_Lib**: core library containing all the main functionalities;
- **TheiaECS_SourceGen**: source generator for the core library;
- **TheiaECS_Extended**: extended library that adds features;
- **TheiaECS_Extended_SourceGen**: source generator for the extended library;
- **TheiaECS_Tests**: basic test coverage for the core and extended libraries;
- **TheiaECS_Benchmark**: internal benchmark project for evaluating different approaches while developing the core or extended libraries.

Theia’s architecture can be summarized in a straightforward way as follows:

```
Cache
├── Arrays
├── Types
▾
World ◂ Assemblages
|
├── Archetypes
|      └── Chunks
└── Queries

```

Caching is used in `World`, `Assemblage`, `Archetype`, and `Query`. By caching array constructions along with type metadata, this information can be accessed rapidly throughout the system, **improving performance and reducing unnecessary overhead**.

Assemblages are pre-defined entity templates that allow ==consistent and fast entity creation with a specific set of components== by caching the matched Archetype’s unique identifier. Theia’s World is responsible for managing Entities, Archetypes, and creating Queries (in Theia, **a query is always strictly associated with a specific World**).

**Archetypes act as managers of the containers** (Chunks) that store the components of entities sharing a specific set of components in a **cache-friendly** manner. **Queries caches the matched Archetypes** based on a set of components or pre-defined Assemblage filter and can be executed by Worlds to perform actions on the matched components.

Theia Extended builds upon Theia’s core foundation, and its features, particularly Relations and World Serialization/Deserialization, rely on specific parts of the core system.

Overall, **the flow is quite simple**, but the real complexity comes from the optimizations. Theia’s systems leverage techniques, such as **pooling and caching (as mentioned earlier), unsafe code, `stackalloc`, and `Span<T>`**, to maximize performance and efficiency. Thanks to its open-source nature, the details of these optimizations can be observed directly in Theia’s source code.

### Quick Start

Theia Core and Extended libraries are **both available on NuGet**.

To add the core package to your .NET project:

`dotnet add package TheiaECS --version 1.0.3`

If you need additional features, you can include the extended version:

`dotnet add package TheiaECS_Extended --version 1.1.0`

Ensure your project targets **.NET 9 or newer**.

Below is a minimal code example:

```csharp
public struct Position
{
    public float X;
    public float Y;
}

public struct Velocity
{
    public float DX;
    public float DY;
}

World world = new();

Assemblage<Position, Velocity> walkers = new(world);
Query walkersQuery = world.CreateQuery(walkers);

walkers.Create(world, new Position { X = 0, Y = 0 }, new Velocity { DX = 1, DY = 2 });
walkers.Create(world, new Position { X = 10, Y = 5}, new Velocity { DX = 0.5f, DY = 0.5f });

world.ExecuteQueryAsProspective(
   walkersQuery,
   (ref Position pos, ref Velocity vel) =>
   {
         pos.X += vel.DX;
         pos.Y += vel.DY;
   }
);
```

All features are detailed and exemplified in Theia’s GitHub repository, which you can access [here](https://github.com/vrezendedev/TheiaECS).

It is one of my goals to create more detailed documentation, maybe even with a small mascot, to guide fellow developers through each step of using Theia ECS and Theia ECS Extended… but it’s time-demanding, so I’ll have to put that on hold for an undetermined period.

### Message from Developer

I’ve decided to create my own ECS framework because I believe it would be a valuable addition: a more opinionated, declarative, and expressive library. As I stated on Theia’s GitHub page:

> It is not supposed to enter into a competitive approach regarding other frameworks. It is created to do stuff in a way that I enjoy, and that’s it.

One of the library’s philosophies is to **maintain its simplicity**. So while new features may be added, you can expect more quality-of-life improvements than major feature updates.

Well, that’s it! Feel free to check out the [[Projects/Games/Sandtide|Sandtide]] posts about the game currently being developed with Theia.

Till next time!
