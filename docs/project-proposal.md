# Project Proposal: Student-Athlete Burnout Simulator

For my Differential Equations final project, I am building a desktop-style simulator that models student-athlete burnout over time. The goal is to connect a real student experience to a system of differential equations that can be explained clearly in class. Instead of only writing equations on paper, the project lets the user adjust factors like school workload, training intensity, sleep, work responsibilities, and social support, then immediately see how the model changes.

Burnout matters because student-athletes often have several demanding schedules happening at once. A difficult week might include exams, practices, travel, part-time work, and not enough sleep. Even though this project is not a medical or clinical tool, it gives a simple mathematical way to think about how stress, energy, and recovery interact with each other.

The model uses three dependent variables:

- `S(t)`: stress
- `E(t)`: energy
- `R(t)`: recovery

The model also uses five outside inputs on a 0-10 scale:

- `A`: academic workload
- `T`: training intensity
- `W`: work responsibilities
- `L`: sleep
- `P`: social support

The system of differential equations is:

```text
dS/dt = aA + bT + cW - dR - eP
dE/dt = fR + gL - hS - iT - jW
dR/dt = kL + mP - nS - qT
```

The first equation says that stress increases when academics, training, and work increase. Stress decreases when recovery and social support are stronger. The second equation says that energy improves with recovery and sleep, but drops when stress, training, and work responsibilities are high. The third equation says recovery improves with sleep and support, but decreases when stress and training intensity are high.

To solve the system numerically, I will use Euler's Method:

```text
next value = current value + dt * rate of change
```

This works well for the project because it is simple enough to explain step by step, but it still shows the main idea of approximating a solution to a differential equation. The simulator updates stress, energy, and recovery once per time step, with `dt = 1`, so each step represents one day.

The final interface will be a Tauri desktop app with a simple JavaScript, HTML, and CSS frontend. It will have a left control panel with sliders, a main graph area, a right summary panel, and an equation explanation section. The graph will be drawn with an HTML canvas instead of a chart library so the project stays lightweight and easy to understand. Users will be able to choose presets like Finals Week, Heavy Training Week, Low Sleep Week, and Strong Support Week.

This project fits a Differential Equations final because it includes a coupled system, explains how variables influence each other through rates of change, and uses Euler's Method to approximate the solution. It also creates a visual connection between the math and a realistic situation, which should make the final presentation more engaging and easier to follow.
