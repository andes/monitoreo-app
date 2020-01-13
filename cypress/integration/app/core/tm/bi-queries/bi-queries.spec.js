/// <reference types="Cypress" />

context('bi-queries', () => {
    let token
    before(() => {
        cy.login('34934522', '34934522').then(t => {
            token = t;
            cy.log(t);
        });
    });

    beforeEach(() => {
        cy.server();
        cy.route('GET', '**/api/modules/bi-queries/biQueries**').as('getQueries');
        cy.goto('/bi-queries', token);
        cy.route('POST', '**/api/modules/bi-queries/descargarCSV').as('getCsv');
    });

    it('Cargar lista de queries al inicio de la pantalla', () => {
        cy.wait('@getQueries').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
        });
        cy.plexSelect('name="select"', 0);
    });

    it('Selecciona una query que contenga argumentos, carga los componenetes y descarga CSV', () => {
        cy.plexSelectType('name="select"', 'Listado de Profesionales por agenda')
        cy.get('plex-box').get('plex-title').get('div').contains('Ingrese los Argumentos');
        cy.plexDatetime('ng-reflect-name="fechaInicio"', '07/02/2017 01:46');

        cy.plexDatetime('ng-reflect-name="fechaFin"', '07/08/2018 08:46');
        cy.plexButton('Descargar').click();
        cy.wait('@getCsv').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
            expect(xhr.responseBody.size).to.be.gte(5); // 5 = tamaño con archivo cuando está vacío
            expect(xhr.responseBody.type).to.be.eq('text/html');
        });
    });
    it('Selecciona una query que no contenga argumentos y descarga CSV', () => {
        cy.plexSelectType('name="select"', 'Listado de Prestaciones de diabetes militus tipo 2')
        cy.get('plex-box').get('plex-title').should('not.contain', 'Ingrese los Argumentos');
        cy.plexButton('Descargar').click();
        cy.wait('@getCsv').then((xhr) => {
            expect(xhr.status).to.be.eq(200);
            expect(xhr.responseBody.size).to.be.gte(5); // 5 = tamaño con archivo cuando está vacío
            expect(xhr.responseBody.type).to.be.eq('text/html');
        });
    });

    it('Selecciona una queries con argumentos entre periodo de fechas con fecha inicio mayor que la final', () => {
        cy.plexSelectType('name="select"', 'Listado de Profesionales por agenda');
        cy.plexDatetime('ng-reflect-name="fechaInicio"', '07/02/2018 01:46');
        cy.plexDatetime('ng-reflect-name="fechaFin"', '07/08/2017 08:46');
        cy.plexButton('Descargar').click();
        cy.get('h2').contains('Error en Fechas');
        cy.get('button').contains('Aceptar').click();
    });

});
