# Database Structure  

## Requirement Notes  

### Reminders  

Basic reminders are easy to implement just with a timestamp, here are some examples:
- Remind me on Thurs 26th May 2022 at 16:00
- Remind me on Tuesday 3rd Jan 2023 at 10:00

Here are some use cases the reccuring reminder system must be able to represent:
- Remind me every day at 21:00
- Remind me at 7:30 on Tuesdays and Thursdays
- Remind me monthly on the 1st at 11:30
- Remind me every other Monday at 17:00
- Remind me every three months at 19:00

Implementation Ideas:
- Daily reminders and weekly reminders can be the same UI, for daily you would just specify every day of the week.
- Monthly reminders will need some thought, for example "Remind me on the 31st each month" isn't valid. Would the system allow this then just not remind users for months it's not valid?
- Could maybe store a start date, recur type and recur interval? Would that cover all use cases? Interval in days?
  - That wouldn't handle irregular recuring though such as "Tuesdays and Thursdays at 13:00"

### Journal
I imagine the "journal" functionality to be a more structured version of note taking optimized for things like https://www.themesystem.com/ or repetitive daily notes taking.
Part of this system should include some form of template that 



## Top Level Overview
- Notes
- Task Lists
  - Tasks
- Tags
- Reminders
  - Basic Reminders
  - Recurring Reminders
- Journal Entries
- Journal Templates?
- Note Templates?

## Content Model
Notes
- id
- name
- status (active, archived)
- body
- created_utc
- udpated_utc

Task Lists
- id
- name
- status (active, archived)
- created_utc
- udpated_utc

Tasks
- id
- name
- status (active, completed)
- task_list_id (FK)
- created_utc
- udpated_utc

Tags
- id
- name
- fg_colour
- bg_colour
- created_utc
- updated_utc

Reminders
- id
- name
- timestamp
- created_utc
- updated_utc

Recurring Reminders
- id
- name
- status (enabled, disabled)
- ???
