---
title: What is Sandtide?
date: 2026-02-04
tags:
  - sandtide
  - wise shepherd games
  - game development
---

Sandtide is a ==single-player old-school-like 2D isometric real-time strategy and management game with a extraction and roguelite twist==. Players expand their territory while fending off relentless attacks from colossal monsters. These **monsters are drawn to sound**, and **everything** the player creates or manages emits noise that can **attract them**. As time progresses and the player’s noise levels rise, ramping up the danger.

### Details

|                  |                                                        |
| :--------------: | :----------------------------------------------------- |
|    **Status**    | In Development                                         |
|    **Genres**    | Real Time Strategy; Management; Extraction; Roguelite. |
| **Release Date** | TBA                                                    |
|   **Platform**   | Windows / Linux                                        |

### Description

In the distant future, a new galaxy has been discovered, filled with floating islands containing **_Enud_**, the most valuable ore in the known universe. Commanders from various factions of the Universal Order have been chosen to explore these newly discovered lands. Choose between **unique playable factions**, explore **randomly generated isometric islands**, build structures, recruit units, produce resources, research new technologies, and **strive to survive**.

### Game Pillars

- Environment-Driven;
- Replayability;
- Micromanagement;
- Survivability (hard decision / fast thinking);
- Meta Progression.

### Game Modes

The game unfolds across multiple matches, each of which can be either timed, called _Excursions_ or timeless, called _Campaigns_. To survive a match, you must complete random tasks, harvest and extract Enud, and then evacuate.

![[sandtide-pre-alpha-procedural-generation.gif|640]]
Each match will **deterministically** and **procedurally generate an archipelago of floating islands** with diverse biomes based on the provided seed, ==as shown in the zoomed-out pre-alpha GIF displaying different generated islands==.

Matches can end in one of three ways: the **player’s complete annihilation**, **forced evacuation due to timeout**, or **successful completion of all objectives**, including evacuation.

After each match, players earn match points based on their performance, including faction experience. Points are calculated from various in-game factors like Enud collected, buildings created, units recruited, gadgets used, and more. **Factions also have a leveling system, enhancing replayability** by unlocking exclusive resources as players’ factions level up, encouraging new strategies and further progression.

### Factions

**Each faction has unique strengths and weaknesses** in core gameplay areas like harvesting & building, load & unload & trading, transmutation & engineering, and enlist & depart & engage & exploit. Four factions are currently in development, each distinct both mechanically and in terms of lore:

- Fornacis - Ore’s Architects;
- Sculptors - Enlightened Artisans;
- Vhelés - Urania’s Alchemist;
- Volans - Sky’s Sellswords.

### Technicalities

Sandtide is built on top of [MonoGame](https://monogame.net/) and an in-house, free and open-source ECS framework called Theia ECS. Due to the level of flexibility and control we wanted over our source code, we chose not to use a game engine and instead followed a more old-school development approach.

Since this is written by a programmer, I strongly believe that combining different programming paradigms like [object-oriented](https://en.wikipedia.org/wiki/Object-oriented_programming), [functional](https://en.wikipedia.org/wiki/Functional_programming), and [procedural](https://en.wikipedia.org/wiki/Procedural_programming), along with design approaches such as [data-oriented design](https://en.wikipedia.org/wiki/Data-oriented_design), is the best way to build a solid, maintainable, scalable, and high-performance codebase.

Details about specific implementations will likely be shared in the future, either from a more technical, [[Programming|programming]]-focused perspective or simply to showcase our progress and [[Projects/Games/Sandtide]] features.

### Message from Developer

Sandtide is a **passion project** heavily inspired by notorious science fiction and high fantasy, blending those influences with a love for old-school games. We strive to bring **something new to the table** and, along with it, **deliver both joy and challenge to our players**.
