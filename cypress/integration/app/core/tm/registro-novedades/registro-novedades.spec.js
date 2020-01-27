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
        cy.route('PATCH', '**/api/modules/registro-novedades/novedades/**').as('patchNovedades');
    });

    it('Cargar lista de novedades al inicio de la pantalla', () => {
        cy.wait('@getNovedades').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });
        cy.plexText('label="Filtrar: "', 0);
    });

    it('Registrar una Novedad y verificar que este en la lista', () => {
        let titulo = 'Cambio en registro de camas';
        let text = `alguna descripcion`;
        let modulo = 'INTERNACION';
        cy.plexButton('Registrar Novedad').click();
        cy.plexBool('name="activo"', false); // `Inactiva`
        cy.plexSelectType('name="select"', modulo);
        cy.plexText('label="titulo"', titulo);
        cy.plexDatetime('label="fecha"', '07/02/2020');

        //plexTextArea defiido no funciona (no escribe el texto), por eso se resolvió:
        let elem = cy.get(`plex-text[label="descripcion"] quill-editor div[class="ql-container ql-snow"] div p`);
        elem.type(text, {
            force: true
        });

        cy.plexButtonIcon('image-plus');

        cy.plexButton('Guardar').click();
        cy.wait('@postNovedades').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });

        //verificamos que la lista se cargue nuevamente
        cy.wait('@getNovedades').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });
        cy.get('table tbody td').contains(titulo);
        cy.get('table tbody td').contains(modulo);
        cy.get('table tbody td').contains(`Inactiva`);
    });

    it('Se busca la primer novedad cargada y se activa', () => {
        cy.get('table tbody td').find('span').should('have.class', 'badge badge-success badge-md').first().click();
        cy.plexBool('label="Activa"', true);
        cy.plexButton('Guardar').click();
        cy.wait('@patchNovedades').then((xhr) => { // verificamos que guarde el editar del registro
            expect(xhr.status).to.be.eq(200);
        });
        cy.get('table tbody td').find('span').should('have.class', 'badge badge-success badge-md').first().contains(' Activa ');
    });

});