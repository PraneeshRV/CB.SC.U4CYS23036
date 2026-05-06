# Stage 1

## Priority Inbox

The app fetches the notifications from the API, and the priority is calculated with 2 things
1, weight
2, recent notifs priority

### Weight
Placement - 3
Result - 2
Event - 1

notifications are sorted by weight, if 2 notifications with same weight occur, they're sorted by recent notification first

the frontend refreshes every 15 seconds by calling the API and updates the notifications

for a very large volume of notification, I set the minimum heap size to 10
each notification gets a weight and timestamp so, if heap has less than 10,insert new notification, 
or remove the least weight and timestamp and insert new notification



