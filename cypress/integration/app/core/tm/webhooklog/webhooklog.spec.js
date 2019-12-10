/// <reference types="Cypress" />

context('WebhookLog', () => {
    let token
    before(() => {
        cy.login('34934522', '34934522').then(t => {

            token = t;
        });
    });

    beforeEach(() => {
        cy.server();
        cy.goto('/webhooklog', token);
    });

    /*  
    ///////////////////////
    /// CASOS DE EXITO
    ///////////////////////
    */
    it('Cargar lista de Webhooklogs, sin usar filtro', () => {
        cy.get('table').find('td').contains('1');
    });

    it('Cargar lista de Webhooklog, con filtro de texto', () => {
        cy.route('GET', '**/api/modules/webhooklogs?*citas').as('busqElem');
        cy.plexText('name="buscar"', 'citas');
        cy.wait('@busqElem').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });
        cy.get('table tbody tr').contains('citas');
    });

    it('Cargar lista de Webhooklog, con filtro de fecha inicio y fecha fin', () => {
        cy.route('GET', '**/api/modules/webhooklogs?*fecha=**').as('busquedaFecha');
        let dia = Cypress.moment().format('DD/MM/YYYY hh:mm');
        cy.plexDatetime('label="Desde"').find('input').type('07/08/2019 08:46');
        cy.plexDatetime('name="fechaF"').find('input').type('07/08/2019 08:46');

        cy.wait('@busqFecha').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        })
    });

    it('Ver detalles de un webhooklog', () => {
        cy.route('GET', '**/api/modules/webhooklogs/**').as('busqElem');
        cy.get('table tbody tr').contains('200').click();

        cy.wait('@busqElem').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        })

        cy.get('plex-layout-sidebar div div div div div span').contains('200').first();

    });

});