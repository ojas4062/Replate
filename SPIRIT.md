# RePlate — SPIRIT / Engineering Principles

## 1. Build for the Demo, Not the Architecture Diagram
The team has 24 hours. Reliability matters more than framework count.

## 2. Truth Over Hype
Never present simulated data as real-world validation. Never claim the model guarantees food-waste reduction.

## 3. One Core Loop
Every feature should strengthen:

**Predict → Prepare → Measure → Improve**

If it does not strengthen this loop, it is probably out of scope.

## 4. Explainability Through Simplicity
A judge should understand the model inputs, prediction target, and metrics without a machine-learning lecture.

## 5. No Unnecessary AI
AI is useful when it solves a real problem. A language model is not required for RePlate MVP, so it is intentionally excluded.

## 6. No Fake Complexity
Do not add APIs, databases, authentication, agents, IoT, or microservices to appear more advanced.

## 7. Reproducibility
Use a fixed random seed for the synthetic data and model split so the demo behaves consistently.

## 8. Demo Safety
Every demo-critical path must work offline once dependencies are installed.

## 9. Honest Metrics
Use MAE/MAPE for prediction evaluation. Label simulated impact separately.

## 10. Scope Discipline
When in doubt between a new feature and polishing the core flow, polish the core flow.
