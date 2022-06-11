# Tic Tac Toe

Browser App to play remote with a friend. (Interview Test)

App Demo - [Loom](https://www.loom.com/share/fb897666dfde45ba8b14c8609b4fae52)

### Stack

- Turborepo
- Frontend -> vitejs, vue3, typescript, tailwindcss, socket.io
- Backend -> express, typescript, socket.io
- E2E -> cypress

### Possible Improvements

- Host ability to accept/decline opponent
- Detect when neither of the players can still win the game and declare a draw
- Login system
- Sessions / Keep the game rolling if one of the players disconnects for X time
- Move games from express memory to Redis
- Track user history wins/losses

### Project setup

```bash
$ git clone https://github.com/alexsserban/tic-tac-toe

$ cd tic-tac-toe

$ pnpm i # https://pnpm.io

$ cd apps/frontend

$ cp .env.example .env

$ vi .env # Default: VITE_API=http://localhost:4000/

$ cd ../backend

$ cp .env.example .env

$ vi .env # Default: PORT=4000 and FRONTEND=http://localhost:3000

$ cd ../..

$ pnpm run dev

Open new terminal tab

$ cd tic-tac-toe/apps/e2e

$ vi cypress.config.ts # Optional, if .envs changed from default

$ pnpm run cy:run OR pnpm run cy:open
```
