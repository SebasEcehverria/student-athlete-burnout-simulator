# Student-Athlete Burnout Simulator

This project is a desktop-style Tauri app for a Differential Equations final. It models a student-athlete's stress, energy, and recovery over time using a coupled system of differential equations, then approximates the solution with Euler's Method.

The app is meant to be understandable and demo-ready for class. It is an educational model, not a medical, psychological, or clinical assessment tool.

## How to Run

Prerequisite: Tauri needs Rust installed. This repo includes `src-tauri/rust-toolchain.toml`, so rustup will use Rust 1.88.0 for the desktop build.

Install dependencies:

```bash
pnpm install
```

Launch the Tauri desktop app:

```bash
pnpm tauri dev
```

## Variables

The model tracks three changing variables:

- `S(t)`: stress
- `E(t)`: energy
- `R(t)`: recovery

The user controls five outside inputs on a 0-10 scale:

- `A`: academic workload
- `T`: training intensity
- `W`: work responsibilities
- `L`: sleep
- `P`: social support

## Differential Equations

The system is:

```text
dS/dt = aA + bT + cW - dR - eP
dE/dt = fR + gL - hS - iT - jW
dR/dt = kL + mP - nS - qT
```

Stress increases with academic workload, training, and work responsibilities. Stress decreases when recovery and social support are higher.

Energy increases with recovery and sleep. Energy decreases when stress, training intensity, and work responsibilities are higher.

Recovery increases with sleep and social support. Recovery decreases when stress and training intensity are higher.

## Euler's Method

The simulator uses Euler's Method:

```text
next value = current value + dt * rate of change
```

For each simulated day, the app calculates the current rates of change, updates stress, energy, and recovery, and clamps those values between 0 and 100.

## Burnout Risk

The app also calculates a simple burnout risk value:

```text
burnoutRisk = stress - 0.5 * energy - 0.5 * recovery
```

The category is:

- Low: risk is below 0
- Moderate: risk is 0 to 24.9
- High: risk is 25 or higher

## UI Features

- Desktop-style layout with control panel, graph, summary, and equation explanation
- Sliders for workload, training, work, sleep, support, days, and initial conditions
- Scenario presets for balanced weeks, finals, heavy training, low sleep, and strong support
- Canvas line chart for stress, energy, recovery, and burnout risk
- Editable athlete/profile name
- Light and dark theme toggle
- Reset button
