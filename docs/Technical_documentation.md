# GMBU PROJECT

 ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/gb.png)

## Technical documentation

This file is a technical documentation of this project that aims to reproduce the game boy / gameboy color emulator on the web.

## Team
Apolline Saint Mleux ***apsaint-@student.42.fr***
Dove Palombo ***dpalombo@student.42.fr***
Abdeljalil NACEUR - ***contact@naceur-abdeljalil.com***

## Technologies
- Angular v10.0.14
- Electron v10.1.0
- Electron Builder v22.8.0

## What is an emulator?

To understand our project, it is necessary to learn what an emulator is and how it works.
An emulator is a computer or program that simulates or imitates another computer or program. 
In our project, we aim to make it possible to run a Gameboy or Gameboy Color ROM game on a computer. 
To realize that, we had to build a similar virtual architecture as the original Gameboy.

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/arch.png)

## Architecture

To be able to emulate a Gameboy, we have to understand The Gameboy computer like architecture.

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/Architecture_Overview_GB_Diagram.png)

### Interface

To emulate the Gameboy on a computer, we choose to make a web Application full Javascript. For the interface, we are using Angular, timescript and Electron.

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/homepage.JPG)

--------------------------------------------------------------------------------------------------

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/Capturegbc.JPG)


### CPU (Central Processing Unit)

The CPU in the Gameboy, like in a computer, is a processing Unit. In our case, it is single cycled which means that when the Gameboy starts or in ou case the program boot, it enters a single loop of operations:

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/CPU_Loop_Diagram.png)

To setup this loop of execution, we have to seperate different functionnalities into distinct blocks:

- Instruction Decoder
- Arithmetic Unit
- Current State Registers: as the CPU is running, it keeps a few state variables like the current location (pointer to the next).
- Memory interface (MMU Memory Management Unit): keep the result of execution and to fetch a program from

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/CPU_Detail_Diagram.png)

### Memory

The CPU previously describe needs to fetch instructions from the memory. Like a computer, the gameboy memory is not just one block locations. The CPU can access 65,536 locations and differents part of this address bus can be drawn to see where it has access:

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/Memory_Diagram.png)

  - BIOS: 256 bytes Gameboy Bios code. Once it has run, it's removed from the memory map and this area of the cartridge rom is accessable.
  - ROM (Read-Only Memory: 32k bytes): Cartridge ROM always available
  - Video or Graphic RAM (Random Access Memory: 8k bytes): Necessary data for the backgrounds and sprites accessible for the Graphic system. The cartridge can change these data
  - External RAM (Random Access Memory: 8k bytes): If needed, an additionnal RAM can be used here.
  - Working RAM (Random Access Memory: 8k bytes): Intern to the gameboy, Readable and writable by the CPU
  - Others:
    - Graphics (OAM): sprite information: sprites position and attributes
    - Memory Map I/O (IO Ports): controls values for the subsytem like sound. Available directly for the CPU.
    - Zero-Page RAM (128 bytes): 

To emulate the memory, we use arrays. The real emulation happens in the MMU (Memory Management Unit) which is a memory interface and manage the mapping:

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/Emulate_Mem_Diagram.png)

### Graphics

The Gameboy is limited to how much it can store in graphics. It can't use a classic frame buffer so it use a tiling system:
the game is allowed to build 8 pixel  by 8 pixel tiles and  place at a certain index each tile on the screen. 

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/Tiles.JPG)

In addition to the background, we have more element to print: sprites. Sprites are two dimensionals graphics that our integrated into a larger screen in our case the background. Sprites represents characters ou gameobject. A good example is a Goomba in Mario.

  ![alt text](https://github.com/abnaceur/abnaceur.github.io/blob/master/docs/img/Sprites.JPG)

In the emulation, the graphic aspect is manage by all the functions in the GPU emulation part. The function drawSprite manage the sprites integration to the background.

## Sources

	- https://www.lifewire.com/what-is-an-emulator-4687005
	- https://www.pastraiser.com/cpu/gameboy/gameboy_opcodes.html 
  - http://bgb.bircd.org/pandocs.htm#cpuregistersandflags
	
