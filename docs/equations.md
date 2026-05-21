# Differential Equation Model

This project models student-athlete burnout using a coupled system of differential equations.

The three main variables are:

- `S(t)`: stress level
- `E(t)`: energy level
- `R(t)`: recovery level

where `t` represents time in days.

## Outside Inputs

The model uses five adjustable outside factors:

- `A`: academic workload
- `T`: training intensity
- `W`: work responsibilities
- `L`: sleep
- `P`: social support

Each input is measured on a scale from 0 to 10.

## System of Differential Equations

```text
dS/dt = aA + bT + cW - dR - eP
dE/dt = fR + gL - hS - iT - jW
dR/dt = kL + mP - nS - qT
```

## Explanation

The stress equation increases when academic workload, training intensity, and work responsibilities increase. Stress decreases when recovery and social support increase.

The energy equation increases when recovery and sleep increase. Energy decreases when stress, training intensity, and work responsibilities increase.

The recovery equation increases when sleep and social support increase. Recovery decreases when stress and training intensity increase.

This creates a feedback system where high stress can lower energy and recovery, while low recovery can make stress harder to manage.

## Euler's Method

The system is solved numerically using Euler's Method.

For each variable:

```text
next value = current value + step size * rate of change
```

So:

```text
S_next = S + dt(dS/dt)
E_next = E + dt(dE/dt)
R_next = R + dt(dR/dt)
```

This allows the simulator to approximate how stress, energy, and recovery change over time.
