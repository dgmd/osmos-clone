# Cloning Osmos, a lightweight example of object-oriented design

[_Osmos_](http://www.osmos-game.com/) is a beautiful game designed for the iPad and iPhone (but available on all platforms).  In it, 
> Your objective is to grow by absorbing other motes. Propel yourself by ejecting matter behind you. But be wise: ejecting matter also shrinks you. Relax… good things come to those who wait. Progress from serenely ambient levels into varied and challenging worlds. Confront attractors, repulsors and intelligent motes with similar abilities and goals as you.

In this demo, we're going to build up some similar functionality to Osmos as a way of exploring object-oriented design.  [Chapter 8 of _Eloquent JavaScript_](eloquentjavascript.net/chapter8.html) is a good text to accompany this.


## Suggested Extensions

1. Add the capacity to eject motes; first conserving mass, then conserving momentum (_i.e._ ejecting mass should speed your up, slow you down, or change your direction)

2. Add a physical interface to control some aspect of the `#me` blob's motion (direction, position, velocity), _etc._

3. Add the capacity to absorb/be absorbed depending on how long two motes are overlapping.

4. Add new types of blobs which can act to attract and repel other blobs.