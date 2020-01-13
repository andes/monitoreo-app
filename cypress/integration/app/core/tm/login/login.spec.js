/// <reference types="Cypress" />

context('Pagina de login', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad: (win) => {
                win.sessionStorage.clear()
            }
        });
    })

    it('login complete', () => {
        cy.server();
        cy.route('POST', '**/api/auth/login').as('login');

        cy.plexInt('name="usuario"').type('hola').should('have.value', '');
        cy.plexInt('name="usuario"').type('38906735').should('have.value', '38906735');
        cy.plexText('name="password"', 'anypasswordfornow').should('have.value', 'anypasswordfornow');

        cy.plexButton('Iniciar sesión').click();

        cy.wait('@login').then((xhr) => {
            expect(xhr.status).to.be.eq(200)
        });

        cy.get('app-home section plex-box div div div').find('[class="andes-inicio row"]').find('div[ label="Boton Conceptos Turneables"]');
    })

    it('login failed', () => {
        cy.server();
        cy.route('POST', '**/api/auth/login').as('login');

        cy.plexInt('name="usuario"').type('100001100010998771111');
        cy.plexText('name="password"', 'anypasswordfornow');
        cy.plexButton('Iniciar sesión').click();

        cy.wait('@login').then((xhr) => {
            expect(xhr.status).to.be.eq(403)
        });
    });
});
