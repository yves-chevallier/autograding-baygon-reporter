# GitHub Classroom Autograding Baygon

This action uses the output of Baygon to generate the tests results and update the final score on Classroom.

## Usage

```yaml
name: Autograding Tests
on:
  - push
  - workflow_dispatch
permissions:
  checks: write
  actions: read
  contents: read
jobs:
  autograding:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        id: baygon
        run: |
          make
          baygon --report > baygon-report.json
      - name: Autograding Reporter
        uses: ./
        with:
          report: baygon-report.json

```

## Output example

```text
Total points for python-test-with-score: 30.00/30

Test runner summary
┌────────────────────┬─────────────┬─────────────┐
│ Test Runner Name   │ Test Score  │ Max Score   │
├────────────────────┼─────────────┼─────────────┤
│ shout-test         │ 10          │ 10          │
├────────────────────┼─────────────┼─────────────┤
│ a-command-test     │ 20          │ 20          │
├────────────────────┼─────────────┼─────────────┤
│ python-test        │ 0           │ 0           │
├────────────────────┼─────────────┼─────────────┤
│ python-test-with-… │ 30          │ 30          │
├────────────────────┼─────────────┼─────────────┤
│ Total:             │ 60          │ 60          │
└────────────────────┴─────────────┴─────────────┘

Final score: 4.8/6
```
