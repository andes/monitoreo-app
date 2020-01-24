/// <reference types="Cypress" />

context('Registro novedades', () => {
    let token
    before(() => {
        cy.login('34934522', '34934522').then(t => {
            token = t;
            cy.log(t);
        });
    });

    beforeEach(() => {
        cy.server();
        cy.route('GET', '**api/modules/registro-novedades/novedades**').as('getNovedades');
        cy.goto('/registro-novedades', token);
        cy.route('POST', '**/api/modules/registro-novedades/novedades').as('postNovedades');
    });


    it.skip('Cargar lista de novedades al inicio de la pantalla', () => {
        cy.wait('@getNovedades').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });
        cy.plexText('label="Filtrar: "', 0);
    });

    it('Registrar una Novedad y verificar que este en la lista', () => {
        let titulo = 'Cambio en registro de camas';
        cy.plexButton('Registrar Novedad').click();
        cy.plexBool('name="activo"', false);
        cy.plexSelectType('name="select"', 'INTERNACION');
        cy.plexText('label="titulo"', titulo);
        cy.plexDatetime('label="fecha"', '07/02/2020');

        //textArea no funciona:
        //  cy.get('textarea').last().type('Descripcion');

        // cy.get(`plex-text['label="descripcion "'] textarea`).first().type('Descripcion');
        // cy.plexTextArea('label="descripcion"', 'hhh');

        cy.plexButtonIcon('image-plus').click();

        cy.plexButton('Guardar').click();
        cy.wait('@postNovedades').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });

        //verificamos que la lista se carguenuevamente
        cy.wait('@getNovedades').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });
        cy.get('table tbody td').contains(titulo).click();
    });

});