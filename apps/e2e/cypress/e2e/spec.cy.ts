import { io } from "socket.io-client";
import { JOIN_GAME, SYNC_PLAYER, PLAY } from "../../../../common/constants";

describe("Tic Tac Toe", () => {
  it("passes", () => {
    cy.viewport(1920, 1080);

    const socket = io(Cypress.env("backend"));
    const player = { id: "", name: "Andrew" };

    socket.on(SYNC_PLAYER, (playerData) => (player.id = playerData.id));

    cy.visit(Cypress.env("frontend"));

    // Add user name
    cy.get("input[type=text]").type("Alex");
    cy.get("button").click();

    // Create new game
    cy.contains("New Game").click();

    // Check waiting for opponent
    cy.get("h3")
      .invoke("text")
      .then((text) => {
        expect(text).to.eq("Status: Waiting opponent");
      });

    cy.get("h4")
      .invoke("text")
      .then((text) => {
        // Take created game ID
        const gameId = text.split(" ").pop();

        // Join game with second user
        socket.emit(JOIN_GAME, { player: { ...player, symbol: "O" }, gameId });

        cy.get("[id=status]")
          .invoke("text")
          .then((text) => {
            // The player for the first move is chosen random
            if (text == "Wait for Opponent")
              cy.wait(500).then(() => socket.emit(PLAY, { gameId, playerId: player.id, rowIndex: 2, colIndex: 2 }));

            // One move for both players
            cy.get("[id=board]>div")
              .eq(0)
              .find("div")
              .eq(2)
              .click()
              .then(() => socket.emit(PLAY, { gameId, playerId: player.id, rowIndex: 0, colIndex: 0 }));

            // Another move
            cy.get("[id=board]>div")
              .eq(2)
              .find("div")
              .eq(0)
              .click()
              .then(() => socket.emit(PLAY, { gameId, playerId: player.id, rowIndex: 1, colIndex: 0 }));

            // Another move
            cy.get("[id=board]>div").eq(1).find("div").eq(1).click();

            // Check game status
            cy.get("[id=status]")
              .invoke("text")
              .then((text) => {
                expect(text).to.eq("WON");
              });
          });
      });
  });
});
