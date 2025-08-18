# TODO List

## Completed Tasks
- [x] Fix description field initialization in headerData
- [x] Add automatic description update from hero during parsing
- [x] Make description field always automatically synchronized with hero.subtitle

## In Progress
- [ ] Fix description synchronization when parsing full site via AI prompt

## Notes
- Description field should automatically sync with hero.subtitle both on manual changes and AI parsing
- Current issue: manual hero subtitle changes sync correctly, but AI parsing doesn't trigger sync
- Solution: Changed order of updates in AiParser to update headerData before heroData
